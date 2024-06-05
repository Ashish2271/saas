"use server";

import prisma from "@repo/db/client";
import axios from "axios";
import { PostType, LinkType, post, Prisma } from "@prisma/client";
import moment from "moment";

interface YouTubeVideoStat {
  kind: "youtube#video";
  etag: string;
  id: string;
  contentDetails: {
    duration: string;
    dimension: "2d" | "3d";
    definition: "hd" | "sd";
    caption: "true" | "false";
    licensedContent: boolean;
    contentRating: {};
    projection: "rectangular" | "360" | "3d";
  };
  statistics: {
    viewCount: number;
    likeCount: number;
    favoriteCount: number;
    commentCount: number;
  };
}

interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: ThumbnailInfo;
      medium: ThumbnailInfo;
      high: ThumbnailInfo;
    };
    channelTitle: string;
    liveBroadcastContent: "none" | "upcoming" | "live";
    publishTime: Date;
  };
}

interface ThumbnailInfo {
  url: string;
  width: number;
  height: number;
}

interface MergedVideoStats {
  kind: string;
  etag: string;
  id: string;
  contentDetails?:
    | {
        duration: string;
        dimension: "2d" | "3d";
        definition: "hd" | "sd";
        caption: "true" | "false";
        licensedContent: boolean;
        contentRating: {};
        projection: "rectangular" | "360" | "3d";
      }
    | undefined;
  statistics?:
    | {
        viewCount: number;
        likeCount: number;
        favoriteCount: number;
        commentCount: number;
      }
    | undefined;
  snippet: {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: ThumbnailInfo;
      medium: ThumbnailInfo;
      high: ThumbnailInfo;
    };
    channelTitle: string;
    liveBroadcastContent: "none" | "upcoming" | "live";
    publishTime: Date;
  };
}
[];

