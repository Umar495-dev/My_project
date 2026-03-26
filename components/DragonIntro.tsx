import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { playSoundEffect } from '../utils/sound';

const DragonIntro: React.FC = () => {

  useEffect(() => {
    // Timing the roar to match the mouth opening
    setTimeout(() => {
        playSoundEffect('dragon');
    }, 900);
  }, []);

  // Anime speed lines generation
  const speedLines = Array.from({ length: 24 }).map((_, i) => ({
      rotation: i * 15,
      width: Math.random() * 2 + 1,
      delay: Math.random() * 0.2
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden font-sans select-none pointer-events-none">
        
        {/* Anime Background - Speed Lines & Action Gradient */}
        <div className="absolute inset-0 z-0 bg-indigo-950 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4f46e5_0%,_#1e1b4b_70%,_#000000_100%)]"></div>
            
            {/* Spinning Burst Lines */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center opacity-20"
            >
                {speedLines.map((line, i) => (
                    <div 
                        key={i}
                        className="absolute bg-white origin-center"
                        style={{ 
                            width: `${line.width}px`, 
                            height: '150vmax', 
                            transform: `rotate(${line.rotation}deg) translateY(50%)` 
                        }}
                    />
                ))}
            </motion.div>
            
            {/* Flash Overlay pulse */}
            <motion.div 
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.1 }}
                className="absolute inset-0 bg-blue-500 mix-blend-overlay"
            />
        </div>

        {/* Cinematic Letterbox (Anime style) */}
        <div className="absolute top-0 left-0 right-0 h-12 md:h-20 bg-black z-40 border-b-2 border-indigo-500" />
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-20 bg-black z-40 border-t-2 border-indigo-500" />

        {/* Main Action Container */}
        <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
            
            {/* Energy Charge Particle (Charging Phase) */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 0.5], opacity: [0, 1, 0] }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute z-30 mr-24 mb-12"
            >
                 <div className="w-32 h-32 bg-cyan-400 rounded-full blur-[40px] animate-pulse" />
                 <div className="absolute inset-0 w-full h-full bg-white rounded-full blur-[10px]" />
                 {/* Implosion lines */}
                 <svg className="absolute -inset-20 w-[300%] h-[300%] animate-spin-slow opacity-50">
                    {[...Array(8)].map((_,i) => (
                        <line key={i} x1="50%" y1="50%" x2="50%" y2="0%" stroke="white" strokeWidth="2" transform={`rotate(${i*45} 150 150)`} />
                    ))}
                 </svg>
            </motion.div>

            {/* Dragon Illustration (2D Anime Style) */}
            <motion.div
                initial={{ x: -800, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 14 }}
                className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px] z-20"
            >
                <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[10px_10px_0_rgba(0,0,0,0.5)]">
                    <defs>
                        <linearGradient id="dragonSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3730a3" /> {/* Indigo 800 */}
                            <stop offset="40%" stopColor="#312e81" /> {/* Indigo 900 */}
                            <stop offset="100%" stopColor="#0f172a" /> {/* Slate 900 */}
                        </linearGradient>
                        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#e2e8f0" />
                             <stop offset="50%" stopColor="#94a3b8" />
                             <stop offset="100%" stopColor="#64748b" />
                        </linearGradient>
                    </defs>

                    <g transform="translate(50, 50)">
                        {/* Back Spikes / Mane */}
                        <path d="M100,200 L60,150 L120,180 Z" fill="#4338ca" />
                        <path d="M140,140 L120,80 L180,120 Z" fill="#4338ca" />
                        <path d="M220,100 L240,40 L260,110 Z" fill="#4338ca" />

                        {/* Jaw (Animated) */}
                        <motion.g 
                            style={{ originX: "220px", originY: "240px" }}
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 25 }}
                            transition={{ delay: 1.0, duration: 0.1, type: "tween" }} // Snap open
                        >
                            <path 
                                d="M220,240 L350,250 L400,300 L280,330 L200,280 Z"
                                fill="#1e1b4b" stroke="white" strokeWidth="2" strokeLinejoin="round"
                            />
                            {/* Teeth */}
                            <path d="M350,250 L355,230 L360,250" fill="white" />
                            <path d="M380,255 L385,235 L390,260" fill="white" />
                        </motion.g>
                        
                        {/* Upper Head */}
                        <path 
                            d="M180,280 L220,240 L350,250 L420,210 L380,140 L260,110 L180,180 L120,250 Z"
                            fill="url(#dragonSkin)" stroke="white" strokeWidth="3" strokeLinejoin="round"
                        />
                        
                        {/* Armor Plate */}
                        <path d="M260,110 L300,100 L320,130 L280,140 Z" fill="url(#metal)" stroke="white" strokeWidth="1" />
                        
                        {/* Eye Area */}
                        <path d="M280,200 L330,190 L320,210 Z" fill="#000" />
                        
                        {/* Eye Flash */}
                        <motion.circle 
                            cx="310" cy="200" r="4" fill="#fbbf24"
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: [0, 1, 1],
                                scale: [1, 1.5, 1],
                                filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                            }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        />
                         {/* Lens Flare Line */}
                        <motion.path
                            d="M200,200 L420,200"
                            stroke="#fbbf24" strokeWidth="2"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                        />
                    </g>
                </svg>
            </motion.div>

            {/* THE BEAM (Anime Style) */}
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.1 }} // Instant fire
                style={{ transformOrigin: "left" }}
                className="absolute left-[50%] md:left-[45%] top-[45%] w-[150%] h-48 z-20 flex items-center"
            >
                {/* Core White Beam */}
                <div className="w-full h-[40%] bg-white blur-md shadow-[0_0_60px_#22d3ee]" />
                {/* Outer Energy */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-transparent blur-xl opacity-60 mix-blend-screen" />
                
                {/* Spiraling Energy SVG */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                     <defs>
                        <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="cyan" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                    <motion.path 
                        d="M0,100 Q100,0 200,100 T400,100 T600,100 T800,100" 
                        fill="none" stroke="url(#beamGrad)" strokeWidth="8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, pathOffset: [0, -1] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.path 
                        d="M0,100 Q100,200 200,100 T400,100 T600,100 T800,100" 
                        fill="none" stroke="cyan" strokeWidth="4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, pathOffset: [0, -1] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
                    />
                </svg>
            </motion.div>

            {/* IMPACT FRAME (White Flash) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 1.1, duration: 0.15 }}
                className="absolute inset-0 bg-white z-50 mix-blend-hard-light"
            />
            
            {/* Screen Shake Wrapper for Text */}
            <motion.div 
                animate={{ x: [-5, 5, -5, 5, 0], y: [-5, 5, 0] }}
                transition={{ delay: 1.2, duration: 0.3 }}
                className="absolute z-[60] flex flex-col items-center justify-center inset-0"
            >
                <motion.div 
                    initial={{ scale: 4, opacity: 0, skewX: -20 }}
                    animate={{ scale: 1, opacity: 1, skewX: -20 }}
                    transition={{ delay: 1.2, duration: 0.2, type: "spring", stiffness: 400 }}
                    className="relative"
                >
                    <h1 className="text-8xl md:text-[10rem] font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter leading-none"
                        style={{ 
                            WebkitTextStroke: "2px black",
                            filter: "drop-shadow(5px 5px 0px #ef4444)" 
                        }}
                    >
                        GET READY
                    </h1>
                    
                    {/* Slicing Line Effect */}
                    <motion.div 
                        initial={{ width: 0, left: 0 }}
                        animate={{ width: "120%", left: "-10%" }}
                        transition={{ delay: 1.4, duration: 0.3, ease: "circOut" }}
                        className="absolute top-1/2 h-2 bg-yellow-400 shadow-[0_0_15px_#facc15]"
                    />
                </motion.div>
            </motion.div>

        </div>
    </div>
  );
};

export default DragonIntro;