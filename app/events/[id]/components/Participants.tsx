import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileAvatar } from '@/components/user/ProfileAvatar';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { isParticipantInactive } from '@/lib/utils/participant';

// Types
type ParticipantUser = {
  id: number;
  username: string;
  pfp_url: string;
};

export type Participant = {
  id: number;
  user_id: number;
  type: 'sender' | 'receiver';
  user: ParticipantUser;
  last_seen_at: string | null;
};

// ===== Sub-Components =====

// ===== Main Component =====

type ParticipantsSectionProps = {
  participants: Participant[];
  type: 'sender' | 'receiver';
  isLoading: boolean;
  showCurrentUser?: boolean;
  senderAvatarRef?: React.RefObject<HTMLDivElement | null>;
  onParticipantClick?: (participant: Participant) => void;
  participantRefs?: React.MutableRefObject<Map<number, HTMLDivElement>>;
  currentUserId?: number;
};

export const ParticipantsSection = ({
  participants,
  type,
  isLoading,
  showCurrentUser,
  senderAvatarRef,
  onParticipantClick,
  participantRefs,
  currentUserId,
}: ParticipantsSectionProps) => {
  const isSender = type === 'sender';
  const count =
    isSender && showCurrentUser ? participants.length + 1 : participants.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {isSender ? 'Senders' : 'Receivers'} ({count})
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="size-12 rounded-full" />
            ))}
          </div>
        ) : participants.length === 0 && !showCurrentUser ? (
          <p className="text-sm text-muted-foreground">No {type}s yet</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {/* Show current user first for senders */}
            {showCurrentUser && (
              <ProfileAvatar ref={senderAvatarRef} size="lg" showBadge={true} />
            )}

            {/* Use AnimatedTooltip for participants */}
            {participants.length > 0 && (
              <AnimatedTooltip
                items={participants.map((participant) => ({
                  id: participant.user_id,
                  name: participant.user?.username || 'Unknown',
                  designation: isSender
                    ? isParticipantInactive(participant.last_seen_at)
                      ? 'Inactive'
                      : 'Active'
                    : 'Receiver',
                  image:
                    participant.user?.pfp_url ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
                  lastSeenAt: isSender ? participant.last_seen_at : undefined,
                  isActive: isSender
                    ? !isParticipantInactive(participant.last_seen_at)
                    : true,
                }))}
                className="flex-wrap"
                onItemClick={(item) => {
                  const participant = participants.find(
                    (p) => p.user_id === item.id,
                  );
                  if (participant && onParticipantClick) {
                    onParticipantClick(participant);
                  }
                }}
                itemRefs={participantRefs}
                currentUserId={currentUserId}
                showCurrentUserSeparately={true}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
