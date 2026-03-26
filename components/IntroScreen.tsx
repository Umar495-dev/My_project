import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { speak } from '../utils/sound';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // Total intro duration: 4.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); 

    // Voice Trigger - synchronized with text appearance at 2.5s
    const voiceTimer = setTimeout(() => {
        speak("Welcome to the Game", 'female', 1.0, 1.0);
    }, 2500);

    return () => {
        clearTimeout(timer);
        clearTimeout(voiceTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden font-sans"
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
      
      {/* Animated Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -60, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[100px]"
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Animated Dice Graphic */}
        <motion.div
          initial={{ scale: 0, rotateY: -180, rotateX: -180, opacity: 0 }}
          animate={{ scale: 1, rotateY: -15, rotateX: 15, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, duration: 2 }}
          className="mb-10 relative perspective-1000"
        >
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-white via-slate-200 to-slate-400 rounded-3xl shadow-[0_0_80px_rgba(255,255,255,0.2),inset_0_0_20px_rgba(0,0,0,0.1)] flex items-center justify-center relative border border-white/40 transform-style-3d">
                <div className="grid grid-cols-2 gap-3 md:gap-4 p-4">
                   <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-900 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
                   <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-900 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
                   <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-900 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
                   <motion.div 
                     animate={{ backgroundColor: ["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#ef4444"] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full shadow-[0_0_15px_currentColor] animate-pulse"
                   ></motion.div>
                </div>
            </div>
            
            {/* Shockwave effect */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: [0, 0.5, 0] }}
                transition={{ delay: 1.4, duration: 1 }}
                className="absolute inset-0 rounded-3xl border-2 border-white/50"
            />
        </motion.div>

        {/* Text Sequence */}
        <div className="text-center">
            <motion.h1 
                className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl flex items-center justify-center gap-2 md:gap-4"
            >
                <motion.span
                   initial={{ x: -100, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                >
                    LUDO
                </motion.span>
                <motion.span
                   initial={{ x: 100, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                   className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
                >
                    MASTER
                </motion.span>
            </motion.h1>
            
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "150px", opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-8"
            />

            <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 2.5, duration: 0.8 }}
                 className="overflow-hidden"
            >
                <p className="text-xl md:text-3xl font-light text-slate-300 tracking-[0.3em] uppercase bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/5">
                    Welcome to the Game
                </p>
            </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroScreen;