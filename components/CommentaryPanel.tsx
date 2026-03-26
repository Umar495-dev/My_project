import React, { useEffect, useRef } from 'react';
import { CommentaryMessage } from '../types';

interface CommentaryPanelProps {
  messages: CommentaryMessage[];
  loading: boolean;
}

const CommentaryPanel: React.FC<CommentaryPanelProps> = ({ messages, loading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-700 w-full md:w-80">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Commentary
        </h3>
        <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">Offline Bot</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide max-h-[300px] md:max-h-[500px]"
      >
        {messages.length === 0 && (
            <div className="text-slate-500 text-center text-sm italic mt-10">
                Game hasn't started yet. Waiting for the first roll...
            </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`
              p-3 rounded-lg text-sm leading-relaxed
              ${msg.sender === 'ai' 
                ? 'bg-indigo-900/50 text-indigo-100 border border-indigo-500/30' 
                : 'bg-slate-800 text-slate-300 border border-slate-700'}
            `}
          >
            {msg.sender === 'ai' && <div className="text-xs text-indigo-400 font-bold mb-1">Caster</div>}
            {msg.text}
          </div>
        ))}
        
        {loading && (
           <div className="flex gap-1 p-2">
             <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
             <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
             <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
           </div>
        )}
      </div>
    </div>
  );
};

export default CommentaryPanel;