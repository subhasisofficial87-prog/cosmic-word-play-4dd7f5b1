import { motion } from 'framer-motion';
import type { TileState, LetterState } from '@/lib/wordle';

interface GameGridProps {
  guesses: TileState[][];
  currentGuess: string;
  currentRow: number;
  maxGuesses: number;
  shaking: boolean;
  revealingRow: number | null;
}

const stateClass: Record<LetterState, string> = {
  correct: 'tile-correct',
  present: 'tile-present',
  absent: 'tile-absent',
  empty: 'tile-empty',
  tbd: 'tile-filled',
};

export default function GameGrid({
  guesses,
  currentGuess,
  currentRow,
  maxGuesses,
  shaking,
  revealingRow,
}: GameGridProps) {
  const rows = [];

  for (let r = 0; r < maxGuesses; r++) {
    const tiles = [];
    for (let c = 0; c < 5; c++) {
      let letter = '';
      let state: LetterState = 'empty';

      if (r < guesses.length) {
        letter = guesses[r][c].letter;
        state = guesses[r][c].state;
      } else if (r === currentRow) {
        letter = currentGuess[c] || '';
        state = letter ? 'tbd' : 'empty';
      }

      const isRevealing = revealingRow === r;
      const delay = c * 0.2;

      tiles.push(
        <motion.div
          key={`${r}-${c}`}
          className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl font-bold rounded-lg uppercase font-body select-none
            ${isRevealing ? '' : stateClass[state]}`}
          initial={false}
          animate={
            isRevealing
              ? {
                  rotateX: [0, 90, 0],
                  transition: { duration: 0.5, delay, ease: 'easeInOut' },
                }
              : letter && state === 'tbd'
              ? { scale: [1, 1.1, 1], transition: { duration: 0.1 } }
              : {}
          }
          style={
            isRevealing
              ? { animationDelay: `${delay}s` }
              : undefined
          }
          onAnimationComplete={() => {}}
        >
          <motion.span
            animate={
              isRevealing
                ? {
                    opacity: [1, 0, 1],
                    transition: { duration: 0.5, delay, ease: 'easeInOut' },
                  }
                : {}
            }
            className={isRevealing ? '' : ''}
          >
            {/* After flip midpoint, show revealed state */}
            {letter}
          </motion.span>
          {/* Overlay for color after reveal */}
          {isRevealing && (
            <motion.div
              className={`absolute inset-0 rounded-lg flex items-center justify-center text-2xl font-bold uppercase font-body ${stateClass[state]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.25, duration: 0.01 }}
            >
              {letter}
            </motion.div>
          )}
        </motion.div>
      );
    }

    rows.push(
      <div
        key={r}
        className={`flex gap-1.5 ${shaking && r === currentRow ? 'animate-shake' : ''}`}
      >
        {tiles}
      </div>
    );
  }

  return <div className="flex flex-col gap-1.5 items-center">{rows}</div>;
}
