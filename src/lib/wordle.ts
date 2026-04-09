export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

export interface TileState {
  letter: string;
  state: LetterState;
}

/**
 * Evaluate a guess against the secret word using standard Wordle rules.
 * Handles duplicate letters properly and variable word lengths.
 */
export function evaluateGuess(guess: string, secret: string): TileState[] {
  const len = secret.length;
  const g = guess.toLowerCase().split('');
  const s = secret.toLowerCase().split('');
  const result: TileState[] = g.map(l => ({ letter: l, state: 'absent' as LetterState }));
  const secretUsed = new Array(len).fill(false);

  for (let i = 0; i < len; i++) {
    if (g[i] === s[i]) {
      result[i].state = 'correct';
      secretUsed[i] = true;
    }
  }

  for (let i = 0; i < len; i++) {
    if (result[i].state === 'correct') continue;
    for (let j = 0; j < len; j++) {
      if (!secretUsed[j] && g[i] === s[j]) {
        result[i].state = 'present';
        secretUsed[j] = true;
        break;
      }
    }
  }

  return result;
}

export type KeyboardState = Record<string, LetterState>;

export function updateKeyboardState(
  current: KeyboardState,
  evaluation: TileState[]
): KeyboardState {
  const next = { ...current };
  const priority: Record<LetterState, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    tbd: 0,
    empty: 0,
  };

  for (const tile of evaluation) {
    const existing = next[tile.letter];
    if (!existing || priority[tile.state] > priority[existing]) {
      next[tile.letter] = tile.state;
    }
  }

  return next;
}
