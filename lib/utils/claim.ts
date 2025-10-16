import { encodeFunctionData, erc20Abi } from 'viem';

type PendingClaim = {
  value: string;
  token?: {
    address: string;
    is_native: boolean;
  } | null;
};

type TransactionCall = {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
};

/**
 * Prepares transaction calls from pending claims
 * Groups claims by token and creates appropriate transfer calls
 */
export function prepareClaimTransactions(
  pendingClaims: PendingClaim[],
  recipientAddress: `0x${string}`,
): TransactionCall[] {
  // Group claims by token and sum amounts
  const groupedClaims = pendingClaims.reduce((acc, claim) => {
    const tokenAddress = claim.token?.address;
    const isNative = claim.token?.is_native;

    if (!tokenAddress) return acc;

    const key = `${tokenAddress}-${isNative}`;
    if (!acc[key]) {
      acc[key] = {
        tokenAddress,
        isNative: isNative || false,
        totalAmount: BigInt(0),
      };
    }

    acc[key].totalAmount += BigInt(claim.value);
    return acc;
  }, {} as Record<string, { tokenAddress: string; isNative: boolean; totalAmount: bigint }>);

  // Prepare transaction calls
  const calls = Object.values(groupedClaims).map((group) => {
    if (group.isNative) {
      // Native token transfer (ETH)
      return {
        to: recipientAddress,
        value: group.totalAmount,
        data: '0x' as `0x${string}`,
      };
    } else {
      // ERC20 token transfer using viem's erc20Abi
      const transferData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress, group.totalAmount],
      });

      return {
        to: group.tokenAddress as `0x${string}`,
        value: BigInt(0),
        data: transferData,
      };
    }
  });

  return calls;
}
