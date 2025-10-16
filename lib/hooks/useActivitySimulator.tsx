import { useEffect, useRef, useCallback } from 'react';
import { useActiveParticipants } from './react-query/useParticipant';
import { ActivitySimulator } from '@/lib/services/simulation/ActivitySimulator';
import { useEventsListener } from '@/components/providers/EventsListenerProvider';
import { REALTIME_EVENTS } from '@/lib/constants';
import { TipToast, ParticipantToast } from '@/components/ui/toasts';
import { toast } from 'sonner';
import type { Nullable } from '@/lib/types';

/**
 * Hook to manage activity simulation for an event
 * Handles simulator lifecycle, participant updates, and event listeners
 */
export const useActivitySimulator = (eventId: Nullable<number>) => {
  const { emitter } = useEventsListener();
  const simulatorRef = useRef<ActivitySimulator | null>(null);

  // Fetch participants for simulation
  const { data: participants } = useActiveParticipants({
    eventId: eventId ?? undefined,
  });

  // Handler for fake tip events
  const handleFakeTip = useCallback((tipData: any) => {
    // Only handle fake tips (real tips are handled by useTipReceivedListener)
    if (!tipData.isFake) return;

    // console.log('💸 Fake tip event received:', tipData);

    toast.custom(
      () => (
        <TipToast
          senderUsername={tipData.senderUsername}
          senderAvatar={tipData.senderAvatar || ''}
          receiverUsername={tipData.receiverUsername}
          receiverAvatar={tipData.receiverAvatar || ''}
          formattedValue={tipData.formattedValue}
        />
      ),
      {
        duration: 5000,
        position: 'top-center',
      },
    );
  }, []);

  // Handler for fake participant events
  const handleFakeParticipant = useCallback((participantData: any) => {
    // Only handle fake participants
    if (!participantData.isFake) return;

    // console.log('👋 Fake participant event received:', participantData);

    toast.custom(
      () => (
        <ParticipantToast
          username={participantData.user?.username || 'Someone'}
          avatar={participantData.user?.pfp_url || ''}
          action={participantData.status === 'active' ? 'joined' : 'left'}
          type={participantData.type}
        />
      ),
      {
        duration: 3000,
        position: 'bottom-right',
      },
    );
  }, []);

  // Initialize simulator when eventId changes
  useEffect(() => {
    if (!eventId || !emitter) {
      // Clean up existing simulator
      if (simulatorRef.current) {
        // console.log('🧹 Cleaning up simulator');
        simulatorRef.current.stop();
        simulatorRef.current = null;
      }
      return;
    }

    // console.log('🎬 Initializing activity simulator for event:', eventId);

    // Create new simulator
    simulatorRef.current = new ActivitySimulator(emitter, eventId);

    // Set up listeners for fake events
    emitter.on(REALTIME_EVENTS.TIP_RECEIVED, handleFakeTip);
    emitter.on(REALTIME_EVENTS.PARTICIPANT_CHANGED, handleFakeParticipant);

    // Cleanup on unmount or eventId change
    return () => {
      if (simulatorRef.current) {
        console.log('🧹 Stopping simulator for event:', eventId);
        simulatorRef.current.stop();
        simulatorRef.current = null;
      }

      // Remove event listeners
      emitter.off(REALTIME_EVENTS.TIP_RECEIVED, handleFakeTip);
      emitter.off(REALTIME_EVENTS.PARTICIPANT_CHANGED, handleFakeParticipant);
    };
  }, [eventId, emitter, handleFakeTip, handleFakeParticipant]);

  // Update simulator with participants when they change
  useEffect(() => {
    if (simulatorRef.current && participants) {
      // console.log('📊 Updating simulator with participants:', participants.length);
      simulatorRef.current.updateParticipants(participants);
    }
  }, [participants]);

  return simulatorRef.current;
};
