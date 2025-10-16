'use client';

import { useState, useMemo } from 'react';
import { isAddress } from 'viem';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

type ClaimDialogView = 'enter-address' | 'success';

interface ClaimDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaim: (recipientAddress: `0x${string}`) => void;
  isPending: boolean;
  claimResult?: {
    count: number;
    bundleId: string;
  } | null;
}

export function ClaimDialog({
  open,
  onOpenChange,
  onClaim,
  isPending,
  claimResult,
}: ClaimDialogProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [view, setView] = useState<ClaimDialogView>('enter-address');

  // Check if the address is valid
  const isValidAddress = useMemo(() => {
    if (!recipientAddress) return false;
    return isAddress(recipientAddress);
  }, [recipientAddress]);

  // Show error only if user has typed something
  const showAddressError = recipientAddress.length > 0 && !isValidAddress;

  const handleClaim = () => {
    if (!isValidAddress) return;
    onClaim(recipientAddress as `0x${string}`);
  };

  const handleClose = () => {
    setView('enter-address');
    setRecipientAddress('');
    onOpenChange(false);
  };

  // Switch to success view when claim result is available
  useMemo(() => {
    if (claimResult) {
      setView('success');
    } else if (!claimResult && open) {
      setView('enter-address');
    }
  }, [claimResult, open]);

  const handleDialogOpenChange = (open: boolean) => {
    // Only allow closing from success view or when not claiming
    if (!open && (view === 'success' || !isPending)) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md">
        {view === 'enter-address' ? (
          <EnterAddressView
            recipientAddress={recipientAddress}
            setRecipientAddress={setRecipientAddress}
            isValidAddress={isValidAddress}
            showAddressError={showAddressError}
            isPending={isPending}
            onClaim={handleClaim}
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <SuccessView claimResult={claimResult} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Enter Address View Component
interface EnterAddressViewProps {
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  isValidAddress: boolean;
  showAddressError: boolean;
  isPending: boolean;
  onClaim: () => void;
  onClose: () => void;
}

function EnterAddressView({
  recipientAddress,
  setRecipientAddress,
  isValidAddress,
  showAddressError,
  isPending,
  onClaim,
  onClose,
}: EnterAddressViewProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold uppercase tracking-wider">
          Claim Tips
        </DialogTitle>
        <DialogDescription>
          Enter the wallet address where you want to receive your tips.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="recipient" className="text-sm font-medium">
            Recipient Address
          </Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className={`font-mono ${
              showAddressError ? 'border-destructive' : ''
            }`}
          />
        </div>

        {showAddressError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please enter a valid EVM address
            </AlertDescription>
          </Alert>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={onClaim} disabled={isPending || !isValidAddress}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Claiming...
            </>
          ) : (
            'Confirm Claim'
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

// Success View Component
interface SuccessViewProps {
  claimResult?: {
    count: number;
    bundleId: string;
  } | null;
  onClose: () => void;
}

function SuccessView({ claimResult, onClose }: SuccessViewProps) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <DialogTitle className="text-2xl font-bold uppercase tracking-wider text-center">
          Claim Successful!
        </DialogTitle>
        <DialogDescription className="text-center">
          Your tips have been successfully claimed and sent to your wallet.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Tips Claimed
            </span>
            <span className="text-lg font-bold">{claimResult?.count || 0}</span>
          </div>
          {claimResult?.bundleId && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Transaction
              </span>
              <a
                href={`https://basescan.org/tx/${claimResult.bundleId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View on BaseScan
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button
          onClick={onClose}
          className="w-full uppercase tracking-wider font-bold"
        >
          Done
        </Button>
      </DialogFooter>
    </>
  );
}
