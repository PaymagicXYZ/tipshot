import { useLinkAccount, useLogin, usePrivy } from '@privy-io/react-auth';
import SocialLoginButton from './SocialLoginButton';
import ShimmerSkeleton from '@/components/ui/shimmer-skeleton';
import { useMiniAppContext } from '@/components/providers/MiniAppProvider';

export const SignInWithFarcaster = () => {
  const { authenticated, ready, user } = usePrivy();
  const { login } = useLogin();
  const { loginIntoMiniApp } = useMiniAppContext();
  const { miniAppContext } = useMiniAppContext();
  const { linkFarcaster } = useLinkAccount();

  // Check if user has Farcaster connected
  const hasFarcasterConnected = user?.linkedAccounts?.some(
    (account) => account.type === 'farcaster',
  );

  // Determine button label based on connection status
  const buttonLabel = hasFarcasterConnected
    ? 'Link Farcaster Account'
    : 'Sign In With Farcaster';

  return ready ? (
    <SocialLoginButton
      label={buttonLabel}
      icon="/farcaster-icon.svg"
      callback={() =>
        authenticated
          ? linkFarcaster()
          : miniAppContext
          ? loginIntoMiniApp()
          : login({ loginMethods: ['farcaster'] })
      }
    />
  ) : (
    <ShimmerSkeleton className="w-full h-[42px]" />
  );
};
