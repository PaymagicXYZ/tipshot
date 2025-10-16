import { useQuery } from '@tanstack/react-query';
import { getActiveParticipants } from '@/lib/actions/participant';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinEvent, leaveEvent } from '@/lib/actions/participant';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { supabaseBrowserClient } from '@/lib/config/supabaseBrowserClient';
import { REALTIME_EVENTS } from '@/lib/constants';
import { useEventsListener } from '@/components/providers/EventsListenerProvider';
import { Nullable } from '@/lib/types';
import { ParticipantToast } from '@/components/ui/toasts';
import { getUserById } from '@/lib/actions/user';

export const participantKeys = {
  all: ['participants'] as const,
  active: (eventId: number) =>
    [...participantKeys.all, 'active', eventId] as const,
};

export const useActiveParticipants = ({ eventId }: { eventId?: number }) => {
  return useQuery({
    queryKey: participantKeys.active(eventId!),
    queryFn: () => getActiveParticipants({ eventId: eventId! }),
    enabled: !!eventId,
    staleTime: 30000, // 30 seconds
  });
};

export const useJoinEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinEvent,
    onSuccess: (data, variables) => {
      // Invalidate participants query for this room
      queryClient.invalidateQueries({
        queryKey: participantKeys.active(variables.eventId),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to join room');
    },
  });
};

export const useLeaveEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveEvent,
    onSuccess: (data, variables) => {
      // Invalidate participants query for this room
      queryClient.invalidateQueries({
        queryKey: participantKeys.active(variables.eventId),
      });

      toast.success('Left room successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to leave room');
    },
  });
};

// Real-time Listener Hook for Participants
export const useParticipantChangeListener = ({
  eventId,
}: {
  eventId: Nullable<number>;
}) => {
  const queryClient = useQueryClient();
  const { emitter } = useEventsListener();

  useEffect(() => {
    if (!eventId) {
      console.log(
        '⏸️  Skipping participant listener subscription - no event ID set',
      );
      return;
    }

    console.log(`🔔 Setting up participant listener for event ${eventId}`);

    const channel = supabaseBrowserClient
      .channel(`participants:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'token_toss_participants',
          filter: `event_id=eq.${eventId}`,
        },
        async (payload) => {
          // Emit event directly to the shared event bus
          emitter.emit(REALTIME_EVENTS.PARTICIPANT_CHANGED, payload.new);

          try {
            // Fetch user data via server action
            const userData = await getUserById({ userId: payload.new.user_id });

            // Format data for toast
            const participantData = {
              username: userData?.username || 'Someone',
              avatar: userData?.pfp_url || '',
              type: payload.new.type as 'sender' | 'receiver',
              action: 'joined' as const,
            };

            // Show toast notification
            toast.custom(() => <ParticipantToast {...participantData} />, {
              duration: 3000,
              position: 'top-center',
            });
          } catch (error) {
            console.error('❌ Failed to fetch user data:', error);
            // Still show toast with fallback
            toast.custom(
              () => (
                <ParticipantToast
                  username="Someone"
                  avatar=""
                  type={payload.new.type}
                  action="joined"
                />
              ),
              {
                duration: 3000,
                position: 'top-center',
              },
            );
          }

          // Invalidate queries to update UI
          await queryClient.invalidateQueries({
            queryKey: participantKeys.active(eventId),
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'token_toss_participants',
          filter: `event_id=eq.${eventId}`,
        },
        async (payload) => {
          // Only proceed if status actually changed (ignore heartbeat updates)
          if (payload.old.status === payload.new.status) {
            console.log('👤 Participant status did not change, skipping event');
            // Heartbeat update or other non-status field change, skip event
            queryClient.invalidateQueries({
              queryKey: participantKeys.active(eventId),
            });
            return;
          }
          // Emit event directly to the shared event bus
          emitter.emit(REALTIME_EVENTS.PARTICIPANT_CHANGED, payload.new);

          try {
            // Fetch user data via server action
            const userData = await getUserById({ userId: payload.new.user_id });

            // Format data for toast
            const participantData = {
              username: userData?.username || 'Someone',
              avatar: userData?.pfp_url || '',
              type: payload.new.type as 'sender' | 'receiver',
              action:
                payload.new.status === 'active'
                  ? ('joined' as const)
                  : ('left' as const),
            };

            // Show toast notification
            toast.custom(() => <ParticipantToast {...participantData} />, {
              duration: 2500,
              position: 'top-center',
            });
          } catch (error) {
            console.error('❌ Failed to fetch user data:', error);
            // Still show toast with fallback
            const action = payload.new.status === 'active' ? 'joined' : 'left';
            toast.custom(
              () => (
                <ParticipantToast
                  username="Someone"
                  avatar=""
                  type={payload.new.type}
                  action={action}
                />
              ),
              {
                duration: 2500,
                position: 'top-center',
              },
            );
          }

          // Invalidate queries to update UI
          queryClient.invalidateQueries({
            queryKey: participantKeys.active(eventId),
          });
        },
      )
      .subscribe((status, err) => {
        console.log(`📡 Subscription status for event ${eventId}:`, status);
        if (err) {
          console.error('❌ Subscription error:', err);
        }
        if (status === 'SUBSCRIBED') {
          console.log(
            `✅ Successfully subscribed to participants for event ${eventId}`,
          );
        }
      });

    return () => {
      console.log(`🔌 Cleaning up participant listener for event ${eventId}`);
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [eventId, emitter, queryClient]);
};
