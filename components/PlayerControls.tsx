import React from 'react';
import { GameState } from '../types';

interface PlayerControlsProps {
  gameState: GameState;
  lastAction: string;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ gameState }) => {
  return (
    <>
      {/* Winner Overlay */}
      {gameState.winner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="text-8xl mb-6">👑</div>
          <h2 className="text-5xl font-black text-white mb-2 tracking-tight">VICTORY!</h2>
          <p className="text-3xl text-yellow-400 font-bold uppercase tracking-wide mb-12">{gameState.winner} WINS THE GAME</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
          >
            Play Again
          </button>
        </div>
      )}
    </>
  );
};

export default PlayerControls;