const fetchStatsFromYouTube = async (
  videoIds: string[]
): Promise<YouTubeVideoStat[]> => {
  const API_KEY = "AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo"; // Store your API key in an environment variable
  const STAT_URL = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`;

  try {
    const response = await axios.get(STAT_URL);

    return response.data.items;
  } catch (error) {
    console.error(
      `Error fetching stats for videos ${videoIds.join(", ")}:`,
      error
    );
    throw error;
  }
};

export const getVideosByDateRange = async (
  query?: string,
  length?: string,
  pageToken?: string,
  daysBackward?: number
): Promise<YouTubeSearchResult[] | any> => {
  const params = {
    baseUrl: "https://youtube.googleapis.com/youtube/v3/search?",
    part: "snippet",
    maxResults: 50,
    q: query || "valorant%20clutch%20moment",
    videoDuration: "short",
    order: "date",
    apiKey: process.env.API_KEY || "AIzaSyCmjsf24zHFFSPeqQjDyo0DBjYVLIyfwGU",
    type: "video",
    pageToken: pageToken ? pageToken : "",
  };

  const beginningOfCurrentDay = new Date().getDate();

  let nextPageToken = "";
  let endOfRangeDate = new Date();
  endOfRangeDate.setDate(endOfRangeDate.getDate() - (daysBackward || 0));
  endOfRangeDate.setUTCHours(0, 0, 0, 0);

  const result: YouTubeSearchResult[] = [];

  let count = 0;
  while (true) {
    const apiUrl = `${params.baseUrl}part=${params.part}&maxResults=${params.maxResults}${
      params.pageToken ? `&pageToken=${params.pageToken}` : ""
    }&q=${params.q}&videoDuration=${params.videoDuration}&order=${params.order}&key=${params.apiKey}&type=${params.type}${
      params.pageToken ? `&pageToken=${params.pageToken}` : ""
    }`;

    console.log(apiUrl);

    let response;

    try {
      response = await axios.get(apiUrl);
    } catch (error: any) {
      console.log(error.message);
    }

    const videosData = response?.data.items;

    result.push(...videosData);

    // adjustment starts here
    const firstVideoDate = new Date(
      videosData[0].snippet.publishedAt
    ).getDate();
    if (firstVideoDate != 4) {
      console.log(
        "Stopping early because the first video was not from today -> ",
        videosData[0]
      );
      break;
    }
    // adjustment ends here

    const remainingItemsLength =
      response?.data.pageInfo.totalResults % params.maxResults;
    if (remainingItemsLength > 0) {
      params.maxResults -= remainingItemsLength;
    }

    if (!response?.data.nextPageToken) break;
    nextPageToken = response?.data.nextPageToken;
    params.pageToken = nextPageToken;

    count++;
    if (count > 3) break;
  }

  const filteredVideos = result.filter((video) => {
    const videoDate = new Date(video.snippet.publishedAt).getDate();
    return videoDate >= beginningOfCurrentDay;
  });

  return filteredVideos;
};

const mergeVideoStatsWithDetails = async (
  videos: YouTubeSearchResult[]
): Promise<any[]> => {
  const videoIds = videos.map((video: any) => video.id.videoId);
  const statsData = await fetchStatsFromYouTube(videoIds);

  const mergedVideoStats = videos.map((video) => {
    const stats = statsData.find((stat) => stat.id === video.id.videoId);
    return {
      ...video,
      ...stats,
    };
  });

  return mergedVideoStats;
};

const computeRatingsAndStoreToDatabase = async (
  mergedVideoStats: MergedVideoStats[],
  authorId: string
): Promise<void> => {
  const postObjects = mergedVideoStats.flatMap((videoStat) => {
    const statistics = videoStat.statistics;
    const viewCount = statistics?.viewCount ?? 0;
    const likeCount = statistics?.likeCount ?? 0;
    const favoriteCount = statistics?.favoriteCount ?? 0;
    const commentCount = statistics?.commentCount ?? 0;
    let ratings = 0

    if (viewCount != 0 ) {
      ratings = (likeCount + favoriteCount + commentCount) / viewCount;
    }

    return [
      {
        title: videoStat.snippet.title,
        link: videoStat.id,
        linkType: LinkType.YOUTUBE,
        description: videoStat.snippet.description,
        thumbnail: videoStat.snippet.thumbnails.default.url,
        type: PostType.LONG,
        ratings: ratings === Infinity ? 0 : ratings,
        createdAt: videoStat.snippet.publishedAt,
      },
    ];
  });

  try {
    await Promise.all(
      postObjects.map(async (postObject) => {
        const existingPost = await prisma.post.findUnique({
          where: { link: postObject.link },
        });

        let newRatings = postObject.ratings;

        if (existingPost) {
          const { upvotes, downvotes } = existingPost;
          newRatings += upvotes - downvotes;

          const post = await prisma.post.update({
            where: { id: existingPost.id },
            data: { ratings: newRatings },
          });

          console.log('update -> ', post)
        } else {
          console.log(postObject.link, "-> ratings:", postObject.ratings);

          const post = await prisma.post.create({
            data: {
              ...postObject,
              author: { connect: { id: authorId } },
            },
          });

          console.log('create -> ', post)
        }
      })
    );
  } catch (error) {
    console.log(error);
    console.log(postObjects);
  }
};

export const createYoutubePost = async (
  query?: string,
  length?: string,
  pageToken?: string
): Promise<{ data: post[] } | { error: any }> => {
  const videos = await getVideosByDateRange("valorant%20clutch%20moment");
  if (!videos.length) {
    return { error: "No videos found" };
  }

  const mergedVideoStats = await mergeVideoStatsWithDetails(videos);
  await computeRatingsAndStoreToDatabase(
    mergedVideoStats,
    "clwqkj6qy0000szfnkl6un9qo"
  );
  const currentDateTime = moment().startOf("day");

  const post = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: currentDateTime.toISOString(),
      },
    },
  });

  return { data: post };
};

// export const createYoutubePost = async (
//   query?: string,
//   length?: string,
//   pageToken?: string
// ): Promise<{ data: post[] } | { error: any }> => {
//   const params = {
//     baseUrl: "https://youtube.googleapis.com/youtube/v3/search?",
//     part: "snippet",
//     maxResults: 50,
//     query: query ? query : "valorant%20clutch%20moment",
//     videoDuration: "short",
//     order: "date",
//     apiKey: "AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo", // Store your API key in an environment variable
//     type: "video",
//     pageToken: pageToken ? pageToken : "",
//   };

//   const authorId = "clwqkj6qy0000szfnkl6un9qo";
//   try {
//     const apiUrl = `${params.baseUrl}part=${params.part}&maxResults=${params.maxResults}&q=${params.query}&videoDuration=${params.videoDuration}&order=${params.order}&key=${params.apiKey}&type=${params.type}&pageToken=${params.pageToken}`;

//     const response = await axios.get(apiUrl);

//     const videosData: YouTubeSearchResult[] = response.data.items;

//     let videoStats = videosData.map((video: YouTubeSearchResult) => {
//       const videoId = video.id.videoId;
//       const title = video.snippet.title;
//       const link = videoId;
//       const publishedAt = video.snippet.publishedAt;
//       const thumbnail = video.snippet.thumbnails.default.url;
//       const description = video.snippet.description;
//       return { videoId, title, link, thumbnail, description, publishedAt };
//     });

//     const videoIds = videoStats.map((video: any) => video.videoId);
//     const statsData = await fetchStatsFromYouTube(videoIds);

//     const mergedVideoStats = videoStats.map((video) => {
//       const stats = statsData.find((stat) => stat.id === video.videoId);
//       return {
//         ...video,
//         ...stats,
//       };
//     });

//     // console.log(mergedVideoStats);
//     try {
//       await Promise.all(
//         mergedVideoStats.map(async (videoStat) => {
//           // console.log(statsData);
//           const statistics = videoStat.statistics;
//           // console.log(statistics && statsData);

//           const viewCount = statistics?.viewCount ?? 0;
//           const likeCount = statistics?.likeCount ?? 0;
//           const favoriteCount = statistics?.favoriteCount ?? 0;
//           const commentCount = statistics?.commentCount ?? 0;

//           const ratings =
//             (likeCount + favoriteCount + commentCount) / viewCount || 0;

//           const postObject = {
//             title: videoStat.title as string,
//             link: videoStat.link as string,
//             linkType: LinkType.YOUTUBE,
//             description: videoStat.description as string,
//             thumbnail: videoStat.thumbnail as string,
//             type: PostType.LONG,
//             ratings,
//           };

//           // console.log(postObject);

//           const existingPost = await prisma.post.findUnique({
//             where: { link: postObject.link },
//           });

//           let newRatings = postObject.ratings;
//           console.log(newRatings);
//           // Step 2: Compute new ratings if the post exists
//           if (existingPost) {
//             const { upvotes, downvotes } = existingPost;
//             newRatings += upvotes - downvotes;

//             await prisma.post.update({
//               where: { id: existingPost.id },
//               data: { ratings: newRatings },
//             });
//           } else {
//             await prisma.post.create({
//               data: { ...postObject, author: { connect: { id: authorId } } },
//             });
//           }
//         })
//       );
//     } catch (error) {
//       console.log(error);
//     }

//     const post = await prisma.post.findMany();

//     return { data: post };
//   } catch (error: any) {
//     return { error: error.message || "Failed to create post from youtube." };
//   }
// };

export const getYtVideos = async (): Promise<
  { data: post[] } | { error: any }
> => {
  try {
   const currentDateTime = moment().startOf("day");

   const post = await prisma.post.findMany({
     where: {
       createdAt: {
         gte: currentDateTime.toISOString(),
       },
     },
   });;

    return { data: post };
  } catch (error: any) {
    return { error: error.message || "Failed to create post from youtube." };
  }
};
