import { motion, AnimatePresence } from 'framer-motion';
import type { GameStats } from '@/lib/stats';

interface StatsModalProps {
  open: boolean;
  stats: GameStats;
  won: boolean;
  secretWord: string;
  onPlayAgain: () => void;
  onClose: () => void;
}

export default function StatsModal({ open, stats, won, secretWord, onPlayAgain, onClose }: StatsModalProps) {
  const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDist = Math.max(...stats.guessDistribution, 1);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 w-full max-w-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-center text-lg font-display mb-1 tracking-wider">
              {won ? (
                <span className="neon-text-cyan">YOU WIN! 🎉</span>
              ) : (
                <span className="neon-text-pink">GAME OVER</span>
              )}
            </h2>

            {!won && (
              <p className="text-center text-muted-foreground mb-4 font-body">
                The word was <span className="text-foreground font-bold uppercase">{secretWord}</span>
              </p>
            )}

            <div className="grid grid-cols-4 gap-3 my-6 text-center">
              {[
                [stats.played, 'Played'],
                [winRate + '%', 'Win %'],
                [stats.currentStreak, 'Streak'],
                [stats.bestStreak, 'Best'],
              ].map(([val, label]) => (
                <div key={String(label)}>
                  <div className="text-2xl font-bold text-foreground">{val}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Guess Distribution</p>
              {stats.guessDistribution.map((count, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-3">{i + 1}</span>
                  <div
                    className="h-5 rounded tile-correct flex items-center justify-end px-1.5 text-xs font-bold transition-all"
                    style={{ width: `${Math.max((count / maxDist) * 100, 8)}%` }}
                  >
                    {count}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onPlayAgain}
              className="neon-glow-btn w-full"
            >
              Play Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
