// Simple audio utility

// Pre-load voices
let voices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    voices = window.speechSynthesis.getVoices();
  };
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

type Gender = 'male' | 'female';

export const speak = (text: string, gender: Gender = 'male', pitch: number = 1.0, rate: number = 1.0) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any currently playing speech to avoid overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1.0;

  let selectedVoice: SpeechSynthesisVoice | undefined;

  if (gender === 'female') {
     // Priority list for female voices
     selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes('google us english') || // Chrome default (often female)
        v.name.toLowerCase().includes('samantha') || 
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('zira')
     );
  } else {
    // Priority list for male voices
    selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes('google uk english male') || 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('male')
    );
  }

  if (selectedVoice) {
      utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const playSoundEffect = (type: 'roll' | 'move' | 'step' | 'win' | 'capture' | 'dragon') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'roll') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        osc.frequency.linearRampToValueAtTime(100, now + 0.25);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'step') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'capture') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(783.99, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 1.5);
        osc.start(now);
        osc.stop(now + 1.5);
    } else if (type === 'dragon') {
        // Low rumble for dragon roar
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.5);
        osc.frequency.exponentialRampToValueAtTime(30, now + 1.5);
        
        // Add noise buffer for fire breath effect (simulated)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.5, now + 0.5);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
        
        noise.start(now);
        osc.start(now);
        osc.stop(now + 2.0);
        
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0, now + 1.5);
    }
};