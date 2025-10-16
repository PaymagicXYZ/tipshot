/**
 * Utility functions for tip and participant notifications
 */

import { Database } from '@/lib/types/supabase';

// Types
type TipRow = Database['public']['Tables']['token_toss_tips']['Row'];
type ParticipantRow =
  Database['public']['Tables']['token_toss_participants']['Row'];

interface ParticipantWithUser {
  user_id: number;
  user?: {
    username: string;
    pfp_url: string;
  };
}

export interface TipNotificationData {
  senderUsername: string;
  senderAvatar: string;
  receiverUsername: string;
  receiverAvatar: string;
  formattedValue: string;
}

export interface ParticipantNotificationData {
  username: string;
  avatar: string;
  type: 'sender' | 'receiver';
  action: 'joined' | 'left';
}

/**
 * Extracts and formats tip notification data from participants and tip payload
 *
 * @param participants - Array of active participants with user data
 * @param tipPayload - The tip transaction payload from Supabase
 * @returns Formatted data ready for toast notification display
 */
export function formatTipNotificationData(
  participants: ParticipantWithUser[] | undefined,
  tipPayload: TipRow,
): TipNotificationData {
  let senderUsername = 'Someone';
  let senderAvatar = '';
  let receiverUsername = 'Someone';
  let receiverAvatar = '';

  if (participants) {
    const sender = participants.find((p) => p.user_id === tipPayload.sender_id);
    const receiver = participants.find(
      (p) => p.user_id === tipPayload.receiver_id,
    );

    if (sender?.user) {
      senderUsername = sender.user.username || 'Someone';
      senderAvatar = sender.user.pfp_url || '';
    }
    if (receiver?.user) {
      receiverUsername = receiver.user.username || 'Someone';
      receiverAvatar = receiver.user.pfp_url || '';
    }
  }

  return {
    senderUsername,
    senderAvatar,
    receiverUsername,
    receiverAvatar,
    formattedValue: tipPayload.formatted_value,
  };
}

/**
 * Determines if a tip amount qualifies as "epic" (for special celebration toasts)
 *
 * @param value - The tip value as a string
 * @param threshold - The minimum value to be considered epic (default: 50)
 * @returns true if the tip is epic-worthy
 */
export function isEpicTip(value: string, threshold: number = 50): boolean {
  const numericValue = parseFloat(value);
  return !isNaN(numericValue) && numericValue >= threshold;
}

/**
 * Extracts and formats participant notification data
 *
 * @param participants - Array of active participants with user data
 * @param participantPayload - The participant payload from Supabase
 * @returns Formatted data ready for toast notification display
 */
export function formatParticipantNotificationData(
  participants: ParticipantWithUser[] | undefined,
  participantPayload: ParticipantRow,
): ParticipantNotificationData {
  let username = 'Someone';
  let avatar = '';

  if (participants) {
    const participant = participants.find(
      (p) => p.user_id === participantPayload.user_id,
    );

    if (participant?.user) {
      username = participant.user.username || 'Someone';
      avatar = participant.user.pfp_url || '';
    }
  }

  // Determine action based on status
  const action: 'joined' | 'left' =
    participantPayload.status === 'active' ? 'joined' : 'left';

  return {
    username,
    avatar,
    type: participantPayload.type,
    action,
  };
}
