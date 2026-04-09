import { useState } from 'react';
import StarField from '@/components/StarField';
import WordleGame from '@/components/WordleGame';
import HowToPlayModal from '@/components/HowToPlayModal';

export type Difficulty = 'easy' | 'normal' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', maxGuesses: 7, maxHints: 3 },
  normal: { label: 'Normal', maxGuesses: 6, maxHints: 2 },
  hard: { label: 'Hard', maxGuesses: 5, maxHints: 0 },
};

const Index = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="cosmic-bg min-h-screen flex flex-col relative">
      <StarField />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:py-6 border-b border-border/30">
        <div className="w-28 flex gap-1">
          {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-[10px] sm:text-xs px-2 py-1 rounded transition-all font-body uppercase tracking-wider ${
                difficulty === d
                  ? 'neon-glow-btn text-xs'
                  : 'neon-glow-btn-secondary opacity-60 hover:opacity-100'
              }`}
            >
              {DIFFICULTY_CONFIG[d].label}
            </button>
          ))}
        </div>
        <h1 className="text-lg sm:text-xl tracking-widest">
          <span className="neon-text-cyan">MY</span>{' '}
          <span className="neon-text-pink">WORD</span>{' '}
          <span className="neon-text-cyan">IS</span>
        </h1>
        <div className="w-28 flex justify-end">
          <button
            onClick={() => setShowHelp(true)}
            className="neon-glow-btn-secondary text-xs px-3 py-1.5"
          >
            How to Play
          </button>
        </div>
      </header>

      {/* Game */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 sm:py-8">
        <WordleGame
          key={difficulty}
          maxGuesses={config.maxGuesses}
          maxHints={config.maxHints}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-3 text-xs text-muted-foreground font-body">
        Guess the 5-letter word • {config.maxGuesses} tries
        {config.maxHints > 0 && ` • ${config.maxHints} hints`}
      </footer>

      <HowToPlayModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default Index;
