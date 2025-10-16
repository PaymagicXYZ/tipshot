'use client';

import { Button } from '@/components/ui/button';
import {
  useClaimTips,
  useRefetchPendingClaims,
} from '@/lib/hooks/react-query/useClaim';
import { usePendingClaims } from '@/lib/hooks/react-query/useTip';
import { useState } from 'react';
import { ClaimDialog } from './ClaimDialog';

export function ClaimButton() {
  const { data: claims } = usePendingClaims();
  const { mutate: claimTips, isPending: isClaiming } = useClaimTips();
  const refetchPendingClaims = useRefetchPendingClaims();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [claimResult, setClaimResult] = useState<{
    count: number;
    bundleId: string;
  } | null>(null);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleClaim = (recipientAddress: `0x${string}`) => {
    if (!claims || claims.length === 0) return;

    // Get event ID from the first claim (all claims should be from the same event)
    const eventId = claims[0]?.event_id;

    if (!eventId) {
      console.error('No event ID found in claims');
      return;
    }

    claimTips(
      { eventId, recipientAddress },
      {
        onSuccess: (data) => {
          // Store the result for the success view
          setClaimResult({
            count: data.claimedCount,
            bundleId: data.bundleId,
          });
        },
      },
    );
  };

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open);
    // When dialog closes, refetch pending claims and reset claim result
    if (!open) {
      setTimeout(() => {
        setClaimResult(null);
        // Refetch pending claims after dialog is closed to update the UI
        refetchPendingClaims();
      }, 300);
    }
  };

  return (
    <>
      <Button
        className="w-full uppercase tracking-wider font-bold"
        size="lg"
        onClick={handleOpenDialog}
        disabled={!claims || claims.length === 0}
      >
        Claim All
      </Button>

      <ClaimDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        onClaim={handleClaim}
        isPending={isClaiming}
        claimResult={claimResult}
      />
    </>
  );
}
