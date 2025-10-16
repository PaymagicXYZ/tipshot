import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  sendTip,
  getTipsByEvent,
  getLeaderboard,
  getPendingClaims,
} from '@/lib/actions/tip';
import { toast } from 'sonner';
import { supabaseBrowserClient } from '@/lib/config/supabaseBrowserClient';
import { REALTIME_EVENTS } from '@/lib/constants';
import { useEventsListener } from '@/components/providers/EventsListenerProvider';
import type { Nullable } from '@/lib/types';
import { TipToast } from '@/components/ui/toasts';
import { getUserById } from '@/lib/actions/user';
import { usePrivy, useIdentityToken } from '@privy-io/react-auth';

// Query Keys
export const tipKeys = {
  all: ['tips'] as const,
  byEvent: (eventId: number) => [...tipKeys.all, 'event', eventId] as const,
  leaderboard: () => [...tipKeys.all, 'leaderboard'] as const,
  recent: () => [...tipKeys.all, 'recent'] as const,
  pendingClaims: () => [...tipKeys.all, 'pending-claims'] as const,
};

// Queries
export const useTipsByEvent = ({ eventId }: { eventId: number }) => {
  return useQuery({
    queryKey: tipKeys.byEvent(eventId),
    queryFn: () => getTipsByEvent({ eventId }),
    enabled: !!eventId,
  });
};

type LeaderboardUser = {
  user_id: number;
  username: string;
  pfp_url: string;
  tip_count: number;
};

export const useLeaderboard = (initialData?: LeaderboardUser[]) => {
  return useInfiniteQuery({
    queryKey: tipKeys.leaderboard(),
    queryFn: ({ pageParam = 0 }) =>
      getLeaderboard({ limit: 20, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) return undefined;
      return allPages.length * 20;
    },
    initialPageParam: 0,
    initialData: initialData
      ? { pages: [initialData], pageParams: [0] }
      : undefined,
    refetchInterval: 60000,
  });
};

type RecentTip = {
  id: number;
  created_at: string;
  formatted_value: string;
  sender: { id: number; username: string; pfp_url: string } | null;
  receiver: { id: number; username: string; pfp_url: string } | null;
};

export const useRecentTips = (initialData?: RecentTip[]) => {
  return useQuery({
    queryKey: tipKeys.recent(),
    queryFn: async () => {
      const res = await fetch('/api/tips/recent');
      if (!res.ok) throw new Error('Failed to fetch recent tips');
      return (await res.json()) as RecentTip[];
    },
    initialData,
    refetchOnWindowFocus: false,
  });
};

export const usePendingClaims = () => {
  const { getAccessToken, user } = usePrivy();
  const { identityToken } = useIdentityToken();

  return useQuery({
    queryKey: tipKeys.pendingClaims(),
    queryFn: async () => {
      const accessToken = await getAccessToken();

      if (!accessToken || !identityToken) {
        console.log('Authentication tokens not available');
        return [];
      }

      return getPendingClaims({ accessToken, identityToken });
    },
    enabled: !!identityToken && !!user,
    refetchOnWindowFocus: false,
  });
};

// Mutations
export const useSendTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendTip,
    onSuccess: (_data, variables) => {
      // Invalidate tips query for this event
      queryClient.invalidateQueries({
        queryKey: tipKeys.byEvent(variables.eventId),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send tip');
    },
  });
};

// Real-time Listener Hook
export const useTipReceivedListener = ({
  eventId,
}: {
  eventId: Nullable<number>;
}) => {
  const queryClient = useQueryClient();
  const { emitter } = useEventsListener();

  useEffect(() => {
    if (!eventId) {
      console.log('⏸️  Skipping tip listener subscription - no event ID set');
      return;
    }

    console.log(`🔔 Setting up tip listener for event ${eventId}`);

    const channel = supabaseBrowserClient
      .channel(`tips:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'token_toss_tips',
          filter: `event_id=eq.${eventId}`,
        },
        async (payload) => {
          console.log('💰 New tip received:', payload.new);

          // Emit event directly to the shared event bus
          emitter.emit(REALTIME_EVENTS.TIP_RECEIVED, payload.new);

          try {
            // Fetch sender and receiver user data via server actions
            const [senderData, receiverData] = await Promise.all([
              getUserById({ userId: payload.new.sender_id }),
              getUserById({ userId: payload.new.receiver_id }),
            ]);

            // Format data for toast
            const tipData = {
              senderUsername: senderData?.username || 'Someone',
              senderAvatar: senderData?.pfp_url || '',
              receiverUsername: receiverData?.username || 'Someone',
              receiverAvatar: receiverData?.pfp_url || '',
              formattedValue: payload.new.formatted_value,
            };

            // Show cool toast notification
            toast.custom(() => <TipToast {...tipData} />, {
              duration: 5000,
              position: 'top-center',
            });
          } catch (error) {
            console.error('❌ Failed to fetch user data:', error);
            // Still show toast with fallback
            toast.custom(
              () => (
                <TipToast
                  senderUsername="Someone"
                  senderAvatar=""
                  receiverUsername="Someone"
                  receiverAvatar=""
                  formattedValue={payload.new.formatted_value}
                />
              ),
              {
                duration: 5000,
                position: 'top-center',
              },
            );
          }

          // Invalidate queries to update UI
          queryClient.invalidateQueries({
            queryKey: tipKeys.byEvent(eventId),
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
            `✅ Successfully subscribed to tips for event ${eventId}`,
          );
        }
      });

    return () => {
      console.log(`🔌 Cleaning up tip listener for event ${eventId}`);
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [eventId, emitter, queryClient]);
};

type InsertedActivityPayload = {
  tip_id: number;
  created_at: string;
  formatted_value: string;
  sender_id: number;
  sender_username: string;
  sender_pfp_url: string;
  receiver_id: number;
  receiver_username: string;
  receiver_pfp_url: string;
};

export const useGlobalTipInsertListener = ({
  enabled,
  onInsert,
}: {
  enabled: boolean;
  onInsert: (activity: InsertedActivityPayload) => void;
}) => {
  useEffect(() => {
    if (!enabled) return;

    const channel = supabaseBrowserClient
      .channel('activity:global')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'token_toss_activity',
        },
        (payload) => {
          onInsert(payload.new as InsertedActivityPayload);
        },
      )
      .subscribe();

    return () => {
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [enabled, onInsert]);
};
