// Game configuration and tunable constants

export const GAME_CONFIG = {
  // Canvas dimensions (9:16 aspect ratio for mobile)
  CANVAS_WIDTH: 304,
  CANVAS_HEIGHT: 600,
  
  // Physics
  GRAVITY: 0.3,
  FRICTION: 0.98,
  LINEAR_DAMPING: 0.99,
  WALL_RESTITUTION: 0.6,
  AVATAR_RESTITUTION: 0.4,
  
  // Puck properties
  PUCK_RADIUS: 15,
  PUCK_MASS: 1,
  MIN_FLICK_VELOCITY: 2,
  MAX_FLICK_VELOCITY: 30,
  VELOCITY_MULTIPLIER: 0.3,
  
  // Avatar properties
  AVATAR_RADIUS: 25,  // Reduced from 40 for better image quality
  AVATAR_COUNT: 3,
  AVATAR_Y_POSITION: 100,  // Moved higher to utilize extra vertical space
  AVATAR_MASS: 10,
  
  // Game mechanics
  INITIAL_SHOTS: 10,
  INITIAL_BATTERY: 100,
  BATTERY_DRAIN_RATE: 0.5,
  POWER_SHOT_COST: 20,
  POWER_SHOT_MULTIPLIER: 1.5,
  SCORE_PER_HIT: 10,
  COMBO_MULTIPLIER: 1.5,
  
  // Combo System
  COMBO_RESET_DELAY: 1500, // ms after miss before combo resets
  COMBO_TIER_THRESHOLDS: [3, 5, 8, 10, 15], // Combo milestones
  COMBO_BASE_MULTIPLIER: 0.1, // 10% per combo level
  COMBO_MAX_MULTIPLIER: 3.0, // Max 3x multiplier
  COMBO_PARTICLE_COLORS: ['#FFD700', '#FF1744', '#00E5FF', '#76FF03', '#E040FB'],
  COMBO_TIER_LABELS: ['NICE!', 'ON FIRE!', 'AMAZING!', 'UNSTOPPABLE!', 'LEGENDARY!'],
  
  // UI
  HUD_HEIGHT: 60,
  BUTTON_SIZE: 50,
  
  // Animation
  HIT_ANIMATION_DURATION: 500,
  ABSORPTION_DURATION: 400, // Duration of puck absorption animation in ms
  PARTICLE_COUNT: 8,
  PARTICLE_LIFETIME: 1000,
  TRAIL_SAMPLE_RATE: 2, // Add trail point every N frames
  TRAIL_FADE_TIME: 3000, // Time in ms for trails to fade out
  
  // Performance
  TARGET_FPS: 60,
  MAX_VELOCITY: 50,
  
  // Obstacles
  BUMPER_RADIUS: 15,
  BUMPER_SPEED_REDUCTION: 0.80, // Reduces velocity to 70% on collision (30% reduction)
  BOX_WIDTH: 60,
  BOX_HEIGHT: 20,
  BOX_RESTITUTION: 0.8,
  L_SHAPE_ARM_WIDTH: 30,
  L_SHAPE_ARM_HEIGHT: 10,
  L_SHAPE_RESTITUTION: 0.8,
  OBSTACLE_MIN_COUNT: 3,
  OBSTACLE_MAX_COUNT: 5,
  OBSTACLE_SPAWN_MARGIN: 30, // Minimum distance from other obstacles
  AVATAR_SAFE_ZONE: 80, // Minimum distance from avatars
  
  // Spawn zone boundaries
  SPAWN_ZONE_TOP: 180, // Y position where obstacles can start spawning
  SPAWN_ZONE_BOTTOM: 430, // Y position where obstacles stop spawning (expanded with extra canvas height)
  
  // Colors
  COLORS: {
    BACKGROUND: '#1a1a2e',
    SECONDARY_BG: '#16213e',
    ACCENT: '#0f3460',
    HIGHLIGHT: '#e94560',
    SUCCESS: '#4CAF50',
    WARNING: '#FFC107',
    TEXT: '#ffffff',
    PUCK_COIN: '#FFD700',
    PUCK_CHERRY: '#FF1744',
    PUCK_GLOVE: '#8B4513',
    BUMPER: '#8E44AD',
    BOX_OBSTACLE: '#E67E22',
  }
};

export type PuckType = 'coin' | 'cherry' | 'glove';

export const PUCK_TYPES: Record<PuckType, {
  emoji: string;
  mass: number;
  restitution: number;
  color: string;
  scoreMultiplier: number;
}> = {
  coin: {
    emoji: '🪙',
    mass: 0.8,
    restitution: 0.7,
    color: GAME_CONFIG.COLORS.PUCK_COIN,
    scoreMultiplier: 1,
  },
  cherry: {
    emoji: '🍒',
    mass: 0.6,
    restitution: 0.5,
    color: GAME_CONFIG.COLORS.PUCK_CHERRY,
    scoreMultiplier: 1.5,
  },
  glove: {
    emoji: '🥊',
    mass: 1.5,
    restitution: 0.4,
    color: GAME_CONFIG.COLORS.PUCK_GLOVE,
    scoreMultiplier: 2,
  },
};

export const AVATAR_EMOJIS = ['👤', '🎭', '🎪'];