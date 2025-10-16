import { useMutation, useQueryClient } from '@tanstack/react-query';
import { claimTips } from '@/lib/actions/claim';
import { toast } from 'sonner';
import {
  usePrivy as usePrivyAuth,
  useIdentityToken,
} from '@privy-io/react-auth';
import { tipKeys } from './useTip';

export const useClaimTips = () => {
  const { getAccessToken } = usePrivyAuth();
  const { identityToken } = useIdentityToken();

  return useMutation({
    mutationFn: async ({
      eventId,
      recipientAddress,
    }: {
      eventId: number;
      recipientAddress: `0x${string}`;
    }) => {
      const accessToken = await getAccessToken();

      if (!accessToken || !identityToken) {
        throw new Error('Authentication tokens not available');
      }

      return claimTips({
        accessToken,
        identityToken,
        eventId,
        recipientAddress,
      });
    },
    onSuccess: async (data) => {
      toast.success(`Successfully claimed ${data?.claimedCount} tips!`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to claim tips');
    },
  });
};

// Helper function to refetch pending claims (to be called after dialog closes)
export const useRefetchPendingClaims = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.refetchQueries({
      queryKey: tipKeys.pendingClaims(),
    });
  };
};
