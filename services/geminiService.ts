// OFFLINE COMMENTARY ENGINE
// This replaces the Google Gemini API to allow the game to run without internet.

const PHRASES = {
  START: [
    "The battle begins! Who will conquer the board?",
    "Engines ready. Let's roll some dice!",
    "Welcome to the arena. Mercy is not an option.",
    "Good luck, you'll need it."
  ],
  ROLL_6: [
    "A SIX! The gods are watching!",
    "Maximum power! Roll again!",
    "Boom! A six to break the silence!",
    "Unstoppable! Keep the momentum going!"
  ],
  ROLL_1: [
    "Just a one? That's painful.",
    "Slow and steady... mostly slow.",
    "A single step. Better than nothing, I guess.",
    "One. Tragic."
  ],
  CAPTURE: [
    "SAVAGE! Sent them back to the shadow realm!",
    "Capture confirmed! That's gotta hurt.",
    "Ruthless aggression! Back to start!",
    "Denied! Get off my board!",
    "Cold blooded murder on the dance floor!"
  ],
  WIN: [
    "VICTORY! The champion has risen!",
    "Game Over! We have a legend in our midst!",
    "Unbelievable performance! The crown is yours!",
    "Dominance asserted. GG!"
  ],
  GENERIC_MOVE: [
    "Making moves.",
    "The tension is building.",
    "Calculated risk?",
    "Closing the distance.",
    "Watch your back...",
    "Steady progress."
  ],
  BLOCKED: [
    "Rolled a number but nowhere to go!",
    "Stuck in the mud.",
    "Turn skipped. Tough luck.",
    "No legal moves! The pain!"
  ]
};

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getGameCommentary = async (
  history: string[], 
  lastEvent: string,
  winner: string | null
): Promise<string | null> => {
  
  // Simulate network delay for realism (optional, but feels better)
  await new Promise(resolve => setTimeout(resolve, 600));

  if (winner) {
    return `${getRandom(PHRASES.WIN)} (${winner.toUpperCase()} wins!)`;
  }

  const eventLower = lastEvent.toLowerCase();

  if (eventLower.includes("game started")) {
    return getRandom(PHRASES.START);
  }

  if (eventLower.includes("captured")) {
    return getRandom(PHRASES.CAPTURE);
  }

  if (eventLower.includes("no moves") || eventLower.includes("blocked")) {
    return getRandom(PHRASES.BLOCKED);
  }

  if (eventLower.includes("rolled 6")) {
    return getRandom(PHRASES.ROLL_6);
  }

  if (eventLower.includes("rolled 1")) {
    return getRandom(PHRASES.ROLL_1);
  }

  // Default
  return getRandom(PHRASES.GENERIC_MOVE);
};