export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: number[];
}

const STATS_KEY = 'mywordis-stats';

export function getStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { played: 0, won: 0, currentStreak: 0, bestStreak: 0, guessDistribution: [0, 0, 0, 0, 0, 0] };
}

export function saveStats(stats: GameStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordWin(guessCount: number): GameStats {
  const stats = getStats();
  stats.played++;
  stats.won++;
  stats.currentStreak++;
  stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
  stats.guessDistribution[guessCount - 1]++;
  saveStats(stats);
  return stats;
}

export function recordLoss(): GameStats {
  const stats = getStats();
  stats.played++;
  stats.currentStreak = 0;
  saveStats(stats);
  return stats;
}
