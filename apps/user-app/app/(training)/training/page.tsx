'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SidebarItem } from '../../../components/SidebarItem';

const targetSize = 10; // Size of the targets
const gameDuration = 60000; // 30 seconds

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


<div>
                <SidebarItem href={"/sixshot"} icon={<HomeIcon />} title="microflick" />
                <SidebarItem href={"/headshot"} icon={<HomeIcon/>} title="headshot" />
                <SidebarItem href={"/headtracking"} icon={<HomeIcon />} title="headtracking" />
            </div>


      {/* <div className="select-none absolute top-10 left-10">
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
        </div> */}
      {/* )} */}
    </div>
  );
};

export default SixShotGame;
function HomeIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>
}