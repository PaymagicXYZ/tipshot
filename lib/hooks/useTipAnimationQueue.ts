'use client';

import { useState, useCallback } from 'react';
import type { TipAnimationConfig } from '@/lib/config/tipAnimations';

export interface AnimationRequest {
  id: string;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  config?: Partial<TipAnimationConfig>;
  receiverId: number;
}

export interface ActiveAnimation extends AnimationRequest {
  onComplete: () => void;
}

export const useTipAnimationQueue = () => {
  const [activeAnimations, setActiveAnimations] = useState<ActiveAnimation[]>(
    [],
  );

  // Add animation immediately (no queuing)
  const enqueueAnimation = useCallback((request: AnimationRequest) => {
    const animation: ActiveAnimation = {
      ...request,
      onComplete: () => {
        // Remove this animation when it completes
        setActiveAnimations((current) =>
          current.filter((anim) => anim.id !== request.id),
        );
      },
    };

    setActiveAnimations((current) => [...current, animation]);
  }, []);

  // Clear all animations
  const clearQueue = useCallback(() => {
    setActiveAnimations([]);
  }, []);

  return {
    activeAnimation: activeAnimations[0] || null, // For backwards compatibility
    activeAnimations, // New: all active animations
    queueLength: 0, // No queue anymore
    enqueueAnimation,
    clearQueue,
    isProcessing: activeAnimations.length > 0,
  };
};
