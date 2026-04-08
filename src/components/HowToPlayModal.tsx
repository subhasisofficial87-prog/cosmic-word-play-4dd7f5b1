import { motion, AnimatePresence } from 'framer-motion';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
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
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 w-full max-w-sm space-y-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-center text-lg font-display tracking-wider neon-text-cyan">
              HOW TO PLAY
            </h2>

            <p className="text-sm text-muted-foreground font-body">
              Guess the secret <span className="text-foreground font-bold">5-letter word</span> in 6 tries.
            </p>

            <ul className="text-sm text-muted-foreground font-body space-y-2 list-disc list-inside">
              <li>Type a valid 5-letter word and press <span className="text-foreground font-bold">Enter</span>.</li>
              <li>Each tile changes color to show how close your guess was.</li>
            </ul>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-bold uppercase">Examples</p>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold tile-correct">W</span>
                <span className="text-xs text-muted-foreground">Green — correct letter & position</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold tile-present">I</span>
                <span className="text-xs text-muted-foreground">Yellow — correct letter, wrong spot</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold tile-absent">N</span>
                <span className="text-xs text-muted-foreground">Gray — letter not in the word</span>
              </div>
            </div>

            <button onClick={onClose} className="neon-glow-btn w-full mt-2">
              Got It!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
