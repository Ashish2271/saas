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
    for (let i = 0; i < 1; i++) {
      newTargets.push(generateRandomTarget());
    }
    //@ts-ignore
    setTargets(newTargets);
  };

  const generateRandomTarget = () => {
    const x = Math.random() * (window.innerWidth - targetSize);
    const y = window.innerHeight / 2 - targetSize / 2; // Center vertically
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


