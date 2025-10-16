'use server';

import { tipServices } from '@/lib/services/TipServices';

export const sendTip = async ({
  eventId,
  senderId,
  receiverId,
  value,
  formattedValue,
  tokenId,
}: {
  eventId: number;
  senderId: number;
  receiverId: number;
  value: string;
  formattedValue: string;
  tokenId: number;
}) => {
  return tipServices.sendTip({
    eventId,
    senderId,
    receiverId,
    value,
    formattedValue,
    tokenId,
  });
};

export const getTipsByEvent = async ({ eventId }: { eventId: number }) => {
  return tipServices.getTipsByEvent({ eventId });
};

export const getTipsByReceiver = async ({
  receiverId,
  eventId,
}: {
  receiverId: number;
  eventId?: number;
}) => {
  return tipServices.getTipsByReceiver({ receiverId, eventId });
};

export const getLeaderboard = async ({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
} = {}) => {
  return tipServices.getLeaderboard({ limit, offset });
};

export const getPendingClaims = async ({
  accessToken,
  identityToken,
}: {
  accessToken: string;
  identityToken: string;
}) => {
  return tipServices.getPendingClaims({
    accessToken,
    identityToken,
  });
};

export const getRecentTips = async ({
  limit = 20,
}: { limit?: number } = {}) => {
  return tipServices.getRecentTips({ limit });
};
