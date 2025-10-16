'use client';

/**
 * Tip Toast Components
 *
 * Three beautiful toast notification styles for displaying tip transactions:
 *
 * 1. TipToast (Default) - Full-featured toast with avatars and animations
 *    - Shows sender/receiver avatars
 *    - Animated money particles
 *    - Purple gradient theme matching brand
 *    - Best for: Standard tip notifications
 *
 * 2. TipToastCompact - Minimal, pill-shaped notification
 *    - No avatars, just usernames and amount
 *    - Smaller footprint
 *    - Best for: High-frequency tips, minimal UI
 *
 * 3. TipToastEpic - Full celebration mode
 *    - Large, attention-grabbing
 *    - Confetti animations
 *    - Vibrant gradient
 *    - Best for: Large tips, special events
 */

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { cn } from '@/lib/utils';

interface TipToastProps {
  senderUsername?: string;
  senderAvatar?: string;
  receiverUsername?: string;
  receiverAvatar?: string;
  formattedValue: string;
  className?: string;
}

export const TipToast = ({
  senderUsername = 'Someone',
  senderAvatar,
  receiverUsername = 'Someone',
  receiverAvatar,
  formattedValue,
  className,
}: TipToastProps) => {
  const senderInitials = senderUsername
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const receiverInitials = receiverUsername
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={cn(
        'flex items-center gap-3 p-4 bg-[var(--toss-primary-secondary)]/40 border border-[var(--toss-primary)]/50 rounded-xl backdrop-blur-sm shadow-lg shadow-[var(--toss-primary)]/20',
        className,
      )}
    >
      {/* Sender Avatar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Avatar className="h-10 w-10 ring-2 ring-[var(--toss-primary)]/60">
          <AvatarImage src={senderAvatar} alt={senderUsername} />
          <AvatarFallback className="bg-gradient-to-br from-[var(--toss-primary)] to-[var(--toss-primary-foreground)] text-white text-xs">
            {senderInitials}
          </AvatarFallback>
        </Avatar>
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="font-semibold text-foreground truncate">
            {senderUsername}
          </span>
          <span className="text-muted-foreground text-sm">sent</span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[var(--toss-primary)] to-[var(--toss-primary-secondary-hover)] text-white rounded-full font-bold text-sm shadow-lg shadow-[var(--toss-primary)]/40"
          >
            <motion.span
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.2, 1.2, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                delay: 0.4,
                repeat: 2,
                repeatDelay: 0.2,
              }}
            >
              💸
            </motion.span>
            {formattedValue}
          </motion.span>
          <span className="text-muted-foreground text-sm">to</span>
          <span className="font-semibold text-foreground truncate">
            {receiverUsername}
          </span>
        </motion.div>
      </div>

      {/* Receiver Avatar */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Avatar className="h-10 w-10 ring-2 ring-[var(--toss-primary)]/60">
          <AvatarImage src={receiverAvatar} alt={receiverUsername} />
          <AvatarFallback className="bg-gradient-to-br from-[var(--toss-primary-foreground)] to-[var(--toss-primary-secondary-hover)] text-white text-xs">
            {receiverInitials}
          </AvatarFallback>
        </Avatar>
      </motion.div>

      {/* Floating money particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: '50%',
              y: '50%',
              opacity: 1,
              scale: 0,
            }}
            animate={{
              x: `${50 + (Math.random() - 0.5) * 100}%`,
              y: `${50 + (Math.random() - 0.5) * 100}%`,
              opacity: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.5 + i * 0.1,
              ease: 'easeOut',
            }}
            className="absolute text-xl"
            style={{
              left: 0,
              top: 0,
            }}
          >
            💰
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Compact version for less intrusive notifications
export const TipToastCompact = ({
  senderUsername = 'Someone',
  receiverUsername = 'Someone',
  formattedValue,
  className,
}: Omit<TipToastProps, 'senderAvatar' | 'receiverAvatar'>) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={cn(
        'flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--toss-primary)] to-[var(--toss-primary-secondary-hover)] text-white rounded-full shadow-lg shadow-[var(--toss-primary)]/40',
        className,
      )}
    >
      <motion.span
        animate={{
          rotate: [0, -15, 15, -15, 0],
          scale: [1, 1.3, 1.3, 1.3, 1],
        }}
        transition={{
          duration: 0.6,
          repeat: 2,
          repeatDelay: 0.3,
        }}
        className="text-xl"
      >
        💸
      </motion.span>
      <span className="font-semibold text-sm">
        {senderUsername}
        <span className="font-normal opacity-90 mx-1">→</span>
        {receiverUsername}
      </span>
      <span className="font-bold text-sm bg-white/20 px-2 py-0.5 rounded-full">
        {formattedValue}
      </span>
    </motion.div>
  );
};

// Epic version for big tips - full screen celebration
export const TipToastEpic = ({
  senderUsername = 'Someone',
  receiverUsername = 'Someone',
  formattedValue,
  className,
}: Omit<TipToastProps, 'senderAvatar' | 'receiverAvatar'>) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 180, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 p-8 bg-gradient-to-br from-[var(--toss-primary)] via-[var(--toss-primary-secondary-hover)] to-[var(--toss-primary-foreground)] text-white rounded-2xl shadow-2xl shadow-[var(--toss-primary)]/50',
        className,
      )}
    >
      {/* Confetti background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: '50%',
              y: '50%',
              opacity: 1,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
              scale: [0, 1, 0.5],
              rotate: Math.random() * 720,
            }}
            transition={{
              duration: 2,
              delay: i * 0.05,
              ease: 'easeOut',
            }}
            className="absolute text-2xl"
          >
            {['🎉', '✨', '💰', '🌟', '💸'][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl font-black tracking-tight z-10"
      >
        {formattedValue}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 text-xl font-bold z-10"
      >
        <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
          {senderUsername}
        </span>
        <motion.span
          animate={{
            x: [0, 5, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          →
        </motion.span>
        <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
          {receiverUsername}
        </span>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="text-sm uppercase tracking-widest font-bold z-10 opacity-90"
      >
        🎊 Epic Tip! 🎊
      </motion.div>
    </motion.div>
  );
};
