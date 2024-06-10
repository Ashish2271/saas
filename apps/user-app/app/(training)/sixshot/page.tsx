'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './styles.css'

const targetSize = 10; // Size of the targets
const gameDuration = 30000; // 30 seconds

const SixShotGame = () => {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let timer;
    if (gameStarted) {
      // setTimeLeft(gameDuration / 1000);

      // Start the game timer
      timer = setInterval(() => {
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
    }

    return () => clearInterval(timer);
  }, [gameStarted]);

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
    setTargets((prevTargets) => {
      const newTargets = [...prevTargets];
      newTargets[index] = generateRandomTarget();
      return newTargets;
    });
    setScore((prevScore) => prevScore + 1);
  };

  const startGame = () => {
    setScore(0);
  
    setGameStarted(true);
 
  };

  const replayGame = () => {
    setScore(0);
    setGameStarted(false);
    setTimeLeft(gameDuration / 1000);
    
  };

  return (
    <div className='cursor-crosshair h-screen w-screen'>
      {gameStarted ? (
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
                }}
                onMouseDown={() => handleTargetClick(index)}
              />
            ))
          ) : (
            <div className="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Game Over! Your score is {score}
              <button className="ml-4 p-2 bg-blue-500 text-white rounded" onClick={replayGame}>
                Replay
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button className="p-2 bg-blue-500 text-white rounded" onClick={startGame}>
            Play
          </button>
        </div>
      )}
    </div>
  );
};

export default SixShotGame;
