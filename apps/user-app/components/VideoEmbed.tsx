'use client'
import { Box } from '@mui/material'
import YouTube from 'react-youtube'

type Props = {
	videoId: string
}

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

const VideoEmbed = ({ videoId }: Props) => {
	return (
    <Box width="100%" height="100%">
      {videoId}
      {/* <iframe
        src={`https://www.youtube.com/embed/${videoId}?&autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: "none", height: "500", width: "800" }}
      /> */}
      <YouTube
        videoId={`${videoId}`}
        opts={opts}
        onReady={onPlayerReady}
      />
    </Box>
  );
}

export default VideoEmbed
