'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useEventById } from '@/lib/hooks/react-query/useEvent';
import {
  useJoinEvent,
  useLeaveEvent,
} from '@/lib/hooks/react-query/useParticipant';
import { useSupabaseUser } from '@/components/providers/UserProvider';
import { useParticipantHeartbeat } from '@/lib/hooks/useParticipantHeartbeat';
import { useEventsListener } from '@/components/providers/EventsListenerProvider';
// import { useFakeTipReceivedListener } from '@/lib/hooks/react-query/useTip';
// import { useFakeTipReceivedListener } from '@/lib/hooks/react-query/useTip';
// import "./index.css";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const eventId = Number(params.id);
  const { supabaseUser } = useSupabaseUser();
  const { setEventId } = useEventsListener();
  const joinEvent = useJoinEvent();
  const leaveEvent = useLeaveEvent();
  // useFakeTipReceivedListener(eventId);
  const hasJoinedRef = useRef(false);
  const joinedEventIdRef = useRef<number | null>(null);

  const { data: event } = useEventById({
    id: eventId,
  });

  // Set the event ID for real-time listeners
  useEffect(() => {
    setEventId(eventId);

    // Reset event ID to null when leaving the page
    return () => {
      setEventId(null);
    };
  }, [eventId, setEventId]);

  // Join room as sender when user enters, leave when they exit
  useEffect(() => {
    if (!supabaseUser?.id || !event?.id) return;

    const userId = supabaseUser.id;
    const eventId = event.id;

    // Only join if we haven't already joined this event
    if (!hasJoinedRef.current || joinedEventIdRef.current !== eventId) {
      hasJoinedRef.current = true;
      joinedEventIdRef.current = eventId;

      console.log(`🚪 Joining event ${eventId} as user ${userId}`);
      joinEvent.mutate({
        userId,
        eventId,
        type: 'sender',
      });
    }

    // Leave event on unmount
    return () => {
      if (hasJoinedRef.current && joinedEventIdRef.current === eventId) {
        console.log(`🚪 Leaving event ${eventId} as user ${userId}`);
        hasJoinedRef.current = false;
        joinedEventIdRef.current = null;

        leaveEvent.mutate({
          userId,
          eventId,
        });
      }
    };
  }, [supabaseUser?.id, event?.id]);

  // Send periodic heartbeats to maintain presence
  useParticipantHeartbeat({
    userId: supabaseUser?.id,
    eventId: event?.id,
    enabled: hasJoinedRef.current,
  });

  return <>{children}</>;
}
