import 'server-only';
import { tipServices } from './TipServices';
import { privyWalletServices } from './PrivyWalletServices';
import { eventServices } from './EventServices';
import { prepareClaimTransactions } from '@/lib/utils/claim';

class ClaimService {
  async claimTips({
    accessToken,
    identityToken,
    eventId,
    recipientAddress,
  }: {
    accessToken: string;
    identityToken: string;
    eventId: number;
    recipientAddress: `0x${string}`;
  }) {
    // Get pending claims for the authenticated user
    const pendingClaims = await tipServices.getPendingClaims({
      accessToken,
      identityToken,
    });

    if (!pendingClaims || pendingClaims.length === 0) {
      throw new Error('No pending claims to process');
    }

    // Get event data including wallet information
    const event = await eventServices.getEventById({ id: eventId });

    if (!event.wallet || !event.wallet.privy_id || !event.wallet.address) {
      throw new Error('Event wallet not found or not properly configured');
    }

    // Prepare transaction calls from pending claims
    const calls = prepareClaimTransactions(pendingClaims, recipientAddress);

    // Send batched transactions via Privy
    const result = await privyWalletServices.sendBatchedTransactions({
      privyWalletId: event.wallet.privy_id,
      address: event.wallet.address as `0x${string}`,
      calls,
    });

    // Update all claimed tips with bundle_id and status
    const tipIds = pendingClaims.map((claim) => claim.id);
    await tipServices.updateTipsWithBundleId({
      tipIds,
      bundleId: result.bundleId,
      status: 'success',
    });

    return {
      success: true,
      claimedCount: pendingClaims.length,
      bundleId: result.bundleId,
    };
  }
}

export const claimService = new ClaimService();
