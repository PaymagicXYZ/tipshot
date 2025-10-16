'use client';

import { useEventById } from '@/lib/hooks/react-query/useEvent';
import { useActiveParticipants } from '@/lib/hooks/react-query/useParticipant';
import { useSendTip } from '@/lib/hooks/react-query/useTip';
import { useSupabaseUser } from '@/components/providers/UserProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import {
  ParticipantsSection,
  type Participant,
} from '@/app/events/[id]/components/Participants';
import { useRef, useEffect } from 'react';
import { useTipAnimationQueue } from '@/lib/hooks/useTipAnimationQueue';
import { TipAnimation } from '@/components/animations/TipAnimation';
import { useAnimationType } from '@/lib/hooks/useAnimationType';
import { AnimationTypeSelector } from '@/components/animations/AnimationTypeSelector';
import { useEventsListener } from '@/components/providers/EventsListenerProvider';
import { REALTIME_EVENTS, TIP_CONFIG } from '@/lib/constants';
import { formatAmount } from '@/lib/utils';

// ===== Main Component =====

export const EventDetails = ({ eventId }: { eventId: number }) => {
  const { supabaseUser } = useSupabaseUser();
  const sendTip = useSendTip();
  const senderAvatarRef = useRef<HTMLDivElement | null>(null);
  const receiverRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
  const senderRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
  const { activeAnimations, enqueueAnimation } = useTipAnimationQueue();
  const { animationType, setAnimationType } = useAnimationType();
  const { emitter } = useEventsListener();

  const { data: event, isLoading: eventLoading } = useEventById({
    id: eventId,
  });

  // Register handler for real-time tip events
  useEffect(() => {
    const handleRealtimeTip = (tip: any) => {
      console.log('🎬 Triggering animation for real-time tip:', tip);

      // Get the sender element - check current user first, then sender refs
      let senderEl: HTMLDivElement | null | undefined = null;
      if (tip.sender_id === supabaseUser?.id) {
        senderEl = senderAvatarRef.current;
      } else {
        senderEl = senderRefsMap.current.get(tip.sender_id);
      }

      const receiverEl = receiverRefsMap.current.get(tip.receiver_id);

      if (senderEl && receiverEl) {
        const senderRect = senderEl.getBoundingClientRect();
        const receiverRect = receiverEl.getBoundingClientRect();

        const startPos = {
          x: senderRect.left + senderRect.width / 2,
          y: senderRect.top + senderRect.height / 2,
        };
        const endPos = {
          x: receiverRect.left + receiverRect.width / 2,
          y: receiverRect.top + receiverRect.height / 2,
        };

        // Enqueue the animation
        enqueueAnimation({
          id: `tip-realtime-${tip.id || Date.now()}-${tip.receiver_id}`,
          startPos,
          endPos,
          receiverId: tip.receiver_id,
          config: { type: animationType },
        });
      } else {
        console.warn(
          '⚠️ Could not find sender or receiver element for animation',
          {
            senderId: tip.sender_id,
            receiverId: tip.receiver_id,
            senderEl,
            receiverEl,
            senderRefsMapKeys: Array.from(senderRefsMap.current.keys()),
            receiverRefsMapKeys: Array.from(receiverRefsMap.current.keys()),
          },
        );
      }
    };

    // Register handler using mitt
    emitter.on(REALTIME_EVENTS.TIP_RECEIVED, handleRealtimeTip);

    // Cleanup on unmount
    return () => {
      emitter.off(REALTIME_EVENTS.TIP_RECEIVED, handleRealtimeTip);
    };
  }, [emitter, supabaseUser?.id, animationType, enqueueAnimation]);

  const { data: participants, isLoading: participantsLoading } =
    useActiveParticipants({
      eventId: event?.id,
    });

  if (eventLoading) {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full max-w-4xl">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Event not found</p>
        </div>
      </div>
    );
  }

  // Filter participants by type
  const receivers = participants?.filter((p) => p.type === 'receiver') || [];
  // Filter out current user from senders since we show them separately via ProfileAvatar
  const senders =
    participants?.filter(
      (p) => p.type === 'sender' && p.user_id !== supabaseUser?.id,
    ) || [];

  const handleReceiverClick = (receiver: Participant) => {
    if (!supabaseUser) {
      console.error('User not authenticated');
      return;
    }

    // Use wei value directly
    const valueInWei = TIP_CONFIG.AMOUNT_WEI;
    // Format the wei value for display (human readable without $ prefix)
    const formattedValue = formatAmount(valueInWei, TIP_CONFIG.TOKEN_DECIMALS);

    sendTip.mutate(
      {
        eventId,
        senderId: supabaseUser.id,
        receiverId: receiver.user_id,
        value: valueInWei,
        formattedValue: formattedValue,
        tokenId: TIP_CONFIG.TOKEN_ID,
      },
      {
        onSuccess: () => {
          // Get positions of sender and receiver avatars
          const senderRect = senderAvatarRef.current?.getBoundingClientRect();
          const receiverEl = receiverRefsMap.current.get(receiver.user_id);
          const receiverRect = receiverEl?.getBoundingClientRect();

          if (senderRect && receiverRect) {
            // Calculate center positions of avatars
            const startPos = {
              x: senderRect.left + senderRect.width / 2,
              y: senderRect.top + senderRect.height / 2,
            };
            const endPos = {
              x: receiverRect.left + receiverRect.width / 2,
              y: receiverRect.top + receiverRect.height / 2,
            };
            // Enqueue the animation with selected type
            enqueueAnimation({
              id: `tip-${Date.now()}-${receiver.user_id}`,
              startPos,
              endPos,
              receiverId: receiver.user_id,
              config: { type: animationType },
            });
          }
        },
      },
    );
  };

  return (
    <>
      <div className="fixed inset-0 flex flex-col">
        {/* Top Section - Receivers */}
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link href="/events">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeftIcon className="size-4" />
                  Back
                </Button>
              </Link>
              <AnimationTypeSelector
                value={animationType}
                onChange={setAnimationType}
              />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold">{event.name}</h1>
              <p className="text-xs text-muted-foreground">
                {new Date(event.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <ParticipantsSection
            participants={receivers}
            type="receiver"
            isLoading={participantsLoading}
            onParticipantClick={handleReceiverClick}
            participantRefs={receiverRefsMap}
            currentUserId={supabaseUser?.id}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section - Senders */}
        <div className="p-6 sm:p-8">
          <ParticipantsSection
            participants={senders}
            type="sender"
            isLoading={participantsLoading}
            showCurrentUser={!!supabaseUser}
            senderAvatarRef={senderAvatarRef}
            participantRefs={senderRefsMap}
            currentUserId={supabaseUser?.id}
          />
        </div>
      </div>

      {/* Render all active animations concurrently */}
      {activeAnimations.map((animation) => (
        <TipAnimation
          key={animation.id}
          startPos={animation.startPos}
          endPos={animation.endPos}
          config={animation.config}
          onComplete={() => {
            // Call the original onComplete handler to remove from array
            animation.onComplete();
          }}
        />
      ))}
    </>
  );
};
