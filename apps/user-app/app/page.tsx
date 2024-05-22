"use client";

import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { Box, Button, Container, Input, Typography } from "@mui/material";
import CreateCommentComponent from "../components/commnents/CreateCommentComponent";
import { getYtVideos } from "../actions/youtube";
import VideoEmbed from "../components/VideoEmbed";
import { getPosts } from "../actions/post";
import { getPost } from "../actions/post/types";

function Example() {
  const [video, setVideo] = useState([]) as any;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(35);

  useEffect(() => {
    async function fetchData() {
      try {
        // const response = await axios.get("/api/videos");
        const response=  await getPosts()
        console.log(response)
        let posts: getPost[] = []

        if ('data' in response) {
          const { data } = response;
          posts = data
          console.log(data);
        } else {
          const { error } = response;
          console.error(error);
        }
   
        setVideo(posts);
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
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % video.length);
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
        <VideoEmbed  videoId={`${video[currentVideoIndex]?.link}`} />
        <Button onClick={handleNextVideo} className="justify-end">
          Next
        </Button>
        <CreateCommentComponent postId={video[currentVideoIndex]?.id} />
      
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
                  {video[currentVideoIndex]?.comments[0].content}
          {/* {comments} */}
        </Box>
      </Container>
    </div>
  );
}

export default Example;