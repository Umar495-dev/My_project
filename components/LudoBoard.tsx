import React from 'react';
import { PlayerColor, Player, Piece } from '../types';
import { getPieceCoordinates } from '../utils/gameLogic';
import { BASE_POSITIONS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface LudoBoardProps {
  players: Player[];
  onPieceClick: (color: PlayerColor, pieceId: number) => void;
  currentTurnColor: PlayerColor;
  canMove: boolean;
  winner: PlayerColor | null;
}

const LudoBoard: React.FC<LudoBoardProps> = ({ 
  players, 
  onPieceClick, 
  currentTurnColor,
  canMove,
  winner
}) => {
  
  // Helper to get player name safely
  const getPlayerName = (color: PlayerColor) => {
    const p = players.find(pl => pl.color === color);
    return p ? p.name : '';
  };

  const isPlayerActive = (color: PlayerColor) => {
    return players.some(p => p.color === color);
  };

  const renderPlayerLabel = (color: PlayerColor, positionClasses: string) => {
    if (!isPlayerActive(color)) return null;
    const name = getPlayerName(color);
    
    // Dynamic styles based on color - Darker "Evil" versions
    const styles = {
        red: "bg-red-900/80 text-red-100 shadow-red-900/50 border-red-700",
        green: "bg-emerald-900/80 text-emerald-100 shadow-emerald-900/50 border-emerald-700",
        yellow: "bg-amber-700/80 text-amber-100 shadow-amber-900/50 border-amber-600",
        blue: "bg-blue-900/80 text-blue-100 shadow-blue-900/50 border-blue-700"
    };

    return (
        <div className={`absolute ${positionClasses} z-30 flex flex-col items-center pointer-events-none`}>
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`
                    px-3 py-1 md:px-4 md:py-1.5 rounded-lg border shadow-lg 
                    font-black text-[10px] md:text-sm tracking-widest uppercase backdrop-blur-md
                    ${styles[color]}
                    flex items-center gap-2
                `}
                style={{ textShadow: "0 0 10px currentColor" }}
            >
                {/* User Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4 opacity-80">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {name}
            </motion.div>
        </div>
    );
  };

  // Render grid cells
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        let cellContent = null;
        // Dark base class for cells
        let cellClasses = "relative w-full h-full flex items-center justify-center overflow-visible border-[0.5px] border-white/5"; 
        
        // --- ZONES ---
        
        // Check for Base Sockets
        const isRedBase = x < 6 && y < 6;
        const isGreenBase = x > 8 && y < 6;
        const isBlueBase = x < 6 && y > 8;
        const isYellowBase = x > 8 && y > 8;

        if (isRedBase || isGreenBase || isBlueBase || isYellowBase) {
            let color: PlayerColor | null = null;
            if (isRedBase) color = 'red';
            if (isGreenBase) color = 'green';
            if (isBlueBase) color = 'blue';
            if (isYellowBase) color = 'yellow';

            // Check if this specific cell is a socket
            const isSocket = BASE_POSITIONS[color!].some(p => p.x === x && p.y === y);
            
            if (isSocket) {
                cellContent = (
                    <div className={`w-[80%] h-[80%] rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] ${
                        color === 'red' ? 'bg-red-950 ring-1 ring-red-800' :
                        color === 'green' ? 'bg-emerald-950 ring-1 ring-emerald-800' :
                        color === 'blue' ? 'bg-blue-950 ring-1 ring-blue-800' :
                        'bg-amber-950 ring-1 ring-amber-800'
                    }`}></div>
                );
            }
        }

        // 2. CENTER HOME (3x3) - THE HELL PIT
        else if (x >= 6 && x <= 8 && y >= 6 && y <= 8) {
             let polyColor = 'bg-slate-900';
             
             // The absolute center
             if (x === 7 && y === 7) {
                 cellClasses += " z-10 bg-black shadow-[0_0_30px_#f97316] rounded-md border border-orange-900";
                 cellContent = (
                     <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                         <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-orange-600 via-red-600 to-black opacity-80"
                            animate={{ opacity: [0.6, 0.9, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                         />
                         <span className="relative z-10 text-[10px] md:text-xs font-black text-orange-500 tracking-tighter" style={{ textShadow: "0 0 5px black" }}>HELL</span>
                     </div>
                 );
             } else {
                 if (x===6 && y>=6 && y<=8) polyColor = 'bg-gradient-to-r from-red-900 to-red-800'; 
                 if (x===8 && y>=6 && y<=8) polyColor = 'bg-gradient-to-l from-amber-700 to-amber-600';
                 if (y===6 && x>=6 && x<=8) polyColor = 'bg-gradient-to-b from-emerald-900 to-emerald-800';
                 if (y===8 && x>=6 && x<=8) polyColor = 'bg-gradient-to-t from-blue-900 to-blue-800';
                 
                 cellClasses += ` ${polyColor}`;
             }
        }

        // 3. PATHS
        else {
             let bgColor = 'bg-neutral-900'; // Dark path
             let isStar = false;
             let isArrow = false;
             let arrowRotation = 0;

             // Colored Paths (Home Stretch) - Darker/Glowing
             if (y === 7 && x >= 1 && x <= 5) { bgColor = 'bg-gradient-to-b from-red-800 to-red-900 shadow-[inset_0_0_5px_#991b1b]'; }
             if (x === 7 && y >= 1 && y <= 5) { bgColor = 'bg-gradient-to-r from-emerald-800 to-emerald-900 shadow-[inset_0_0_5px_#065f46]'; }
             if (y === 7 && x >= 9 && x <= 13) { bgColor = 'bg-gradient-to-b from-amber-600 to-amber-700 shadow-[inset_0_0_5px_#b45309]'; }
             if (x === 7 && y >= 9 && y <= 13) { bgColor = 'bg-gradient-to-r from-blue-800 to-blue-900 shadow-[inset_0_0_5px_#1e3a8a]'; }

             // Starting Arrows
             if (x === 1 && y === 6) { bgColor = 'bg-red-700'; isStar = true; isArrow = true; arrowRotation = 0; }
             if (x === 8 && y === 1) { bgColor = 'bg-emerald-700'; isStar = true; isArrow = true; arrowRotation = 90; }
             if (x === 13 && y === 8) { bgColor = 'bg-amber-600'; isStar = true; isArrow = true; arrowRotation = 180; }
             if (x === 6 && y === 13) { bgColor = 'bg-blue-700'; isStar = true; isArrow = true; arrowRotation = 270; }

             // Safe Spots (Stars) - Pentagrams
             if ((x===6 && y===2) || (x===8 && y===12) || (x===2 && y===8) || (x===12 && y===6)) {
                 isStar = true;
                 bgColor = 'bg-neutral-800 shadow-[inset_0_0_10px_black] border border-white/10';
             }

             // Standard Cells styling
             if (bgColor === 'bg-neutral-900') {
                 cellClasses += " bg-neutral-900 shadow-[inset_0_0_5px_rgba(0,0,0,0.8)]";
             } else {
                 cellClasses += ` ${bgColor}`;
             }

             if (isStar && !isArrow) {
                // Pentagram SVG
                cellContent = (
                   <svg className="w-[70%] h-[70%] text-orange-500/30 drop-shadow-[0_0_2px_rgba(249,115,22,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                        {/* Simple Star/Pentagram shape */}
                       <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                   </svg>
                );
             } else if (isArrow) {
               cellContent = (
                    <svg className="w-[60%] h-[60%] text-white drop-shadow-md" style={{ transform: `rotate(${arrowRotation}deg)`}} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                    </svg>
               );
             }
        }

        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={cellClasses}
          >
            {cellContent}
          </div>
        );
      }
    }
    return cells;
  };

  // Pieces rendering
  const renderPieces = () => {
    // 1. Calculate positions for all pieces
    const allPieces: { piece: Piece, x: number, y: number, color: PlayerColor }[] = [];
    players.forEach(player => {
        player.pieces.forEach(piece => {
            const coords = getPieceCoordinates(piece);
            allPieces.push({ piece, x: coords.x, y: coords.y, color: player.color });
        });
    });

    // 2. Group by position to handle overlaps
    const positionGroups = new Map<string, typeof allPieces>();
    allPieces.forEach(p => {
        const key = `${p.x},${p.y}`;
        if (!positionGroups.has(key)) positionGroups.set(key, []);
        positionGroups.get(key)!.push(p);
    });

    return Array.from(positionGroups.entries()).flatMap(([key, groupPieces]) => {
        const [x, y] = key.split(',').map(Number);
        
        return groupPieces.map((item, index) => {
            const { piece, color } = item;
            const isClickable = currentTurnColor === color && canMove && piece.position !== 99;
            const isMultiple = groupPieces.length > 1;

            // Calculate offset if multiple pieces
            let offsetX = 0;
            let offsetY = 0;
            let scale = 1;

            if (isMultiple) {
                scale = 0.85;
                if (index === 0) { offsetX = -4; offsetY = -4; }
                else if (index === 1) { offsetX = 4; offsetY = -4; }
                else if (index === 2) { offsetX = -4; offsetY = 4; }
                else { offsetX = 4; offsetY = 4; }
            }

            // Devil Theme Token Styling
            const theme: Record<PlayerColor, { iris: string, rim: string, glow: string }> = {
                red: { 
                    iris: 'from-red-500 via-orange-500 to-red-700', 
                    rim: 'border-red-900',
                    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                },
                green: { 
                    iris: 'from-emerald-500 via-lime-500 to-emerald-700', 
                    rim: 'border-emerald-900',
                    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                },
                yellow: { 
                    iris: 'from-amber-500 via-yellow-400 to-amber-700', 
                    rim: 'border-amber-900',
                    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                },
                blue: { 
                    iris: 'from-cyan-500 via-blue-500 to-indigo-700', 
                    rim: 'border-blue-900',
                    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                }
            };
            
            const t = theme[color];

            return (
              <motion.div
                key={`${color}-${piece.id}`}
                layout
                layoutId={`${color}-${piece.id}`}
                onClick={() => isClickable && onPieceClick(color, piece.id)}
                initial={false}
                animate={{ 
                  scale: isClickable ? 1.15 : scale,
                  zIndex: isClickable ? 100 : (10 + index),
                  x: offsetX,
                  y: offsetY
                }}
                transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30
                }}
                style={{
                  gridColumnStart: x + 1,
                  gridRowStart: y + 1,
                }}
                className={`
                  relative w-full h-full flex items-center justify-center
                  ${isClickable ? 'cursor-pointer' : ''}
                `}
              >
                 {/* Devil Token Container */}
                 <motion.div 
                    className={`relative w-[85%] h-[85%] flex items-center justify-center`}
                    animate={isClickable ? { 
                        y: [0, -4, 0],
                        scale: [1, 1.1, 1] 
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                 >
                    {/* Pulsating Aura */}
                    <div className={`absolute inset-0 rounded-full ${t.glow} opacity-50 animate-pulse`}></div>
                    
                    {/* Main Body - Obsidian Orb */}
                    <div className={`
                        relative w-full h-full rounded-full 
                        bg-[radial-gradient(circle_at_30%_30%,_#475569_0%,_#020617_80%)] 
                        border-[1.5px] ${t.rim} shadow-inner
                        flex items-center justify-center overflow-hidden
                    `}>
                        {/* Eye Socket */}
                        <div className="w-[70%] h-[70%] bg-black/60 rounded-full shadow-[inset_0_0_8px_black] flex items-center justify-center transform rotate-45">
                             {/* The Iris */}
                             <div className={`w-[90%] h-[90%] rounded-full bg-gradient-to-br ${t.iris} flex items-center justify-center shadow-[0_0_5px_rgba(255,255,255,0.2)]`}>
                                 {/* The Pupil (Slit) */}
                                 <div className="w-[20%] h-[85%] bg-black rounded-[100%] shadow-[0_0_2px_black,inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
                                 {/* Eye Reflection */}
                                 <div className="absolute top-[20%] left-[20%] w-[15%] h-[15%] bg-white rounded-full blur-[0.5px] opacity-80"></div>
                             </div>
                        </div>
                        
                        {/* Surface Cracks/Texture Overlay */}
                        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cracked-ground.png')]"></div>
                    </div>
                 </motion.div>
              </motion.div>
            );
        });
    });
  };

  return (
    <div className="relative p-2 md:p-6 bg-neutral-900 rounded-[2rem] md:rounded-[3rem] shadow-[0_0_50px_rgba(220,38,38,0.5),inset_0_2px_5px_rgba(0,0,0,0.8)] border-2 border-orange-900/50">
      
      {/* Background Fire Effect (Always Releasing) */}
      <div className="absolute inset-0 overflow-hidden rounded-[3rem] z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-orange-900/40 mix-blend-screen animate-pulse"></div>
           {/* Particle System for Fire */}
           {[...Array(15)].map((_, i) => (
             <motion.div
                key={`fire-${i}`}
                className="absolute bottom-0 rounded-full blur-xl"
                style={{ 
                    background: i % 2 === 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(249, 115, 22, 0.3)',
                    width: Math.random() * 100 + 50,
                    height: Math.random() * 100 + 50,
                    left: `${Math.random() * 100}%`
                }}
                animate={{ 
                    y: [-50, -600],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1.5]
                }}
                transition={{ 
                    duration: 3 + Math.random() * 4, 
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear"
                }}
             />
           ))}
      </div>

      {/* Player Labels */}
      {renderPlayerLabel('red', '-top-2 -left-2 md:top-0 md:left-0')}
      {renderPlayerLabel('green', '-top-2 -right-2 md:top-0 md:right-0')}
      {renderPlayerLabel('blue', '-bottom-2 -left-2 md:bottom-0 md:left-0')}
      {renderPlayerLabel('yellow', '-bottom-2 -right-2 md:bottom-0 md:right-0')}

      {/* Outer Rim / Casing - Obsidian Style */}
      <div className="relative w-full max-w-[800px] aspect-square bg-[#1a1a1a] rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 shadow-[inset_0_5px_15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,100,0,0.3)] z-10">
         
         {/* Board Inner Container with Layers */}
         <div className="w-full h-full rounded-[1rem] md:rounded-[1.5rem] overflow-hidden border border-white/5 shadow-black shadow-inner relative bg-black">
            
            {/* Layer 1: Base Backgrounds (Absolute) - Devilish Bases */}
            <div className="absolute inset-0 grid grid-cols-15 grid-rows-15 w-full h-full pointer-events-none">
                 {/* RED BASE */}
                 <div className={`col-start-1 col-span-6 row-start-1 row-span-6 bg-gradient-to-br from-red-950 to-black p-2 md:p-4 border-r-2 border-b-2 border-red-900/50 relative transition-opacity duration-500 ${isPlayerActive('red') ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl md:text-5xl font-black text-red-900/30 tracking-tighter">RED</span>
                     </div>
                     <div className="w-full h-full bg-red-900/10 rounded-[1.5rem] shadow-[inset_0_0_20px_black] border border-red-900/30"></div>
                 </div>
                 {/* GREEN BASE */}
                 <div className={`col-start-10 col-span-6 row-start-1 row-span-6 bg-gradient-to-bl from-emerald-950 to-black p-2 md:p-4 border-l-2 border-b-2 border-emerald-900/50 relative transition-opacity duration-500 ${isPlayerActive('green') ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl md:text-5xl font-black text-emerald-900/30 tracking-tighter">GRN</span>
                     </div>
                     <div className="w-full h-full bg-emerald-900/10 rounded-[1.5rem] shadow-[inset_0_0_20px_black] border border-emerald-900/30"></div>
                 </div>
                 {/* BLUE BASE */}
                 <div className={`col-start-1 col-span-6 row-start-10 row-span-6 bg-gradient-to-tr from-blue-950 to-black p-2 md:p-4 border-r-2 border-t-2 border-blue-900/50 relative transition-opacity duration-500 ${isPlayerActive('blue') ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl md:text-5xl font-black text-blue-900/30 tracking-tighter">BLU</span>
                     </div>
                     <div className="w-full h-full bg-blue-900/10 rounded-[1.5rem] shadow-[inset_0_0_20px_black] border border-blue-900/30"></div>
                 </div>
                 {/* YELLOW BASE */}
                 <div className={`col-start-10 col-span-6 row-start-10 row-span-6 bg-gradient-to-tl from-amber-950 to-black p-2 md:p-4 border-l-2 border-t-2 border-amber-900/50 relative transition-opacity duration-500 ${isPlayerActive('yellow') ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl md:text-5xl font-black text-amber-900/30 tracking-tighter">YEL</span>
                     </div>
                     <div className="w-full h-full bg-amber-900/10 rounded-[1.5rem] shadow-[inset_0_0_20px_black] border border-amber-900/30"></div>
                 </div>
            </div>

            {/* Layer 2: Grid Cells (Sockets, Paths, etc) */}
            <div className="relative w-full h-full grid grid-cols-15 grid-rows-15 gap-[1px] bg-white/5">
                {renderGrid()}
            </div>
            
            {/* Layer 3: Pieces Overlay */}
            <div className="absolute inset-0 w-full h-full grid grid-cols-15 grid-rows-15 gap-[1px] pointer-events-none">
                 <div className="pointer-events-auto contents">
                     <AnimatePresence>
                         {renderPieces()}
                     </AnimatePresence>
                 </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default LudoBoard;