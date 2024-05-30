import type { NextApiRequest, NextApiResponse } from "next";
import * as cron from "node-cron";
import { createYoutubePost } from "../../../../actions/youtube";
import { NextResponse } from "next/server";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Call the createYoutubePost function here
    await createYoutubePost();

   NextResponse.json({
     message: "Successfully fetched and processed Youtube posts.",
   });
  } catch (error: any) {
    console.error("Error while processing Youtube posts:", error);
    NextResponse.json({
      message: "An error occurred while processing Youtube posts.",
      error: error.toString(),
    });
  }
};

export const GET = async () => {
  // Schedule daily execution of the job at 11:59 PM
  const schedule = process.env.CRON_SCHEDULE || "59 23 * * *";
  cron.schedule(schedule, () => {
    console.info(`Running scheduled task "${schedule}"`);
    handler(null!, null!);
  });
// handler(null!, null!);

  return NextResponse.json({
    message: "Starting scheduled task"
  })

};
