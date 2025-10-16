'use server';

import { claimService } from '../services/ClaimService';

export const claimTips = async ({
  accessToken,
  identityToken,
  eventId,
  recipientAddress,
}: {
  accessToken: string;
  identityToken: string;
  eventId: number;
  recipientAddress: `0x${string}`;
}) => {
  return claimService.claimTips({
    accessToken,
    identityToken,
    eventId,
    recipientAddress,
  });
};
