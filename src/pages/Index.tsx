import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import StarField from '@/components/StarField';
import WordleGame from '@/components/WordleGame';
import HowToPlayModal from '@/components/HowToPlayModal';

const Index = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="cosmic-bg min-h-screen flex flex-col relative">
      <StarField />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:py-6 border-b border-border/30">
        <div className="w-24" />
        <h1 className="text-lg sm:text-xl tracking-widest">
          <span className="neon-text-cyan">MY</span>{' '}
          <span className="neon-text-pink">WORD</span>{' '}
          <span className="neon-text-cyan">IS</span>
        </h1>
        <div className="w-24 flex justify-end">
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
        <WordleGame />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-3 text-xs text-muted-foreground font-body">
        Guess the 5-letter word • 6 tries
      </footer>

      <HowToPlayModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default Index;
