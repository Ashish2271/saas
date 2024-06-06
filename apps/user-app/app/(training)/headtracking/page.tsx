
'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const targetSize = 10; // Size of the targets
const gameDuration = 30000; // 30 seconds

const SixShotGame = () => {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration / 1000);

  useEffect(() => {
    // Start the game timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    // Generate initial targets
    generateTargets();

    return () => clearInterval(timer);
  }, []);

  const generateTargets = () => {
    const newTargets = [];
    for (let i = 0; i < 9; i++) {
      newTargets.push(generateRandomTarget());
    }
    //@ts-ignore
    setTargets(newTargets);
  };

  const generateRandomTarget = () => {
    const x = Math.random() * (window.innerWidth - targetSize);
    const y = Math.random() * (window.innerHeight - targetSize);
    return { x, y };
  };

  const handleTargetClick = (index:any) => {
    setTargets((prevTargets) => {
      const newTargets = [...prevTargets];
      //@ts-ignore
      newTargets[index] = generateRandomTarget();
      return newTargets;
    });
    setScore((prevScore) => prevScore + 1); // Use functional state update to ensure the score increments correctly
  };

  return (
    <div>
      <div className="select-none absolute top-10 left-10">
        Score: {score} | Time Left: {timeLeft}s
      </div>
      {timeLeft > 0 ? (
        targets.map((target, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              //@ts-ignore
              position: 'absolute',
              //@ts-ignore

              top: target.y,
              //@ts-ignore

              left: target.x,
              width: targetSize,
              height: targetSize,
              backgroundColor: 'red',
              borderRadius: '50%',
              // cursor: 'pointer',
            }}
            onMouseDown={() => handleTargetClick(index)} // Change to onMouseDown
          />
        ))
      ) : (
        <div className="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Game Over! Your score is {score}
        </div>
      )}
    </div>
  );
};

export default SixShotGame;





// 'use client'



// // Import required libraries
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// declare global {
//   interface Window {
//     navigator: any;
//     MediaStreamTrackEvents: any;
//   }
// }

// const HEAD_TRACKING_POINTS = 3;

// interface Props {}

// function HeadTracker({}: Props) {
//   const [isCameraAvailable, setIsCameraAvailable] = useState(false);
//   const [streamData, setStreamData] = useState(null as unknown | null);

//   // Request permissions for getting video data from the browser
//   function requestPermission() {
//     return new Promise((resolve, reject) => {
//       try {
//         navigator.mediaDevices
//           .getUserMedia({ video: true })
//           .then((stream: any) => resolve([true, stream]))
//           .catch(() => resolve([false]));
//       } catch (error) {
//         console.log('Error occurred', error);
//         reject();
//       }
//     });
//   }

//   // Get position of the nose point and calculate rotation values
//   function updateRotationValues(posePoints: any[]) {
//     if (!posePoints || posePoints.length === 0) {
//       return [];
//     }

//     const noseIndex = posePoints.findIndex(
//       ({ part }) => part && part.name === 'nose'
//     );

//     if (noseIndex > -1) {
//       const x = posePoints[noseIndex].position.x;
//       const y = posePoints[noseIndex].position.y;
//       const z = posePoints[noseIndex].position.z;

//       const rotations = Array(HEAD_TRACKING_POINTS).fill(0);

//       if (x !== undefined && y !== undefined && z !== undefined) {
//         // Calculate rotations based on sample points here
//       }

//       return rotations;
//     }

//     return [];
//   }

//   // Set the state when permission status changes
//   window.navigator.addEventListener(
//     'permissionchange',
//     () => {
//       requestPermission().then((result) => {
//         setIsCameraAvailable(result[0]);
//       });
//     },
//     false
//   );

//   // Check initial permission
//   useEffect(() => {
//     requestPermission().then((result) => {
//       setIsCameraAvailable(result[0]);
//     });
//   }, []);

//   // Handle updates from the stream and extract position information
//   useEffect(() => {
//     if (streamData instanceof MediaStream) {
//       const tracks = streamData.getVideoTracks()[0];
//       tracks.onended = () => {};

//       const handler = (event: any) => {
//         const posePoints = event.data['pose'];
//         const rotations = updateRotationValues(posePoints);

//         // Use these values to move elements around
//       };

//       tracks.addEventListener('pose', handler);

//       return () => {
//         tracks.removeEventListener('pose', handler);
//       };
//     }
//   }, [streamData]);

//   // Render UI depending on whether the camera is available or not
//   return (
//     <div className="flex h-screen items-center justify-center">
//       {!isCameraAvailable ? (
//         <button onClick={() => requestPermission()} className="btn btn-primary">
//           Allow Camera Access
//         </button>
//       ) : streamData === null ? (
//         <button onClick={() => setStreamData(navigator.mediaDevices)} className="btn btn-primary">
//           Start Camera Feed
//         </button>
//       ) : (
//         <AnimatePresence exitBeforeEnter={true}>
//           <motion.div
//             key={'head'}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//             style={{ transformStyle: 'preserve-3d' }}
//           />
//         </AnimatePresence>
//       )}
//     </div>
//   );
// }

// export default HeadTracker;
