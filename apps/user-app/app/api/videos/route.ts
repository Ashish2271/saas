// import axios from "axios";
// import prisma  from '@repo/db/client'

// interface YouTubeVideoStat {
//   kind: "youtube#video";
//   etag: string;
//   id: string;
//   contentDetails: {
//     duration: string;
//     dimension: "2d" | "3d";
//     definition: "hd" | "sd";
//     caption: "true" | "false";
//     licensedContent: boolean;
//     contentRating: {};
//     projection: "rectangular" | "360" | "3d";
//   };
//   statistics: {
//     viewCount: number;
//     likeCount: number;
//     favoriteCount: number;
//     commentCount: number;
//   };
// }

// interface YouTubeSearchResult {
//   snippet: {
//     title: string;
//     channelTitle: string;
//     description: string;
//     categoryId: string;
//     liveBroadcastContent: string;
//     publishTime: Date;
//     publishedAt: Date;
//     thumbnails: {
//       default: { url: string };
//       medium: { url: string };
//       high: { url: string };
//       standard: { url: string };
//       maxres: { url: string };
//     };
//   };
//   id: {
//     kind: string;
//     videoId?: string;
//   };
//   statistics: {
//     viewCount: number;
//     likeCount: number;
//     dislikeCount: number;
//     favoriteCount: number;
//     commentCount: number;
//   };
// }

// const handler = async (_req: any, res: any) => {
//   try {
//     console.log("Starting Cron Job - Collecting Data from Youtube API...");

//     const params = {
//       baseUrl: "https://youtube.googleapis.com/youtube/v3/search?",
//       part: "snippet",
//       maxResults: 50,
//       query: "valorant%20clutch%20moment",
//       videoDuration: "short",
//       order: "date",
//       apiKey: process.env.YOUTUBE_API_KEY as string, // Store your API key in an environment variable
//       type: "video",
//       pageToken: "CDIQAA",
//     };

//     const apiUrl = `${params.baseUrl}part=${params.part}&maxResults=${params.maxResults}&q=${params.query}&videoDuration=${params.videoDuration}&order=${params.order}&key=${params.apiKey}&type=${params.type}&pageToken=${params.pageToken}`;

//     const response = await axios.get(apiUrl);

//     const videosData: YouTubeSearchResult[] = response.data.items;

//     let videoStats = videosData.map((video: YouTubeSearchResult) => {
//       const videoId = video.id.videoId;
//       const title = video.snippet.title;
//       const link = videoId;
//       const thumbnail = video.snippet.thumbnails.default.url;
//       const description = video.snippet.description;
//       return { videoId, title, link, thumbnail, description };
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

//     // Process and save the data with Prisma ORM

//     console.log("Completed Cron Job - Stored Data from Youtube API.");

//     res.status(200).json({ message: "Successfully executed the cron job." });
//   } catch (error: any) {
//     console.log(`Error during cron job execution: ${error.message}`);

//     res
//       .status(500)
//       .json({ error: error.message || "An unexpected error occurred." });
//   }
// };

// export default handler;

// const fetchStatsFromYouTube = async (
//   videoIds: string[]
// ): Promise<YouTubeVideoStat[]> => {
//   const API_KEY = "AIzaSyCIK1jmqlTU65CJtUXAzmQ6W6VFfCKD8yo"; // Store your API key in an environment variable
//   const STAT_URL = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`;

//   try {
//     const response = await axios.get(STAT_URL);

//     return response.data.items;
//   } catch (error) {
//     console.error(
//       `Error fetching stats for videos ${videoIds.join(", ")}:`,
//       error
//     );
//     throw error;
//   }
// };

