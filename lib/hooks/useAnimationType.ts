'use client';

import { useState, useCallback } from 'react';
import type { AnimationType } from '@/lib/config/tipAnimations';

const STORAGE_KEY = 'tip-animation-type';

export const useAnimationType = () => {
  const [animationType, setAnimationType] = useState<AnimationType>(() => {
    // Initialize from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'coin' || stored === 'particle') {
        return stored;
      }
    }
    return 'coin';
  });

  // Save to localStorage when changed
  const updateAnimationType = useCallback((type: AnimationType) => {
    setAnimationType(type);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, type);
    }
  }, []);

  return {
    animationType,
    setAnimationType: updateAnimationType,
  };
};
