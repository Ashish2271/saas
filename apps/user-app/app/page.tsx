"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Container, Input, Typography } from "@mui/material";
import CreateCommentComponent from "../components/commnents/CreateCommentComponent";
import VideoEmbed from "../components/VideoEmbed";
import { getPosts } from "../actions/post";
import ShowComment from "../components/commnents/showcomments";

function Example() {
  const [video, setVideo] = useState([]) as any[];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await getPosts();

      if ("data" in response) {
        const { data } = response;
        setVideo(data);
      } else {
        const { error } = response;
        console.error(error);
      }
    } catch (error) {
      console.error("Error fetching video stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % video.length);
    console.log(currentVideoIndex);
  };

  return (
    <div className="flex justify-end ml-80 mt-10">
      <Container
        maxWidth="2xl"
        sx={{ pt: 1.5, "&": { px: { xs: 1.5, sm: 3 } } }}
      >
        <Typography className=" text-white">
          {video[currentVideoIndex]?.title}
        </Typography>
        {/* <YouTube
          videoId={video[currentVideoIndex]?.link}
          opts={opts}
          onReady={onPlayerReady}
        /> */}
        <VideoEmbed videoId={`${video[currentVideoIndex]?.link}`} />
        <Button onClick={handleNextVideo} className="justify-end">
          Next
        </Button>
        <CreateCommentComponent
          postId={video[currentVideoIndex]?.id}
          fetchData={fetchData}
        />
        <label className=" text-3xl text-white"> Comments </label>
        <Box
          width="100%"
          maxWidth="100%"
          overflow="hidden"
          height="100%"
          gridColumn="1/2"
          gridRow={{ sm: "4/5", md: "3/4" }}
          px={{ xs: 1.5, sm: 0 }}
          pb={2}
          color={"whitesmoke"}
        >
          {video[currentVideoIndex]?.comments.length > 0 && (
            <ul>
              {video[currentVideoIndex]?.comments.map((comment: any) => {
                return (
                  <div>
                    <li key={video.id}>{comment.content}</li>
                  </div>
                );
              })}
            </ul>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default Example;
