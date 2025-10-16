import { useEffect, useRef } from 'react';
import { updateParticipantHeartbeat } from '@/lib/actions/participant';

const HEARTBEAT_INTERVAL = 10000; // 10 seconds

export const useParticipantHeartbeat = ({
  userId,
  eventId,
  enabled = true,
}: {
  userId?: number;
  eventId?: number;
  enabled?: boolean;
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !userId || !eventId) return;

    console.log(`💓 Starting heartbeat for user ${userId} in room ${eventId}`);

    // Send heartbeat immediately on mount
    updateParticipantHeartbeat({ userId, eventId }).catch((error) => {
      console.error('❌ Failed to send initial heartbeat:', error);
    });

    // Then send periodically
    intervalRef.current = setInterval(() => {
      updateParticipantHeartbeat({ userId, eventId }).catch((error) => {
        console.error('❌ Failed to send heartbeat:', error);
      });
    }, HEARTBEAT_INTERVAL);

    // Attempt to send leave signal on page unload (unreliable but worth trying)
    const handleBeforeUnload = () => {
      // Use sendBeacon for better reliability on page close/refresh
      // This is a best-effort attempt - heartbeat timeout will catch it if this fails
      const data = JSON.stringify({ userId, eventId });
      navigator.sendBeacon('/api/participant/leave', data);
    };

    const handleVisibilityChange = () => {
      // Send heartbeat when tab becomes visible again
      if (document.visibilityState === 'visible') {
        updateParticipantHeartbeat({ userId, eventId }).catch((error) => {
          console.error('❌ Failed to send visibility heartbeat:', error);
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log(
        `💓 Stopping heartbeat for user ${userId} in room ${eventId}`,
      );
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, eventId, enabled]);
};
