'use server';

import { participantServices } from '../services/ParticipantServices';

export const joinEvent = async ({
  userId,
  eventId,
  type,
}: {
  userId: number;
  eventId: number;
  type: 'sender' | 'receiver';
}) => {
  return participantServices.joinEvent({ userId, eventId, type });
};

export const leaveEvent = async ({
  userId,
  eventId,
}: {
  userId: number;
  eventId: number;
}) => {
  return participantServices.leaveEvent({ userId, eventId });
};

export const getActiveParticipants = async ({
  eventId,
}: {
  eventId: number;
}) => {
  return participantServices.getActiveParticipants({ eventId });
};

export const updateParticipantHeartbeat = async ({
  userId,
  eventId,
}: {
  userId: number;
  eventId: number;
}) => {
  return participantServices.updateHeartbeat({ userId, eventId });
};
