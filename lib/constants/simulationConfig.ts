// Activity Simulator Configuration
export interface SimulationConfig {
  enabled: boolean;
  baseIntervalMs: number;
  participantCount: number;
  activityIntensity: 'low' | 'medium' | 'high';
  usernames: string[];
  avatarEmojis: string[];
}

export const SIMULATION_CONFIG: SimulationConfig = {
  enabled: process.env.NEXT_PUBLIC_SIMULATION_ENABLED === 'true',
  baseIntervalMs: 25000, // 25 seconds base interval (slightly faster for more activity)
  participantCount: 3, // Show up to 3 fake participants
  activityIntensity:
    (process.env.NEXT_PUBLIC_SIMULATION_INTENSITY as
      | 'low'
      | 'medium'
      | 'high') || 'medium',
  usernames: [
    // Realistic usernames pool - expanded for variety
    'AlexChen',
    'SarahKim',
    'MikeJohnson',
    'EmmaDavis',
    'DavidLee',
    'LisaWang',
    'ChrisBrown',
    'AmyTaylor',
    'JamesWilson',
    'NinaPatel',
    'RyanGarcia',
    'SophieMartin',
    'KevinLiu',
    'RachelGreen',
    'TomAnderson',
    'MayaSingh',
    'JoshMiller',
    'ZoeClark',
    'BrianPark',
    'LunaRivera',
    'AdamFoster',
    'IrisNguyen',
    'TylerMorris',
    'AvaRodriguez',
    'JordanWu',
    'PriyaShah',
    'CarlosMendez',
    'OliviaChen',
    'EthanKim',
    'IsabellaLiu',
    'MasonWong',
    'AriaPatel',
    'LoganGarcia',
    'ZaraKhan',
    'CalebNg',
    'SofiaRodriguez',
    'DylanPark',
    'LeilaAhmed',
    'HunterLee',
    'MayaPatel',
    'ConnorWu',
    'AriaSingh',
  ],
  avatarEmojis: [
    // Emoji avatars for fake participants - more diverse and thematic
    '🚀',
    '⭐',
    '🎯',
    '⚡',
    '🔥',
    '💎',
    '🌟',
    '🎪',
    '🎨',
    '🎭',
    '🎪',
    '🎯',
    '⚽',
    '🏀',
    '🎾',
    '🏐',
    '🏓',
    '🏸',
    '🥊',
    '🥋',
    '🎱',
    '🎲',
    '♠️',
    '♥️',
    '♦️',
    '♣️',
    '🃏',
    '🎴',
    '🎨',
    '🎭',
    '🎪',
    '🎯',
    '🚀',
    '⭐',
    '⚡',
    '🔥',
    '💎',
    '🌟',
    '🎪',
    '🎨',
  ],
};

// Intensity multipliers for different activity levels
export const INTENSITY_MULTIPLIERS = {
  low: 0.5,
  medium: 1.0,
  high: 1.5,
} as const;

// Activity type probabilities (weighted)
export const ACTIVITY_PROBABILITIES = {
  tip: 0.7, // 70% chance for tip events
  participant: 0.3, // 30% chance for participant events
} as const;
