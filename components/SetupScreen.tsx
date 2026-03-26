import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Player, PlayerColor, PlayerType } from '../types';
import { speak } from '../utils/sound';
import DragonIntro from './DragonIntro';

interface SetupScreenProps {
  onStartGame: (players: Player[]) => void;
}

type SlotType = 'human' | 'cpu' | 'none';

interface PlayerConfig {
  type: SlotType;
  name: string;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [configs, setConfigs] = useState<Record<PlayerColor, PlayerConfig>>({
    red: { type: 'human', name: '' },
    green: { type: 'cpu', name: '' },
    yellow: { type: 'cpu', name: '' },
    blue: { type: 'cpu', name: '' }
  });

  const [launching, setLaunching] = useState(false);

  const handleStart = () => {
    const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
    const selectedPlayers: Player[] = [];

    colors.forEach(color => {
        const conf = configs[color];
        if (conf.type !== 'none') {
            selectedPlayers.push({
                color,
                type: conf.type as PlayerType,
                name: conf.name || (conf.type === 'human' ? `${color.charAt(0).toUpperCase() + color.slice(1)}` : `${color.charAt(0).toUpperCase() + color.slice(1)} Bot`),
                pieces: [0, 1, 2, 3].map(id => ({ id, color, position: -1, stepsMoved: 0 })),
                hasFinished: false
            });
        }
    });

    if (selectedPlayers.length < 2) {
        alert("Please select at least 2 players to start!");
        return;
    }

    // Launch Sequence
    setLaunching(true);
    
    // Dragon Voice: Female, Pitch 1.1 (slightly higher), Rate 1.1
    setTimeout(() => {
        speak("Get Ready to Play!", 'female', 1.1, 1.1); 
    }, 1000); // Sync with dragon breath

    setTimeout(() => {
        onStartGame(selectedPlayers);
    }, 3500); // slightly longer for animation
  };
  
  const setType = (color: PlayerColor, type: SlotType) => {
      setConfigs(prev => ({ ...prev, [color]: { ...prev[color], type } }));
  };

  const updateName = (color: PlayerColor, val: string) => {
    setConfigs(prev => ({ ...prev, [color]: { ...prev[color], name: val } }));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const renderPlayerRow = (color: PlayerColor) => {
    const config = configs[color];
    const isOff = config.type === 'none';
    
    // Theme colors
    const colorStyles = {
        red: { bg: 'bg-rose-500', shadow: 'shadow-rose-500/50', border: 'border-rose-400' },
        green: { bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/50', border: 'border-emerald-400' },
        yellow: { bg: 'bg-amber-400', shadow: 'shadow-amber-400/50', border: 'border-amber-300' },
        blue: { bg: 'bg-blue-500', shadow: 'shadow-blue-500/50', border: 'border-blue-400' }
    };
    
    const style = colorStyles[color];

    return (
        <motion.div 
            variants={itemVariants}
            className={`
                relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                ${isOff ? 'bg-slate-900/20 border-white/5 opacity-60' : 'bg-slate-800/40 border-white/10 opacity-100'}
            `}
        >
            {/* Color Indicator */}
            <div className={`w-10 h-10 rounded-full ${style.bg} ${style.shadow} shadow-lg flex items-center justify-center shrink-0`}>
                <span className="text-white/90 text-xs font-black uppercase">{color[0]}</span>
            </div>

            {/* Name Input */}
            <div className="flex-1">
                <input
                    type="text"
                    disabled={isOff}
                    value={config.name}
                    onChange={(e) => updateName(color, e.target.value)}
                    placeholder={config.type === 'human' ? "Player Name" : (config.type === 'cpu' ? "Bot Name" : "Closed")}
                    className={`
                        w-full bg-transparent border-b border-white/10 py-1 text-sm md:text-base outline-none transition-colors
                        ${isOff ? 'text-slate-600 placeholder-slate-700' : 'text-white placeholder-slate-500 focus:border-white/30'}
                    `}
                />
            </div>

            {/* Type Toggles */}
            <div className="flex bg-slate-950/50 rounded-lg p-1 border border-white/5">
                {[
                    { id: 'human', icon: '👤' },
                    { id: 'cpu', icon: '🤖' },
                    { id: 'none', icon: '❌' }
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setType(color, t.id as SlotType)}
                        className={`
                            w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all
                            ${config.type === t.id 
                                ? 'bg-white/10 text-white shadow-sm' 
                                : 'text-slate-600 hover:text-slate-400'
                            }
                        `}
                        title={t.id === 'none' ? 'Disable Slot' : t.id.toUpperCase()}
                    >
                        {t.icon}
                    </button>
                ))}
            </div>
        </motion.div>
    );
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {launching ? (
        <DragonIntro />
      ) : (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-lg bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl relative z-10"
        >
             {/* Offline Badge */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-500 tracking-wider">OFFLINE</span>
            </div>

            <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-block mb-3 p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <span className="text-4xl">🎲</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">
                LUDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">MASTER</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium tracking-wide uppercase">Configure Players</p>
            </motion.div>

            {/* Players List */}
            <div className="space-y-3 mb-8">
                {renderPlayerRow('red')}
                {renderPlayerRow('green')}
                {renderPlayerRow('yellow')}
                {renderPlayerRow('blue')}
            </div>

            <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl font-bold text-white text-lg shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] relative overflow-hidden group"
            >
            <span className="relative z-10 flex items-center justify-center gap-2">
                START GAME
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default SetupScreen;