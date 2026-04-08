import StarField from '@/components/StarField';
import WordleGame from '@/components/WordleGame';

const Index = () => {
  return (
    <div className="cosmic-bg min-h-screen flex flex-col relative">
      <StarField />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-center py-4 sm:py-6 border-b border-border/30">
        <h1 className="text-lg sm:text-xl tracking-widest">
          <span className="neon-text-cyan">MY</span>{' '}
          <span className="neon-text-pink">WORD</span>{' '}
          <span className="neon-text-cyan">IS</span>
        </h1>
      </header>

      {/* Game */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 sm:py-8">
        <WordleGame />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-3 text-xs text-muted-foreground font-body">
        Guess the 5-letter word • 6 tries
      </footer>
    </div>
  );
};

export default Index;
