"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Container, Input, Typography } from "@mui/material";
import CreateCommentComponent from "./commnents/CreateCommentComponent";
import { getPosts } from "../actions/post";
import ShowComment from "./commnents/showcomments";
import Vote from "./Vote";
import axios from "axios";
import { getPost } from "../actions/post/types";


type Props = {
  data: getPost[];
};

const fetchData = () =>{}

const VideoEmbed = ({ data }: any) => {
  const [video, setVideo] = useState<getPost[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  useEffect(() => {
    setVideo(data);
  }, [data]);

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
    <Box width="100%" height="100%">
      {video[currentVideoIndex] && (
        <div>
          <Typography className=" text-white">
            {video[currentVideoIndex]?.title}
            {/* {video[currentVideoIndex]?.ratings} */}
          </Typography>

          <iframe
            src={`https://www.youtube.com/embed/${video[currentVideoIndex]?.link}?&autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            height="500"
            width="800"
          />
          <Button onClick={handleNextVideo} className="justify-end">
            Next
          </Button>
          <Vote
            postId={video[currentVideoIndex]?.id}
            upVotes={video[currentVideoIndex]?.upvotes as any}
            downVotes={video[currentVideoIndex]?.downvotes as any}
            voteType={"UPVOTE"}

            // commentId= { undefined}
          />
          <CreateCommentComponent
            postId={video[currentVideoIndex]?.id as any}
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
            {video[currentVideoIndex].comments.length > 0 && (
              <ul>
                {video[currentVideoIndex]?.comments.map((comment: any) => {
                  return (
                    <div>
                      <li key={video[currentVideoIndex]?.id}>
                        {comment.content}
                      </li>
                    </div>
                  );
                })}
              </ul>
            )}
          </Box>
        </div>
      )}
    </Box>
  );
};

export default VideoEmbed;
