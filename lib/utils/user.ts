import {
  FarcasterWithMetadata,
  TwitterOAuthWithMetadata,
  WalletWithMetadata,
} from '@privy-io/server-auth';
import { SocialIdentifier } from '../constants';
import { TokenTossUser } from '../types';

export function mapPrivyUserToTokenTossUser(
  privyUserData: any,
): Omit<TokenTossUser, 'id' | 'created_at'> | null {
  if (!privyUserData) return null;

  try {
    // Get linked accounts
    const farcasterAccount = privyUserData.linkedAccounts.find(
      (acc: any) => acc.type === SocialIdentifier.Farcaster,
    ) as FarcasterWithMetadata | undefined;

    const twitterAccount = privyUserData.linkedAccounts.find(
      (acc: any) => acc.type === SocialIdentifier.TwitterOauth,
    ) as TwitterOAuthWithMetadata | undefined;

    const linkedWallets = privyUserData?.linkedAccounts?.filter(
      (acc: any) =>
        (acc as { walletClientType?: string; type: string })
          .walletClientType !== 'privy' &&
        (acc as { type: string }).type === 'wallet',
    ) as WalletWithMetadata[];

    // If no social accounts or wallet are linked, return null
    if (!farcasterAccount && !twitterAccount && !linkedWallets.length) {
      return null;
    }

    let username = '';
    let pfpUrl = '';

    // Priority: Farcaster > Twitter > Wallet
    if (farcasterAccount) {
      username = farcasterAccount.username || '';
      pfpUrl = farcasterAccount.pfp || '';
    } else if (twitterAccount) {
      username = twitterAccount.username || '';
      pfpUrl =
        twitterAccount.profilePictureUrl?.replace('normal', '400x400') || '';
    } else if (linkedWallets[0]) {
      username = linkedWallets[0].address || '';
      pfpUrl = '';
    }

    return {
      username,
      pfp_url: pfpUrl,
      privy_user_id: privyUserData.id,
      farcaster_id: farcasterAccount?.fid || null,
      farcaster_username: farcasterAccount?.username || null,
      farcaster_metadata: farcasterAccount
        ? JSON.parse(JSON.stringify(farcasterAccount))
        : null,
      x_id: twitterAccount?.subject || null,
      x_username: twitterAccount?.username || null,
      x_metadata: twitterAccount
        ? JSON.parse(JSON.stringify(twitterAccount))
        : null,
      privy_metadata: JSON.parse(JSON.stringify(privyUserData)),
    };
  } catch (err) {
    console.error('Error mapping Privy user:', err);
    return null;
  }
}
