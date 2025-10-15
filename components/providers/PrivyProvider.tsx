import { env } from '@/lib/config/env';
import {
  PrivyClientConfig,
  PrivyProvider as _PrivyProvider,
} from '@privy-io/react-auth';

const privyConfig: PrivyClientConfig = {
  appearance: {
    walletChainType: 'ethereum-only',
    theme: 'dark',
    accentColor: '#855dcd',
    landingHeader: 'Gig.bot',
  },
  embeddedWallets: {
    showWalletUIs: false,
  },
  loginMethods: ['farcaster', 'twitter', 'wallet'],
};

export const PrivyProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <_PrivyProvider appId={env.NEXT_PUBLIC_PRIVY_APP_ID} config={privyConfig}>
      {children}
    </_PrivyProvider>
  );
};
