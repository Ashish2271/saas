'use client';
// components/MovingBall.js

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const gameDuration = 30000;

const MovingBall = () => {
  const [score, setScore] = useState(0);
  const intervalRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(gameDuration / 1000);
  const [gameStarted, setGameStarted] = useState(false);

  const handleMouseEnter = () => {
    // Start incrementing the score
    //@ts-ignore

    intervalRef.current = setInterval(() => {
      setScore(prevScore => prevScore + 1);
    }, 100); // Adjust the interval time as needed
  };

  const handleMouseLeave = () => {
    // Stop incrementing the score
    //@ts-ignore

    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    //@ts-ignore

    let timer;
    if (gameStarted) {
      // Start the game timer
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
    //@ts-ignore

            clearInterval(timer);
    //@ts-ignore

            clearInterval(intervalRef.current); // Clear the score interval when time is up
            return 0;
          }
        });
      }, 1000);
    }
    return () => {
      // Clean up the interval on component unmount
        //@ts-ignore

      clearInterval(intervalRef.current);
    //@ts-ignore

      clearInterval(timer);
    };
  }, [gameStarted]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(gameDuration / 1000);
    setGameStarted(true);
  };

  const replayGame = () => {
    setScore(0);
    setTimeLeft(gameDuration / 1000);
    setGameStarted(true);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {gameStarted ? (
        <>
          <div className="absolute top-4 left-4 text-lg font-bold">Score: {score} | Time Left: {timeLeft}s</div>
          {timeLeft > 0 ? (
            <motion.div
              className="bg-blue-500 rounded-full w-8 h-8"
              animate={{ x: [0, 300, -300, 0], y: [0, 0, 0, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ) : (
            <div className="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Game Over! Your score is {score}
              <button className="ml-4 p-2 bg-blue-500 text-white rounded" onClick={replayGame}>
                Replay
              </button>
            </div>
          )}
        </>
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

export default MovingBall;



// 'use client';
// // components/MovingBall.js

// import { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';

// const gameDuration = 30000;
// const containerWidth = 700; // Adjust this to match the actual container width
// const containerHeight = 500; // Adjust this to match the actual container height

// const getRandomPosition = () => {
//   const x = Math.random() * containerWidth - containerWidth / 2;
//   const y =  500/ 2;
//   return { x, y };
// };

// const MovingBall = () => {
//   const [score, setScore] = useState(0);
//   const intervalRef = useRef(null);
//   const [timeLeft, setTimeLeft] = useState(gameDuration / 1000);
//   const [position, setPosition] = useState(getRandomPosition());

//   const handleMouseEnter = () => {
//     // Start incrementing the score
//     intervalRef.current = setInterval(() => {
//       setScore(prevScore => prevScore + 1);
//     }, 100); // Adjust the interval time as needed
//   };

//   const handleMouseLeave = () => {
//     // Stop incrementing the score
//     clearInterval(intervalRef.current);
//   };

//   useEffect(() => {
//     // Start the game timer
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev > 0) {
//           return prev - 1;
//         } else {
//           clearInterval(timer);
//           clearInterval(intervalRef.current); // Clear the score interval when time is up
//           return 0;
//         }
//       });
//     }, 1000);

//     const positionInterval = setInterval(() => {
//       setPosition(getRandomPosition());
//     }, 1000); // Adjust this interval to change how often the position updates

//     return () => {
//       // Clean up the interval on component unmount
//       clearInterval(intervalRef.current);
//       clearInterval(timer);
//       clearInterval(positionInterval);
//     };
//   }, []);

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100 relative">
//       <div className="absolute top-4 left-4 text-lg font-bold">Score: {score} | Time Left: {timeLeft}s</div>
//       {timeLeft > 0 ? (
//         <motion.div
//           className="bg-blue-500 rounded-full w-8 h-8"
//           animate={position}
//           transition={{ duration: 1 }}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         />
//       ) : (
//         <div className="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//           Game Over! Your score is {score}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MovingBall;

