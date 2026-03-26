import React from 'react';
import { motion } from 'framer-motion';

interface DiceProps {
  value: number | null;
  rolling: boolean;
  onClick: () => void;
  disabled: boolean;
  color: string; // Tailwind color class for outer glow
}

const Dice: React.FC<DiceProps> = ({ value, rolling, onClick, disabled, color }) => {
  // Map dice value to the rotation needed to show that face
  const getRotation = (val: number | null) => {
    switch (val) {
      case 1: return { rotateX: 0, rotateY: 0 };
      case 2: return { rotateX: -90, rotateY: 0 };
      case 3: return { rotateX: 0, rotateY: -90 };
      case 4: return { rotateX: 0, rotateY: 90 };
      case 5: return { rotateX: 90, rotateY: 0 };
      case 6: return { rotateX: 180, rotateY: 0 };
      default: return { rotateX: -25, rotateY: -25 }; // Idle skew
    }
  };

  const targetRotation = getRotation(value);

  // Dots are now glowing embers
  const renderDot = (i: number) => (
    <div key={i} className="relative w-3 h-3">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-orange-500 to-red-600 rounded-full blur-[1px]"></div>
        <div className="absolute inset-0 bg-yellow-100 rounded-full opacity-50 blur-[2px] animate-pulse"></div>
        <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-600 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.9)] border-[0.5px] border-white/40"></div>
    </div>
  );

  const faces = [
    { id: 1, dots: [4], transform: 'translateZ(32px)' }, // Front
    { id: 2, dots: [0, 8], transform: 'rotateX(90deg) translateZ(32px)' }, // Top
    { id: 3, dots: [0, 4, 8], transform: 'rotateY(90deg) translateZ(32px)' }, // Right
    { id: 4, dots: [0, 2, 6, 8], transform: 'rotateY(-90deg) translateZ(32px)' }, // Left
    { id: 5, dots: [0, 2, 4, 6, 8], transform: 'rotateX(-90deg) translateZ(32px)' }, // Bottom
    { id: 6, dots: [0, 2, 3, 5, 6, 8], transform: 'rotateY(180deg) translateZ(32px)' } // Back
  ];

  const getFaceContent = (dots: number[]) => (
    <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-1 gap-1">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {dots.includes(i) && renderDot(i)}
        </div>
      ))}
    </div>
  );

  return (
    <motion.div 
      className={`relative w-24 h-24 flex items-center justify-center group ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.1, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {/* Hellish Lava Shadow */}
      <motion.div 
        className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-600 rounded-[100%] blur-md mix-blend-screen"
        animate={{
          width: rolling ? '2rem' : '4rem',
          height: rolling ? '0.5rem' : '1rem',
          opacity: rolling ? 0.4 : 0.8,
          translateY: rolling ? 20 : 0
        }}
        transition={{ duration: 0.4 }}
      />

      {/* 3D Cube Container */}
      <div 
        className="w-16 h-16 relative"
        style={{ perspective: '800px' }}
      >
        <motion.div 
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            rotateX: rolling ? [0, 720, 1080 + (Math.random() * 360)] : targetRotation.rotateX,
            rotateY: rolling ? [0, 720, 1080 + (Math.random() * 360)] : targetRotation.rotateY,
            z: rolling ? [0, 80, 0] : 0, // Toss up effect
          }}
          transition={{
            duration: rolling ? 0.8 : 0.8,
            ease: rolling ? "linear" : "backOut",
            type: rolling ? "tween" : "spring",
            stiffness: rolling ? undefined : 60,
            damping: rolling ? undefined : 12,
          }}
        >
          {faces.map((face) => (
            <div 
              key={face.id}
              // Magma Rock Texture
              className="absolute inset-0 bg-gradient-to-br from-[#1a0505] via-black to-[#2b0808] border border-orange-900/60 rounded-lg shadow-[inset_0_0_15px_rgba(0,0,0,1)] flex items-center justify-center backface-hidden overflow-hidden"
              style={{ transform: face.transform }}
            >
              {/* Cracks Overlay */}
              <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cracked-ground.png')] mix-blend-overlay pointer-events-none"></div>
              
              {/* Internal Heat Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none"></div>

              {getFaceContent(face.dots)}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dice;