import React, { useState, useCallback, useEffect } from 'react';
import LudoBoard from './components/LudoBoard';
import PlayerControls from './components/PlayerControls';
import Dice from './components/Dice';
import SetupScreen from './components/SetupScreen';
import IntroScreen from './components/IntroScreen';
import { GameState, Player, PlayerColor } from './types';
import { canMovePiece } from './utils/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { playSoundEffect } from './utils/sound';

const App: React.FC = () => {
  // Screen State
  const [showIntro, setShowIntro] = useState(true);
  const [inSetup, setInSetup] = useState(true);
  const [showQuitModal, setShowQuitModal] = useState(false);

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    phase: 'ROLL',
    lastRollWasSix: false,
    consecutiveSixes: 0,
    winner: null,
    history: []
  });

  // UI State
  const [rolling, setRolling] = useState(false);
  const [lastAction, setLastAction] = useState<string>("Game Started");
  const [movingPieceId, setMovingPieceId] = useState<number | null>(null);

  // Next Turn Logic
  const nextTurn = useCallback(() => {
    setGameState(prev => {
      const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        diceValue: null,
        phase: 'ROLL',
        lastRollWasSix: false,
        consecutiveSixes: 0
      };
    });
  }, []);

  const finalizeMove = useCallback((color: PlayerColor, pieceId: number) => {
    setMovingPieceId(null);
    playSoundEffect('step');

    setGameState(prev => {
        const currentPlayer = prev.players.find(p => p.color === color);
        if (!currentPlayer) return prev;
        const piece = currentPlayer.pieces.find(p => p.id === pieceId);
        if (!piece) return prev;

        let capturedOpponent = false;
        let capturedName = "";
        let newPlayers = [...prev.players];

        // Capture Logic (only if on main track and safe spots)
        if (piece.stepsMoved <= 50) { 
            const startOffset = { red: 0, green: 13, yellow: 26, blue: 39 }[color];
            const absolutePos = (piece.position + startOffset) % 52;
            const safeSpots = [0, 8, 13, 21, 26, 34, 39, 47];
            const isSafe = safeSpots.includes(absolutePos);

            if (!isSafe) {
                newPlayers = newPlayers.map(p => {
                    if (p.color === color) return p; // Skip self
                    const updatedPieces = p.pieces.map(oppPiece => {
                        if (oppPiece.position !== -1 && oppPiece.position !== 99 && oppPiece.stepsMoved <= 50) {
                            const oppOffset = { red: 0, green: 13, yellow: 26, blue: 39 }[p.color];
                            const oppAbsPos = (oppPiece.position + oppOffset) % 52;
                            
                            if (oppAbsPos === absolutePos) {
                                capturedOpponent = true;
                                capturedName = p.name;
                                return { ...oppPiece, position: -1, stepsMoved: 0 }; // Send home
                            }
                        }
                        return oppPiece;
                    });
                    return { ...p, pieces: updatedPieces };
                });
            }
        }
        
        if (capturedOpponent) {
            playSoundEffect('capture');
            setLastAction(`${currentPlayer.name} captured ${capturedName}!`);
        } else {
             // Move complete
        }

        const isWinner = newPlayers.find(p => p.color === color)?.pieces.every(p => p.position === 99);
        
        if (isWinner) {
             playSoundEffect('win');
             return { ...prev, players: newPlayers, winner: color, phase: 'ROLL' };
        }

        // Rule: Roll 6 gives another turn
        let shouldNextTurn = true;
        if (prev.diceValue === 6 && prev.consecutiveSixes < 3) {
            shouldNextTurn = false;
        }
        if (capturedOpponent) {
            shouldNextTurn = false;
        }

        // Trigger next turn if needed
        if (shouldNextTurn) {
             const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
             return {
                 ...prev,
                 players: newPlayers,
                 diceValue: null,
                 phase: 'ROLL',
                 lastRollWasSix: false,
                 consecutiveSixes: 0,
                 currentPlayerIndex: nextIndex
             };
        } else {
             return {
                 ...prev,
                 players: newPlayers,
                 diceValue: null,
                 phase: 'ROLL',
                 // Keep same player
             };
        }
    });
  }, []);

  const animateStep = useCallback((color: PlayerColor, pieceId: number, remainingSteps: number) => {
    if (remainingSteps <= 0) {
        finalizeMove(color, pieceId);
        return;
    }
    
    // Play step sound
    playSoundEffect('step');

    setGameState(prev => {
        const p = prev.players.find(pl => pl.color === color);
        const piece = p?.pieces.find(pc => pc.id === pieceId);
        if (!piece) return prev;

        let newPos = piece.position;
        let newSteps = piece.stepsMoved;

        if (piece.position === -1) {
            newPos = 0;
            newSteps = 0;
            remainingSteps = 0;
        } else {
            newPos = piece.position + 1;
            newSteps = piece.stepsMoved + 1;
            if (newSteps > 56) newPos = 99; // Cap
        }
        
        // Update state locally for this step
        const newPlayers = [...prev.players];
        const pIndex = newPlayers.findIndex(pl => pl.color === color);
        const newPieces = newPlayers[pIndex].pieces.map(pc => 
             pc.id === pieceId ? { ...pc, position: newPos, stepsMoved: newSteps } : pc
        );
        newPlayers[pIndex] = { ...newPlayers[pIndex], pieces: newPieces };
        return { ...prev, players: newPlayers };
    });

    // Schedule next step
    setTimeout(() => {
        animateStep(color, pieceId, remainingSteps - 1);
    }, 300); // 300ms per step
  }, [finalizeMove]);

  const handleRoll = useCallback(() => {
    if (gameState.phase !== 'ROLL' || rolling || movingPieceId !== null) return;

    setRolling(true);
    playSoundEffect('roll');

    // Animate roll
    setTimeout(() => {
      const rolledValue = Math.floor(Math.random() * 6) + 1;
      setRolling(false);
      
      let autoPass = false;

      // Check if player has any legal moves
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      const hasLegalMoves = currentPlayer.pieces.some(p => canMovePiece(p, rolledValue));

      if (!hasLegalMoves) {
        setLastAction(`${currentPlayer.name} rolled ${rolledValue} (No moves)`);
        autoPass = true;
      } else {
        setLastAction(`${currentPlayer.name} rolled ${rolledValue}`);
      }

      setGameState(prev => ({
        ...prev,
        diceValue: rolledValue,
        phase: autoPass ? 'ROLL' : 'MOVE', 
        lastRollWasSix: rolledValue === 6,
        consecutiveSixes: rolledValue === 6 ? prev.consecutiveSixes + 1 : 0
      }));

      if (autoPass) {
        setTimeout(nextTurn, 1500);
      }
    }, 1000); // 1s roll duration
  }, [gameState.phase, gameState.players, gameState.currentPlayerIndex, nextTurn, rolling, movingPieceId]);

  const handlePieceClick = useCallback((color: PlayerColor, pieceId: number) => {
    if (movingPieceId !== null) return; // Prevent multiple clicks
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (gameState.phase !== 'MOVE' || !gameState.diceValue) return;
    if (color !== currentPlayer.color) return;

    const piece = currentPlayer.pieces.find(p => p.id === pieceId);
    if (!piece || !canMovePiece(piece, gameState.diceValue)) return;

    setMovingPieceId(pieceId);
    const stepsToAnimate = piece.position === -1 ? 1 : gameState.diceValue;
    animateStep(color, pieceId, stepsToAnimate);

  }, [gameState, nextTurn, movingPieceId, animateStep]);

  // --- BOT LOGIC ---
  useEffect(() => {
    if (inSetup || showIntro || showQuitModal) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.type !== 'cpu' || gameState.winner) return;

    // 1. Roll Dice Logic
    if (gameState.phase === 'ROLL' && !rolling && !gameState.diceValue && movingPieceId === null) {
        const timer = setTimeout(() => {
            handleRoll();
        }, 1000);
        return () => clearTimeout(timer);
    }

    // 2. Move Logic
    if (gameState.phase === 'MOVE' && gameState.diceValue && !rolling && movingPieceId === null) {
        const timer = setTimeout(() => {
            const legalMoves = currentPlayer.pieces.filter(p => canMovePiece(p, gameState.diceValue!));
            
            if (legalMoves.length > 0) {
                // Simple Bot Strategy
                let chosenPiece = legalMoves[0];
                const leavingBase = legalMoves.find(p => p.position === -1);
                if (leavingBase) chosenPiece = leavingBase;
                const finishing = legalMoves.find(p => p.stepsMoved + gameState.diceValue! === 56);
                if (finishing) chosenPiece = finishing;

                handlePieceClick(currentPlayer.color, chosenPiece.id);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [gameState, rolling, inSetup, showIntro, handleRoll, handlePieceClick, movingPieceId, showQuitModal]);

  const handleStartGame = (players: Player[]) => {
    setGameState(prev => ({
        ...prev,
        players,
        currentPlayerIndex: 0,
        diceValue: null,
        phase: 'ROLL',
        winner: null,
        history: ['Game Started']
    }));
    setInSetup(false);
    setLastAction("Game Started! Red's Turn.");
  };
  
  const handleGoHome = () => {
    setShowQuitModal(false);
    setInSetup(true);
    setGameState({
        players: [],
        currentPlayerIndex: 0,
        diceValue: null,
        phase: 'ROLL',
        lastRollWasSix: false,
        consecutiveSixes: 0,
        winner: null,
        history: []
    });
  };

  const getDicePositionClasses = () => {
    if (!gameState.players[gameState.currentPlayerIndex]) return "";
    const color = gameState.players[gameState.currentPlayerIndex].color;
    switch(color) {
        case 'red': return "md:top-8 md:-left-32 -top-24 left-0";
        case 'green': return "md:top-8 md:-right-32 -top-24 right-0";
        case 'blue': return "md:bottom-8 md:-left-32 -bottom-24 left-0";
        case 'yellow': return "md:bottom-8 md:-right-32 -bottom-24 right-0";
        default: return "";
    }
  };

  const getPlayerColorClass = () => {
    if (!gameState.players[gameState.currentPlayerIndex]) return "";
    const color = gameState.players[gameState.currentPlayerIndex].color;
    switch (color) {
      case 'red': return 'bg-rose-500 shadow-rose-500/50';
      case 'green': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'blue': return 'bg-blue-500 shadow-blue-500/50';
      case 'yellow': return 'bg-amber-400 shadow-amber-400/50';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
        ) : inSetup ? (
          <motion.div 
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 flex items-center justify-center"
          >
            <SetupScreen onStartGame={handleStartGame} />
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen w-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 lg:p-6 font-sans overflow-hidden relative"
          >
              {/* Pause/Menu Button */}
              <button 
                onClick={() => setShowQuitModal(true)}
                className="absolute top-4 left-4 md:top-8 md:left-8 z-50 p-3 bg-slate-800/80 hover:bg-indigo-600 text-white rounded-full backdrop-blur-md border border-white/10 transition-all shadow-xl flex items-center justify-center group w-12 h-12"
                title="Pause Game"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
              </button>

              {/* Status Bar (Replacement for Commentary) */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8 z-40 max-w-[200px] md:max-w-xs text-right pointer-events-none">
                  <motion.div 
                     key={lastAction}
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-slate-900/80 backdrop-blur border border-white/10 px-4 py-2 rounded-xl shadow-lg inline-block"
                  >
                      <p className="text-sm font-bold text-white tracking-wide">{lastAction}</p>
                  </motion.div>
              </div>

              {/* Pause/Quit Modal */}
              <AnimatePresence>
                {showQuitModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full"
                        >
                            <div className="text-4xl mb-4">⏸️</div>
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">GAME PAUSED</h2>
                            <p className="text-slate-400 mb-8 font-medium">Resuming will continue the current turn.</p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => setShowQuitModal(false)}
                                    className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide transition-all hover:scale-[1.02] shadow-lg shadow-indigo-900/50"
                                >
                                    RESUME GAME
                                </button>
                                <button 
                                    onClick={handleGoHome}
                                    className="w-full py-4 rounded-xl bg-slate-800 hover:bg-red-900/80 text-slate-300 hover:text-white font-bold tracking-wide transition-all hover:scale-[1.02] border border-white/5"
                                >
                                    QUIT TO MENU
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Board Area */}
              <div className={`relative transition-all duration-300 ${showQuitModal ? 'blur-sm scale-95 opacity-50' : ''} flex-1 flex justify-center items-center w-full max-w-4xl`}>
                 <div className="relative z-10 scale-[0.6] md:scale-90 lg:scale-100 origin-center">
                     <LudoBoard 
                        players={gameState.players} 
                        onPieceClick={handlePieceClick}
                        currentTurnColor={gameState.players[gameState.currentPlayerIndex].color}
                        canMove={gameState.phase === 'MOVE' && !showQuitModal}
                        winner={gameState.winner}
                     />
                 </div>

                 {/* Dice Container */}
                 <motion.div 
                     layout
                     initial={false}
                     transition={{ type: "spring", stiffness: 60, damping: 20 }}
                     className={`absolute z-20 w-32 h-32 flex items-center justify-center pointer-events-none ${getDicePositionClasses()}`}
                 >
                      <div className="pointer-events-auto scale-75 md:scale-100 relative">
                           {/* Glow Ring */}
                           <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse ${getPlayerColorClass()}`}></div>
                           
                           <Dice 
                              value={gameState.diceValue} 
                              rolling={rolling} 
                              onClick={handleRoll} 
                              disabled={
                                  gameState.phase !== 'ROLL' || 
                                  rolling || 
                                  gameState.players[gameState.currentPlayerIndex].type === 'cpu' ||
                                  movingPieceId !== null ||
                                  showQuitModal
                              }
                              color={getPlayerColorClass()}
                           />
                           
                           {/* Bot Indicator */}
                           {gameState.players[gameState.currentPlayerIndex].type === 'cpu' && (
                               <div className="absolute -top-6 w-full text-center">
                                   <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">BOT THINKING...</span>
                               </div>
                           )}
                      </div>
                 </motion.div>
              </div>

              {/* Winner Overlay Logic */}
              <PlayerControls gameState={gameState} lastAction={lastAction} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;