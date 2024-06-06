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