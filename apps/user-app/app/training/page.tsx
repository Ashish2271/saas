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
    setTargets(newTargets);
  };

  const generateRandomTarget = () => {
    const x = Math.random() * (window.innerWidth - targetSize);
    const y = Math.random() * (window.innerHeight - targetSize);
    return { x, y };
  };

  const handleTargetClick = (index) => {
    setScore(score + 1);
    setTargets((prevTargets) => {
      const newTargets = [...prevTargets];
      newTargets[index] = generateRandomTarget();
      return newTargets;
    });
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
              position: 'absolute',
              top: target.y,
              left: target.x,
              width: targetSize,
              height: targetSize,
              backgroundColor: 'red',
              borderRadius: '50%',
              // cursor: 'pointer',
            }}
            onClick={() => handleTargetClick(index)}
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


// import { useEffect, useState, useRef, useCallback } from 'react';

// export default function Game() {
//   const [targets, setTargets] = useState([]);
//   const [score, setScore] = useState(0);
//   const gameAreaRef = useRef(null);

//   useEffect(() => {
//     generateTargets();
//   }, []);

//   const generateTargets = () => {
//     const newTargets = [];
//     for (let i = 0; i < 6; i++) {
//       newTargets.push({
//         id: i,
//         x: Math.random() * 90 + '%',
//         y: Math.random() * 90 + '%'
//       });
//     }
//     setTargets(newTargets);
//   };

//   const handleClick = useCallback((id) => {
//     setTargets((prevTargets) => prevTargets.filter((target) => target.id !== id));
//     setScore((prevScore) => prevScore + 1);
//   }, []);

//   return (
//     <div ref={gameAreaRef} className="relative w-screen h-screen bg-gray-800 flex justify-center items-center overflow-hidden">
//       {targets.map(target => (
//         <div
//           key={target.id}
//           className="absolute w-12 h-12 bg-red-500 rounded-full cursor-pointer transform transition-transform duration-100"
//           style={{ left: target.x, top: target.y }}
//           onClick={() => handleClick(target.id)}
//         />
//       ))}
//       <div className="absolute top-5 right-5 text-white text-2xl">
//         Score: {score}
//       </div>
//     </div>
//   );
// }
