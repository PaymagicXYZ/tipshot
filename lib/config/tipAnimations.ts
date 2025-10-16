export type AnimationType = 'coin' | 'particle';

export interface TipAnimationConfig {
  type: AnimationType;
  duration: number; // in milliseconds
  trailLength: number; // number of trail elements
  size: number; // size of the animated element in pixels
}

export const DEFAULT_ANIMATION_CONFIG: TipAnimationConfig = {
  type: 'coin',
  duration: 1000,
  trailLength: 5,
  size: 32,
};

export const ANIMATION_TYPES = {
  coin: 'coin',
  particle: 'particle',
} as const;
