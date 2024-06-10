// import { NextApiRequest, NextApiResponse } from "next";
// import { createYoutubePost } from "../../../../actions/youtube";
// import { NextResponse } from "next/server";
// import * as cron from "node-cron";

// let videos: any;

// const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     // Call the createYoutubePost function here
//     videos = await createYoutubePost();

//     NextResponse.json({
//       videos,
//       message: "Successfully fetched and processed Youtube posts.",
//     });
//   } catch (error: any) {
//     console.error("Error while processing Youtube posts:", error);
//     NextResponse.json({
//       message: "An error occurred while processing Youtube posts.",
//       error: error.toString(),
//     });
//   }
// };

// export const GET = async () => {
//   const schedule = process.env.CRON_SCHEDULE || "59 23 * * *";
//   cron.schedule(schedule, async () => {
//     console.info(`Running scheduled task "${schedule}"`);
//     await handler(null!, null!);
//   });

   
//   return NextResponse.json({
//     message: "Starting scheduled task",
//     videos,
//   });
// };
