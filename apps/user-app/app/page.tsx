'use client'
import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';

function Example() {
  const [videoStats, setVideoStats] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/videos');
        setVideoStats(response.data);
        console.log(response.data.videoId)
      } catch (error) {
        console.error('Error fetching video stats:', error);
      }
    }

    fetchData();
  }, []);

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  const onPlayerReady = (event:any) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoStats.length);
  };

  return (
    <div>
      <h3>{videoStats[currentVideoIndex]?.title}</h3>
      <YouTube videoId={videoStats[currentVideoIndex]?.videoId} opts={opts} onReady={onPlayerReady} />
      <button onClick={handleNextVideo}>Next</button>
    </div>
  );
}

export default Example;
