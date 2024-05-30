"use server";

import prisma from "@repo/db/client";
import axios from "axios";
import { PostType, LinkType, post } from "@prisma/client";

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

export const createYoutubePost = async (): Promise<
  { data: post[] } | { error: any }
> => {
  const params = {
    baseUrl: "https://youtube.googleapis.com/youtube/v3/search?",
    part: "snippet",
    maxResults: 50,
    query: "valorant%20clutch%20moment",
    videoDuration: "short",
    order: "date",
    apiKey: "AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo", // Store your API key in an environment variable
    type: "video",
    pageToken: "CDIQAA",
  };

  const authorId = "clwqkj6qy0000szfnkl6un9qo";
  try {
    const apiUrl = `${params.baseUrl}part=${params.part}&maxResults=${params.maxResults}&q=${params.query}&videoDuration=${params.videoDuration}&order=${params.order}&key=${params.apiKey}&type=${params.type}&pageToken=${params.pageToken}`;

    const response = await axios.get(apiUrl);

    const videosData: YouTubeSearchResult[] = response.data.items;

    let videoStats = videosData.map((video: YouTubeSearchResult) => {
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const link = videoId;
      const thumbnail = video.snippet.thumbnails.default.url;
      const description = video.snippet.description;
      return { videoId, title, link, thumbnail, description };
    });

    const videoIds = videoStats.map((video: any) => video.videoId);
    const statsData = await fetchStatsFromYouTube(videoIds);

    const mergedVideoStats = videoStats.map((video) => {
      const stats = statsData.find((stat) => stat.id === video.videoId);
      return {
        ...video,
        ...stats,
      };
    });

    // console.log(videosData);
    try {
      await Promise.all(
        mergedVideoStats.map(async (videoStat) => {
          // console.log(statsData);
          const statistics = videoStat.statistics;
          // console.log(statistics && statsData);

          const viewCount = statistics?.viewCount ?? 0;
          const likeCount = statistics?.likeCount ?? 0;
          const favoriteCount = statistics?.favoriteCount ?? 0;
          const commentCount = statistics?.commentCount ?? 0;

          const ratings =
            (likeCount + favoriteCount + commentCount) / viewCount || 0;

          const postObject = {
            title: videoStat.title as string,
            link: videoStat.link as string,
            linkType: LinkType.YOUTUBE,
            description: videoStat.description as string,
            thumbnail: videoStat.thumbnail as string,
            type: PostType.LONG,
            ratings,
          };

          console.log(postObject);

          const existingPost = await prisma.post.findUnique({
            where: { link: postObject.link },
          });

          let newRatings = postObject.ratings;

          // Step 2: Compute new ratings if the post exists
          if (existingPost) {
            const { upvotes, downvotes } = existingPost;
            newRatings += upvotes - downvotes;

            await prisma.post.update({
              where: { id: existingPost.id },
              data: { ratings: newRatings },
            });
          } else {
            await prisma.post.create({
              data: { ...postObject, author: { connect: { id: authorId } } },
            });
          }
        })
      );
    } catch (error) {
      console.log(error);
    }

    const post = await prisma.post.findMany();

    return { data: post };
  } catch (error: any) {
    return { error: error.message || "Failed to create post from youtube." };
  }
};

export const getYtVideos = async (): Promise<
  { data: post[] } | { error: any }
> => {
  try {
    const post = await prisma.post.findMany();

    return { data: post };
  } catch (error: any) {
    return { error: error.message || "Failed to create post from youtube." };
  }
};
