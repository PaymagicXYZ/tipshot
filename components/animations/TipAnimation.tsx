'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TipAnimationConfig } from '@/lib/config/tipAnimations';
import { DEFAULT_ANIMATION_CONFIG } from '@/lib/config/tipAnimations';

interface TipAnimationProps {
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  config?: Partial<TipAnimationConfig>;
  onComplete?: () => void;
}

// Coin icon component
const CoinIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Coin icon"
  >
    <title>Tip coin</title>
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="#FFD700"
      stroke="#FFA500"
      strokeWidth="2"
    />
    <text
      x="12"
      y="16"
      fontSize="12"
      fontWeight="bold"
      fill="#FFA500"
      textAnchor="middle"
    >
      $
    </text>
  </svg>
);

// Particle component
const Particle = ({ size }: { size: number }) => (
  <div
    className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
    style={{ width: size, height: size }}
  />
);

export const TipAnimation = ({
  startPos,
  endPos,
  config = {},
  onComplete,
}: TipAnimationProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const finalConfig = { ...DEFAULT_ANIMATION_CONFIG, ...config };
  const { type, duration, trailLength, size } = finalConfig;

  const AnimatedElement = type === 'coin' ? CoinIcon : Particle;

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{ isolation: 'isolate' }}
    >
      {/* Main animated element */}
      <motion.div
        initial={{
          x: startPos.x,
          y: startPos.y,
          scale: 1,
          opacity: 1,
        }}
        animate={{
          x: endPos.x,
          y: endPos.y,
          scale: 1,
          opacity: 0.8,
        }}
        transition={{
          duration: duration / 1000,
          ease: 'linear', // Perfectly linear motion
        }}
        onAnimationComplete={onComplete}
        style={{
          position: 'absolute',
          width: size,
          height: size,
        }}
      >
        <AnimatedElement size={size} />
      </motion.div>

      {/* Trail elements */}
      {Array.from({ length: trailLength }).map((_, index) => {
        const delay = (index + 1) * 0.05; // 50ms delay between each trail element
        const trailSize = size * (1 - (index + 1) * 0.15); // Each trail element is smaller
        const trailOpacity = 1 - (index + 1) * 0.2; // Each trail element is more transparent

        return (
          <motion.div
            key={`trail-${startPos.x}-${startPos.y}-${index}`}
            initial={{
              x: startPos.x,
              y: startPos.y,
              scale: 1,
              opacity: 0,
            }}
            animate={{
              x: endPos.x,
              y: endPos.y,
              scale: 1,
              opacity: [0, trailOpacity, 0],
            }}
            transition={{
              duration: duration / 1000,
              ease: 'linear', // Perfectly linear motion
              delay,
            }}
            style={{
              position: 'absolute',
              width: trailSize,
              height: trailSize,
            }}
          >
            <AnimatedElement size={trailSize} />
          </motion.div>
        );
      })}
    </div>,
    document.body,
  );
};
