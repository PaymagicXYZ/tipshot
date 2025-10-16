import { useLinkAccount, useLogin, usePrivy } from '@privy-io/react-auth';
import SocialLoginButton from './SocialLoginButton';
import ShimmerSkeleton from '@/components/ui/shimmer-skeleton';
import { useMiniAppContext } from '@/components/providers/MiniAppProvider';
import { openUrl } from '@/lib/utils/miniapp';

export const SignInWithX = () => {
  const { authenticated, ready, user } = usePrivy();
  const { login } = useLogin();
  const { linkTwitter } = useLinkAccount();
  const { miniAppContext } = useMiniAppContext();

  const handleSignIn = async () => {
    // If user is in miniapp, open the onboard page
    if (miniAppContext) {
      const fullUrl = `${window.location.origin}/auth/onboard`;
      await openUrl(fullUrl);
      return;
    }

    // Otherwise use the regular flow
    if (authenticated) {
      linkTwitter();
    } else {
      login({ loginMethods: ['twitter'] });
    }
  };

  // Check if user has X connected
  const hasXConnected = user?.linkedAccounts?.some(
    (account) => account.type === 'twitter_oauth',
  );

  // Determine button label based on connection status
  const buttonLabel = hasXConnected ? 'Link X Account' : 'Sign In With X';

  return ready ? (
    <SocialLoginButton
      label={buttonLabel}
      icon="/twitter-icon.svg"
      callback={handleSignIn}
    />
  ) : (
    <ShimmerSkeleton className="w-full h-[42px]" />
  );
};
