'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type {
  FarcasterWithMetadata,
  TwitterOAuthWithMetadata,
} from '@privy-io/server-auth';
import { SocialIdentifier } from '@/lib/constants';
import { forwardRef } from 'react';
import {
  LinkIcon,
  LogOutIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from 'lucide-react';
import { useMiniAppContext } from '@/components/providers/MiniAppProvider';
import { openUrl } from '@/lib/utils/miniapp';

interface UserAccountMenuProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showUsername?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const FarcasterIcon = () => (
  <svg
    viewBox="0 0 1000 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    aria-label="Farcaster logo"
  >
    <path
      d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z"
      fill="currentColor"
    />
    <path
      d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"
      fill="currentColor"
    />
    <path
      d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.444H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z"
      fill="currentColor"
    />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    aria-label="X logo"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const UserAccountMenu = forwardRef<HTMLDivElement, UserAccountMenuProps>(
  (
    { size = 'md', showBadge = true, showUsername = false, className = '' },
    ref,
  ) => {
    const {
      user,
      authenticated,
      logout,
      linkFarcaster,
      linkTwitter,
      unlinkFarcaster,
      unlinkTwitter,
    } = usePrivy();
    const { miniAppContext } = useMiniAppContext();

    if (!authenticated || !user) {
      return null;
    }

    // Find Farcaster account
    const farcasterAccount = user.linkedAccounts?.find(
      (acc: any) => acc.type === SocialIdentifier.Farcaster,
    ) as FarcasterWithMetadata | undefined;

    // Find Twitter account
    const twitterAccount = user.linkedAccounts?.find(
      (acc: any) => acc.type === SocialIdentifier.TwitterOauth,
    ) as TwitterOAuthWithMetadata | undefined;

    // Determine which account to display (priority: Farcaster > Twitter)
    const accountType = farcasterAccount
      ? 'farcaster'
      : twitterAccount
      ? 'twitter'
      : null;

    const username =
      farcasterAccount?.username || twitterAccount?.username || '';
    const displayName =
      farcasterAccount?.displayName || twitterAccount?.name || username;
    const avatarUrl = farcasterAccount?.pfp
      ? farcasterAccount.pfp
      : twitterAccount?.profilePictureUrl
      ? twitterAccount.profilePictureUrl.replace('normal', '400x400')
      : '';

    // Generate initials for fallback
    const initials = displayName
      ? displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : username.slice(0, 2).toUpperCase();

    const handleLogout = async () => {
      await logout();
    };

    const handleLinkFarcaster = async () => {
      try {
        await linkFarcaster();
      } catch (error) {
        console.error('Failed to link Farcaster:', error);
      }
    };

    const handleLinkTwitter = async () => {
      try {
        // If user is in miniapp, open the onboard page
        if (miniAppContext) {
          const fullUrl = `${window.location.origin}/auth/onboard`;
          await openUrl(fullUrl);
          return;
        }

        // Otherwise use the regular flow
        await linkTwitter();
      } catch (error) {
        console.error('Failed to link Twitter:', error);
      }
    };

    const handleUnlinkFarcaster = async () => {
      try {
        if (farcasterAccount?.fid) {
          await unlinkFarcaster(farcasterAccount.fid);
        }
      } catch (error) {
        console.error('Failed to unlink Farcaster:', error);
      }
    };

    const handleUnlinkTwitter = async () => {
      try {
        await unlinkTwitter(twitterAccount?.subject || '');
      } catch (error) {
        console.error('Failed to unlink Twitter:', error);
      }
    };

    return (
      <div ref={ref} className={`flex items-center gap-3 ${className}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative outline-none focus:ring-2 focus:ring-purple-500 rounded-full cursor-pointer"
            >
              <Avatar className={sizeClasses[size]}>
                <AvatarImage src={avatarUrl} alt={displayName || username} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {showBadge && accountType && (
                <div className="absolute -bottom-1 -right-1">
                  {accountType === 'farcaster' ? (
                    <Badge
                      variant="secondary"
                      className="h-5 w-5 p-0 flex items-center justify-center bg-purple-600 hover:bg-purple-600 border-2 border-background"
                      title="Farcaster"
                    >
                      <svg
                        viewBox="0 0 1000 1000"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        aria-label="Farcaster logo"
                      >
                        <title>Farcaster</title>
                        <path
                          d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z"
                          fill="white"
                        />
                        <path
                          d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"
                          fill="white"
                        />
                        <path
                          d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.444H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z"
                          fill="white"
                        />
                      </svg>
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="h-5 w-5 p-0 flex items-center justify-center bg-black hover:bg-black border-2 border-background"
                      title="X (Twitter)"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2.5 w-2.5"
                        aria-label="X logo"
                      >
                        <title>X (Twitter)</title>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </Badge>
                  )}
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  @{username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Connected Accounts
            </DropdownMenuLabel>
            {farcasterAccount && (
              <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <FarcasterIcon />
                  <span>Farcaster</span>
                  <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                </div>
                <button
                  onClick={handleUnlinkFarcaster}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Unlink Farcaster"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {twitterAccount && (
              <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <XIcon />
                  <span>X (Twitter)</span>
                  <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                </div>
                <button
                  onClick={handleUnlinkTwitter}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Unlink X"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {!farcasterAccount && (
              <DropdownMenuItem
                onClick={handleLinkFarcaster}
                className="cursor-pointer"
              >
                <LinkIcon />
                <FarcasterIcon />
                <span>Link Farcaster</span>
              </DropdownMenuItem>
            )}
            {!twitterAccount && (
              <DropdownMenuItem
                onClick={handleLinkTwitter}
                className="cursor-pointer"
              >
                <LinkIcon />
                <XIcon />
                <span>Link X</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              variant="destructive"
              className="cursor-pointer"
            >
              <LogOutIcon />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {showUsername && (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{displayName}</span>
            <span className="text-xs text-muted-foreground">@{username}</span>
          </div>
        )}
      </div>
    );
  },
);

UserAccountMenu.displayName = 'UserAccountMenu';
