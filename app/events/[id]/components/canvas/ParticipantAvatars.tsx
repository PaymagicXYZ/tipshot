'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Participant } from '../Participants';
import { useEventsListener } from '@/components/providers/EventsListenerProvider';
import { REALTIME_EVENTS } from '@/lib/constants';
import { useParams } from 'next/navigation';

const MAX_VISIBLE_PARTICIPANTS = 3;

export function ParticipantAvatars({
  participants,
  className,
}: {
  participants?: Participant[];
  className?: string;
}) {
  const params = useParams();
  const eventId = Number(params.id);
  const { emitter } = useEventsListener();
  const [fakeParticipants, setFakeParticipants] = useState<Map<string, any>>(new Map());

  // Listen for fake participant changes
  useEffect(() => {
    if (!eventId || !emitter) return;

    const handleParticipantChange = (data: any) => {
      // Only handle fake participants
      if (!data.isFake) return;

      // console.log('👥 Participant change in ParticipantAvatars:', data);

      setFakeParticipants((prev) => {
        const updated = new Map(prev);
        
        if (data.status === 'active') {
          // Add or update fake participant
          updated.set(data.user_id, {
            user_id: data.user_id,
            type: data.type,
            status: data.status,
            user: data.user,
          });
        } else {
          // Remove fake participant
          updated.delete(data.user_id);
        }

        // console.log('👥 Updated fake participants count:', updated.size);
        return updated;
      });
    };

    emitter.on(REALTIME_EVENTS.PARTICIPANT_CHANGED, handleParticipantChange);

    return () => {
      emitter.off(REALTIME_EVENTS.PARTICIPANT_CHANGED, handleParticipantChange);
    };
  }, [eventId, emitter]);

  // Combine real and fake participants
  const fakeParticipantsArray = Array.from(fakeParticipants.values());
  const allParticipants = [...(participants || []), ...fakeParticipantsArray];
  
  if (allParticipants.length === 0) return null;

  const visibleParticipants = allParticipants.slice(0, MAX_VISIBLE_PARTICIPANTS);
  const remainingCount = allParticipants.length - MAX_VISIBLE_PARTICIPANTS;
  const hasMore = remainingCount > 0;

  return (
    <div className={cn('*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 justify-end items-center', className)}>
      {visibleParticipants.map((participant) => {
        const isFake = participant.user_id?.toString().startsWith('fake_');
        const displayText = isFake ? participant.user?.username : participant.user?.username?.charAt(0).toUpperCase();

        return (
          <Avatar key={participant.user_id}>
            <AvatarImage src={participant.user?.pfp_url} alt={participant.user?.username} />
            <AvatarFallback className={isFake ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 text-white animate-pulse' : 'bg-gray-500 text-white'}>
              {displayText || '?'}
            </AvatarFallback>
          </Avatar>
        );
      })}
      {hasMore && (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border-2 border-background ring-2 ring-background text-white/80 text-xs font-semibold">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
