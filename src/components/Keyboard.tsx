import type { KeyboardState, LetterState } from '@/lib/wordle';

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back'],
];

const stateClass: Record<LetterState | 'default', string> = {
  correct: 'key-correct',
  present: 'key-present',
  absent: 'key-absent',
  empty: '',
  tbd: '',
  default: '',
};

interface KeyboardProps {
  keyStates: KeyboardState;
  onKey: (key: string) => void;
}

export default function Keyboard({ keyStates, onKey }: KeyboardProps) {
  return (
    <div className="flex flex-col gap-1.5 items-center w-full max-w-lg mx-auto">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 sm:gap-1.5 justify-center w-full">
          {row.map((key) => {
            const isWide = key === 'enter' || key === 'back';
            const state = keyStates[key];
            const cls = state ? stateClass[state] : stateClass.default;

            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`
                  ${isWide ? 'px-3 sm:px-4 text-xs' : 'w-8 sm:w-10 text-sm sm:text-base'}
                  h-12 sm:h-14 rounded-lg font-bold uppercase font-body
                  transition-all duration-200 active:scale-95
                  ${cls || 'bg-muted text-foreground hover:bg-muted/80'}
                  select-none
                `}
              >
                {key === 'back' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
