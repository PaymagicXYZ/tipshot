// LocalStorage utilities

const STORAGE_KEYS = {
  BEST_SCORE: 'puckit_best_score',
  BEST_COMBO: 'puckit_best_combo',
  SETTINGS: 'puckit_settings',
  STATS: 'puckit_stats',
};

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  reducedMotion: boolean;
}

export interface GameStats {
  totalGames: number;
  totalShots: number;
  totalHits: number;
  bestScore: number;
  bestCombo: number;
}

export function getBestScore(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function setBestScore(score: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
  } catch (e) {
    console.warn('Failed to save best score:', e);
  }
}

export function getBestCombo(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BEST_COMBO);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function setBestCombo(combo: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BEST_COMBO, combo.toString());
  } catch (e) {
    console.warn('Failed to save best combo:', e);
  }
}

export function getSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to defaults
  }
  
  return {
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
    reducedMotion: false,
  };
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function getStats(): GameStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to defaults
  }
  
  return {
    totalGames: 0,
    totalShots: 0,
    totalHits: 0,
    bestScore: 0,
    bestCombo: 0,
  };
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save stats:', e);
  }
}

export function updateStats(updates: Partial<GameStats>): void {
  const current = getStats();
  const updated = { ...current, ...updates };
  saveStats(updated);
}