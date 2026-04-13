import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import StarField from '@/components/StarField';
import WordleGame from '@/components/WordleGame';
import HowToPlayModal from '@/components/HowToPlayModal';
import { isMuted, setMuted } from '@/lib/sounds';

export type Difficulty = 'easy' | 'normal' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', maxGuesses: 7, maxHints: 3 },
  normal: { label: 'Normal', maxGuesses: 6, maxHints: 2 },
  hard: { label: 'Hard', maxGuesses: 5, maxHints: 0 },
};

const WORD_LENGTHS = [4, 5, 6, 7, 8] as const;

const Index = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [wordLength, setWordLength] = useState<number>(5);
  const [muteState, setMuteState] = useState(isMuted());

  const config = DIFFICULTY_CONFIG[difficulty];

  // Reset key changes when difficulty or word length changes
  const gameKey = `${difficulty}-${wordLength}`;

  return (
    <div className="cosmic-bg min-h-screen flex flex-col relative">
      <StarField />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:py-6 border-b border-border/30">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
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
          <div className="flex gap-1">
            {WORD_LENGTHS.map((len) => (
              <button
                key={len}
                onClick={() => setWordLength(len)}
                className={`text-[10px] sm:text-xs px-2 py-1 rounded transition-all font-body tracking-wider ${
                  wordLength === len
                    ? 'neon-glow-btn text-xs'
                    : 'neon-glow-btn-secondary opacity-60 hover:opacity-100'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
        <h1 className="text-lg sm:text-xl tracking-widest">
          <span className="neon-text-cyan">MY</span>{' '}
          <span className="neon-text-pink">WORD</span>{' '}
          <span className="neon-text-cyan">IS</span>
        </h1>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => { const next = !isMuted(); setMuted(next); setMuteState(next); }}
            className="neon-glow-btn-secondary text-xs px-2 py-1.5"
            aria-label={muteState ? 'Unmute' : 'Mute'}
          >
            {muteState ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
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
          key={gameKey}
          maxGuesses={config.maxGuesses}
          maxHints={config.maxHints}
          wordLength={wordLength}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-3 text-xs text-muted-foreground font-body">
        Guess the {wordLength}-letter word • {config.maxGuesses} tries
        {config.maxHints > 0 && ` • ${config.maxHints} hints`}
      </footer>

      <HowToPlayModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default Index;
