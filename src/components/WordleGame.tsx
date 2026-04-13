import { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import GameGrid from '@/components/GameGrid';
import Keyboard from '@/components/Keyboard';
import StatsModal from '@/components/StatsModal';
import { evaluateGuess, updateKeyboardState, type TileState, type KeyboardState } from '@/lib/wordle';
import { getRandomWord, isValidWord } from '@/lib/words';
import { getStats, recordWin, recordLoss, type GameStats } from '@/lib/stats';
import { playKeyPress, playBackspace, playSubmit, playError, playWin, playLoss, playHint, playCorrectReveal, playPresentReveal, playAbsentReveal } from '@/lib/sounds';

interface WordleGameProps {
  maxGuesses?: number;
  maxHints?: number;
  wordLength?: number;
}

export default function WordleGame({ maxGuesses = 6, maxHints = 2, wordLength = 5 }: WordleGameProps) {
  const [secretWord, setSecretWord] = useState(() => getRandomWord(wordLength));
  const [guesses, setGuesses] = useState<TileState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [keyStates, setKeyStates] = useState<KeyboardState>({});
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<GameStats>(getStats);
  const [toast, setToast] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const toastTimeout = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(''), 2000);
  }, []);

  const fireConfetti = useCallback(() => {
    const colors = ['#00FFFF', '#FF00FF', '#39FF14', '#FFFF00'];
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5 }, colors }), 300);
  }, []);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) {
      setShaking(true);
      showToast('Not enough letters');
      setTimeout(() => setShaking(false), 500);
      return;
    }

    if (!isValidWord(currentGuess)) {
      setShaking(true);
      showToast('Not in word list');
      setTimeout(() => setShaking(false), 500);
      return;
    }

    const evaluation = evaluateGuess(currentGuess, secretWord);
    const rowIndex = guesses.length;

    setRevealingRow(rowIndex);
    setGuesses(prev => [...prev, evaluation]);
    setCurrentGuess('');
    setKeyStates(prev => updateKeyboardState(prev, evaluation));

    const isWin = evaluation.every(t => t.state === 'correct');
    const isLoss = !isWin && rowIndex + 1 >= maxGuesses;

    setTimeout(() => {
      setRevealingRow(null);

      if (isWin) {
        setWon(true);
        setGameOver(true);
        fireConfetti();
        const s = recordWin(rowIndex + 1);
        setStats(s);
        setTimeout(() => setShowStats(true), 1500);
      } else if (isLoss) {
        setGameOver(true);
        const s = recordLoss();
        setStats(s);
        setTimeout(() => setShowStats(true), 1000);
      }
    }, wordLength * 200 + 300);
  }, [currentGuess, secretWord, guesses.length, maxGuesses, wordLength, showToast, fireConfetti]);

  const handleKey = useCallback((key: string) => {
    if (gameOver) return;
    if (revealingRow !== null) return;

    if (key === 'enter') {
      submitGuess();
    } else if (key === 'back') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key.length === 1 && /^[a-z]$/i.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + key.toLowerCase());
    }
  }, [gameOver, revealingRow, currentGuess, wordLength, submitGuess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter') handleKey('enter');
      else if (e.key === 'Backspace') handleKey('back');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const showHint = useCallback(() => {
    if (gameOver || hintsUsed >= maxHints) return;
    const unrevealed = Array.from({ length: wordLength }, (_, i) => i).filter(i => !revealedHints.includes(i));
    if (unrevealed.length === 0) return;
    const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setRevealedHints(prev => [...prev, idx]);
    setHintsUsed(prev => prev + 1);
    showToast(`Hint: Letter ${idx + 1} is "${secretWord[idx].toUpperCase()}"`);
  }, [gameOver, hintsUsed, maxHints, wordLength, revealedHints, secretWord, showToast]);

  const newGame = useCallback(() => {
    setSecretWord(getRandomWord(wordLength));
    setGuesses([]);
    setCurrentGuess('');
    setKeyStates({});
    setGameOver(false);
    setWon(false);
    setShowStats(false);
    setRevealingRow(null);
    setHintsUsed(0);
    setRevealedHints([]);
  }, [wordLength]);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-lg mx-auto px-2">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg font-body font-bold text-sm animate-bounce-in">
          {toast}
        </div>
      )}

      <GameGrid
        guesses={guesses}
        currentGuess={currentGuess}
        currentRow={guesses.length}
        maxGuesses={maxGuesses}
        wordLength={wordLength}
        shaking={shaking}
        revealingRow={revealingRow}
      />

      <Keyboard keyStates={keyStates} onKey={handleKey} />

      {!gameOver && maxHints > 0 && (
        <button
          onClick={showHint}
          disabled={hintsUsed >= maxHints}
          className="neon-glow-btn-secondary text-xs px-4 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          💡 Hint ({maxHints - hintsUsed} left)
        </button>
      )}

      {gameOver && (
        <div className="flex gap-3 mt-2">
          <button onClick={newGame} className="neon-glow-btn text-sm">
            New Word
          </button>
          <button onClick={() => setShowStats(true)} className="neon-glow-btn-secondary text-sm">
            Stats
          </button>
        </div>
      )}

      <StatsModal
        open={showStats}
        stats={stats}
        won={won}
        secretWord={secretWord}
        onPlayAgain={newGame}
        onClose={() => setShowStats(false)}
      />
    </div>
  );
}
