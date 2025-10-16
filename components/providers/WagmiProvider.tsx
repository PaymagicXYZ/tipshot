import { http } from 'wagmi';
import { createConfig, WagmiProvider as _WagmiProvider } from '@privy-io/wagmi';
import { base } from 'wagmi/chains';
import farcasterFrame from '@farcaster/miniapp-wagmi-connector';

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [farcasterFrame()],
});

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <_WagmiProvider config={wagmiConfig}>{children}</_WagmiProvider>;
};
