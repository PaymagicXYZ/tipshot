'use client';

/**
 * Participant Toast Components
 *
 * Toast notifications for participant events (join/leave)
 */

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { cn } from '@/lib/utils';
import { UserPlus, UserMinus } from 'lucide-react';

interface ParticipantToastProps {
  username?: string;
  avatar?: string;
  type: 'sender' | 'receiver';
  action: 'joined' | 'left';
  className?: string;
}

export const ParticipantToast = ({
  username = 'Someone',
  avatar,
  type,
  action,
  className,
}: ParticipantToastProps) => {
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isJoined = action === 'joined';
  const Icon = isJoined ? UserPlus : UserMinus;
  const typeLabel = type === 'sender' ? 'Sender' : 'Receiver';
  const emoji = isJoined ? (type === 'sender' ? '👋' : '🎯') : '👋';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, x: isJoined ? -50 : 50 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.8, opacity: 0, x: isJoined ? 50 : -50 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm shadow-lg',
        isJoined
          ? 'bg-[var(--toss-primary-secondary)]/40 border border-[var(--toss-primary)]/50 shadow-[var(--toss-primary)]/20'
          : 'bg-muted/40 border border-border/50',
        className,
      )}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        <Avatar
          className={cn(
            'h-10 w-10 ring-2',
            isJoined
              ? 'ring-[var(--toss-primary)]/60'
              : 'ring-muted-foreground/30',
          )}
        >
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback
            className={cn(
              'text-white text-xs font-semibold',
              isJoined
                ? 'bg-gradient-to-br from-[var(--toss-primary)] to-[var(--toss-primary-foreground)]'
                : 'bg-muted-foreground',
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <span className="font-semibold text-foreground truncate">
            {username}
          </span>
          <span className="text-muted-foreground text-sm">{action}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            'text-xs font-medium mt-0.5',
            isJoined ? 'text-[var(--toss-primary)]' : 'text-muted-foreground',
          )}
        >
          {typeLabel}
        </motion.div>
      </div>

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
        className={cn(
          'p-2 rounded-full',
          isJoined
            ? 'bg-[var(--toss-primary)]/20 text-[var(--toss-primary)]'
            : 'bg-muted text-muted-foreground',
        )}
      >
        <Icon className="h-4 w-4" />
      </motion.div>

      {/* Animated emoji */}
      {isJoined && (
        <motion.div
          className="absolute -top-1 -right-1 text-xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          {emoji}
        </motion.div>
      )}
    </motion.div>
  );
};

// Compact version for less intrusive notifications
export const ParticipantToastCompact = ({
  username = 'Someone',
  type,
  action,
  className,
}: Omit<ParticipantToastProps, 'avatar'>) => {
  const isJoined = action === 'joined';
  const Icon = isJoined ? UserPlus : UserMinus;
  const emoji = isJoined ? (type === 'sender' ? '👋' : '🎯') : '👋';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-sm font-medium',
        isJoined
          ? 'bg-gradient-to-r from-[var(--toss-primary)] to-[var(--toss-primary-secondary-hover)] text-white shadow-[var(--toss-primary)]/40'
          : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      <motion.span
        animate={
          isJoined
            ? {
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1, 1.2, 1],
              }
            : {}
        }
        transition={{
          duration: 0.5,
          repeat: 1,
          repeatDelay: 0.2,
        }}
      >
        {emoji}
      </motion.span>
      <span className="truncate">{username}</span>
      <Icon className="h-3 w-3 flex-shrink-0" />
    </motion.div>
  );
};
