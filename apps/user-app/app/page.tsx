"use client";

import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { Button, Container, Typography } from "@mui/material";

function Example() {
  const [videoStats, setVideoStats] = useState([]) as any;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/videos");
        setVideoStats(response.data);
        // console.log(response.data.videoId)
      } catch (error) {
        console.error("Error fetching video stats:", error);
      }
    }

    fetchData();
  }, []);

  const opts = {
    height: "500",
    width: "800",
    playerVars: {
      autoplay: 1,
    },
  };

  const onPlayerReady = (event: any) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoStats.length);
  };

  return (
    <div className="flex justify-end ml-80 mt-10">
      <Container
        maxWidth="2xl"
        sx={{ pt: 1.5, "&": { px: { xs: 1.5, sm: 3 } } }}
      >
        <Typography className=" text-white">
          {videoStats[currentVideoIndex]?.title}
        </Typography>
        <YouTube
          videoId={videoStats[currentVideoIndex]?.videoId}
          opts={opts}
          onReady={onPlayerReady}
        />
        <Button onClick={handleNextVideo} className="justify-end">Next</Button>
      </Container>
    </div>
  );
}

export default Example;
