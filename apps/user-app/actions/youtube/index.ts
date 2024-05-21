"use server";

import prisma from "@repo/db/client";
import axios from "axios";
import { PostType, LinkType, post } from "@prisma/client";

const fetchStatsFromYouTube = async (videoIds: string[]) => {
  const API_KEY = "AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo"; // Store your API key in an environment variable
  const STAT_URL = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`;

  try {
    const response = await axios.get(STAT_URL);
    return response.data;
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

  const authorId = "clwgg6zps00005kxj310v4rt2";
  try {
    const apiUrl = `${params.baseUrl}part=${params.part}&maxResults=${params.maxResults}&q=${params.query}&videoDuration=${params.videoDuration}&order=${params.order}&key=${params.apiKey}&type=${params.type}&pageToken=${params.pageToken}`;

    const response = await axios.get(apiUrl);
    const videosData = response.data;

    const videoStats = videosData.items.map((video: any) => {
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const link = videoId;
      const thumbnail = video.snippet.thumbnails.default.url;
      const description = video.snippet.description;
      return { videoId, title, link, thumbnail, description };
    });

    const videoIds = videoStats.map((video: any) => video.videoId);
    const statsData = await fetchStatsFromYouTube(videoIds);

    // console.log(videosData);
    await Promise.all(
      videoStats.map(async (videoStat: any) => {
       
        console.log(statsData);

        if (statsData.items && statsData.items.length > 0) {
          const statistics = statsData.items[0].statistics;
          const ratings = (statistics.likeCount + statistics.favoriteCount + statistics.commentCount ) / statistics.viewCount

          const postObject = {
            title: videoStat.title,
            link: videoStat.link,
            linkType: LinkType.YOUTUBE,
            description: videoStat.description,
            thumbnail: videoStat.thumbnail,
            type: PostType.LONG,
            authorId: "clwgg6zps00005kxj310v4rt2", // Replace with the actual author ID
            ratings
          };
          await prisma.post.create({ data: postObject });
        } else {
          console.error(`Stats not found for video ${videoStat.videoId}`);
        }
      })
    );

    const post = await prisma.post.findMany();

    return { data: post };
  } catch (error: any) {
    return { error: error.message || "Failed to create post from youtube." };
  }
};
