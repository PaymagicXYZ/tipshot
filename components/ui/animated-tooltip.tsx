'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { cn } from '@/lib/utils';

export const AnimatedTooltip = ({
  items,
  className,
  onItemClick,
  itemRefs,
  currentUserId,
  showCurrentUserSeparately = false,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
    lastSeenAt?: string | null;
    isActive?: boolean;
  }[];
  className?: string;
  onItemClick?: (item: {
    id: number;
    name: string;
    designation: string;
    image: string;
    lastSeenAt?: string | null;
    isActive?: boolean;
  }) => void;
  itemRefs?: React.MutableRefObject<Map<number, HTMLDivElement>>;
  currentUserId?: number;
  showCurrentUserSeparately?: boolean;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const formatLastSeen = (lastSeenAt: string | null | undefined) => {
    if (!lastSeenAt) return 'Never';

    try {
      const now = new Date();

      // Enhanced debugging - let's see exactly what we're getting
      console.log('=== DEBUGGING LAST SEEN ===');
      console.log('Raw input:', lastSeenAt);
      console.log('Input type:', typeof lastSeenAt);

      // Parse the timestamp - Supabase timestamptz returns UTC timestamps
      let lastSeen: Date;

      // Ensure we always append 'Z' if there's no timezone indicator
      // This forces JavaScript to parse it as UTC instead of local time
      const timestamp = lastSeenAt.trim();

      if (timestamp.includes('Z') || timestamp.match(/[+-]\d{2}:\d{2}$/)) {
        // Already has timezone info
        lastSeen = new Date(timestamp);
      } else {
        // No timezone info - add 'Z' to parse as UTC
        lastSeen = new Date(timestamp + 'Z');
      }

      // Validate the date
      if (isNaN(lastSeen.getTime())) {
        console.error('Invalid date after parsing:', lastSeenAt);
        return 'Unknown';
      }

      // Enhanced debugging
      console.log('Parsed date:', lastSeen);
      console.log('Current time UTC:', now.toISOString());
      console.log('Current time Local:', now.toLocaleString());
      console.log('Last seen UTC:', lastSeen.toISOString());
      console.log('Last seen Local:', lastSeen.toLocaleString());
      console.log('Timezone offset (minutes):', now.getTimezoneOffset());

      // Calculate the difference in milliseconds
      const diffMs = now.getTime() - lastSeen.getTime();

      // Handle negative differences (future dates)
      if (diffMs < 0) {
        console.log('Future date detected, showing "Just now"');
        return 'Just now';
      }

      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      console.log('Time difference:', {
        milliseconds: diffMs,
        minutes: diffMins,
        hours: diffHours,
        days: diffDays,
      });

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      // For older dates, show the local date
      return lastSeen.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting last seen:', error, 'Input:', lastSeenAt);
      return 'Unknown';
    }
  };

  // Separate current user from other participants
  const currentUserItem = items.find((item) => item.id === currentUserId);
  const otherItems = items.filter((item) => item.id !== currentUserId);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Other participants */}
      {otherItems.map((item) => (
        <div
          className="-mr-4 relative group"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="absolute -top-20 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md z-50 shadow-xl px-4 py-3"
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: 'nowrap',
                  backgroundColor: '#311249', // toss-purple-main
                  border: '2px solid #822ac6', // toss-purple-border
                }}
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-white to-transparent h-px" />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-white to-transparent h-px" />

                <div
                  className="font-bold text-white relative z-30 text-base uppercase tracking-wide"
                  style={{
                    textShadow: '2px 3px 0px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {item.name}
                </div>
                <div
                  className="text-white text-xs uppercase tracking-wide"
                  style={{
                    textShadow: '1px 2px 0px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {item.designation}
                </div>
                {item.lastSeenAt && (
                  <div
                    className="text-white/80 text-xs mt-1"
                    style={{
                      textShadow: '1px 1px 0px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    Last seen: {formatLastSeen(item.lastSeenAt)}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className={cn(
              'object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-background relative transition duration-500 cursor-pointer',
              !item.isActive && 'opacity-50 grayscale',
            )}
            onClick={() => onItemClick?.(item)}
            ref={(el) => {
              if (itemRefs) {
                if (el) {
                  itemRefs.current.set(item.id, el);
                } else {
                  itemRefs.current.delete(item.id);
                }
              }
            }}
          />
        </div>
      ))}

      {/* Separator if showing current user separately */}
      {showCurrentUserSeparately &&
        currentUserItem &&
        otherItems.length > 0 && <div className="w-px h-12 bg-gray-600 mx-2" />}

      {/* Current user (separated) */}
      {showCurrentUserSeparately && currentUserItem && (
        <div
          className="-mr-4 relative group"
          key={`current-${currentUserItem.name}`}
          onMouseEnter={() => setHoveredIndex(currentUserItem.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === currentUserItem.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="absolute -top-20 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md z-50 shadow-xl px-4 py-3"
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: 'nowrap',
                  backgroundColor: '#311249', // toss-purple-main
                  border: '2px solid #822ac6', // toss-purple-border
                }}
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-white to-transparent h-px" />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-white to-transparent h-px" />

                <div
                  className="font-bold text-white relative z-30 text-base uppercase tracking-wide"
                  style={{
                    textShadow: '2px 3px 0px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {currentUserItem.name} (You)
                </div>
                <div
                  className="text-white text-xs uppercase tracking-wide"
                  style={{
                    textShadow: '1px 2px 0px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {currentUserItem.designation}
                </div>
                {currentUserItem.lastSeenAt && (
                  <div
                    className="text-white/80 text-xs mt-1"
                    style={{
                      textShadow: '1px 1px 0px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    Last seen: {formatLastSeen(currentUserItem.lastSeenAt)}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={currentUserItem.image}
            alt={currentUserItem.name}
            className={cn(
              'object-cover !m-0 !p-0 object-top rounded-full h-16 w-16 border-2 group-hover:scale-105 group-hover:z-30 border-background relative transition duration-500 cursor-pointer',
              'ring-4 ring-white scale-110 shadow-lg',
              !currentUserItem.isActive && 'opacity-50 grayscale',
            )}
            style={{
              boxShadow:
                '0 0 20px rgba(142, 52, 213, 0.8), 0 0 40px rgba(142, 52, 213, 0.4)',
            }}
            onClick={() => onItemClick?.(currentUserItem)}
            ref={(el) => {
              if (itemRefs) {
                if (el) {
                  itemRefs.current.set(currentUserItem.id, el);
                } else {
                  itemRefs.current.delete(currentUserItem.id);
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
