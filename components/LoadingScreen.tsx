"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // Adjust speed as needed
      });
    }, 50);

    if (progress === 100) {
      setTimeout(() => onComplete(), 1000); // Slight delay before transition
    }

    return () => clearInterval(interval);
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* SVG Logo */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640.000000 480.000000"
            width="128"
            height="128"
            className="relative"
          >
            {/* Group for paths */}
            <motion.g
              transform="translate(0.000000,480.000000) scale(0.100000,-0.100000)"
              fill="none"
              stroke="white"
              strokeWidth="10"
              initial={{ fill: "rgba(255, 255, 255, 0.1)" }} // Dimmed initially
              animate={{
                fill: `rgba(255, 255, 255, ${progress / 100})`, // Animate brightness based on progress
              }}
              transition={{ ease: "linear" }}
            >
              <path d="M2988 4793 c12 -2 30 -2 40 0 9 3 -1 5 -23 4 -22 0 -30 -2 -17 -4z" />
              <path d="M2935 4406 c-179 -44 -299 -163 -325 -322 -23 -143 48 -323 187 -474 l63 -68 -53 -6 c-28 -3 -135 -10 -237 -16 -451 -25 -603 -41 -779 -80 -94 -21 -113 -36 -91 -70 7 -11 37 -17 112 -21 154 -10 485 -9 733 1 154 6 223 6 232 -2 21 -17 15 -62 -16 -104 -15 -21 -187 -300 -381 -619 -543 -892 -601 -988 -627 -1021 -26 -35 -29 -53 -10 -77 11 -16 38 -16 442 8 2219 131 2585 154 2604 164 39 21 26 54 -62 153 -230 258 -1251 1468 -1267 1500 -13 27 -13 31 3 43 10 7 46 16 80 20 302 30 587 76 762 122 124 32 137 38 133 66 -3 22 -6 22 -158 20 -85 -1 -326 -13 -535 -27 -209 -13 -382 -22 -383 -21 -2 2 14 26 37 54 240 304 138 709 -197 780 -68 14 -203 13 -267 -3z m269 -127 c67 -25 133 -86 166 -154 34 -70 36 -227 4 -296 -53 -113 -144 -171 -283 -177 -70 -3 -97 0 -142 17 -107 41 -175 125 -199 249 -15 72 -4 147 31 219 26 54 107 127 162 146 64 23 195 21 261 -4z m-12 -976 c65 -69 1068 -1332 1068 -1346 0 -39 -26 -44 -370 -66 -184 -12 -429 -28 -545 -36 -348 -24 -843 -54 -958 -58 -86 -4 -111 -2 -122 10 -21 20 -19 60 4 92 11 15 123 205 249 422 443 761 574 984 589 1002 24 26 45 21 85 -20z" />
              <path d="M3343 3 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z" />
              <path d="M3513 3 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z" />
            </motion.g>
          </motion.svg>

          {/* Progress Text */}
          <motion.div
            className="text-white mt-8 text-lg font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            Loading {progress}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};