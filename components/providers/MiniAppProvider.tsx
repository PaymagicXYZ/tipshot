'use client';

import { MINIAPP_FIDS } from '@/lib/constants';
import { useAsyncEffect } from '@/lib/hooks/useAsyncEffect';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useLoginToMiniApp } from '@privy-io/react-auth/farcaster';
import { Context, sdk } from '@farcaster/miniapp-sdk';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useIsMiniAppOnMobile } from '@/lib/hooks/useIsMiniAppOnMobile';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

type MiniAppClient = 'farcaster' | 'base_app';

const MiniAppContext = createContext<{
  isSDKLoaded: boolean;
  miniAppContext: Context.MiniAppContext | null;
  loginIntoMiniApp: () => Promise<void>;
  miniAppClient: MiniAppClient | null;
}>({
  isSDKLoaded: false,
  miniAppContext: null,
  loginIntoMiniApp: () => Promise.resolve(),
  miniAppClient: null,
});

export const useMiniAppContext = () => {
  const context = useContext(MiniAppContext);
  if (!context) {
    throw new Error('useMiniApp must be used within a MiniAppProvider');
  }
  return context;
};

export const MiniAppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { ready, authenticated, user } = usePrivy();
  const { initLoginToMiniApp, loginToMiniApp } = useLoginToMiniApp();
  const isMiniAppOnMobile = useIsMiniAppOnMobile();
  const { connect } = useConnect();
  const { isConnected } = useAccount();
  const { wallets } = useWallets();
  const [miniAppContext, setMiniAppContext] =
    useState<Context.MiniAppContext | null>(null);
  const [miniAppClient, setMiniAppClient] = useState<MiniAppClient | null>(
    null,
  );

  useAsyncEffect(async () => {
    await sdk.actions.ready();

    const miniAppContext = await sdk.context;

    if (!miniAppContext) {
      return;
    }

    setMiniAppContext(miniAppContext);

    setMiniAppClient(
      miniAppContext.client.clientFid === MINIAPP_FIDS.FARCASTER
        ? 'farcaster'
        : 'base_app',
    );
  }, []);

  const login = async () => {
    if (!ready || authenticated) return;

    const { nonce } = await initLoginToMiniApp();
    const result = await sdk.actions.signIn({
      nonce,
      acceptAuthAddress: true,
    });

    await loginToMiniApp({
      message: result.message,
      signature: result.signature,
    });
  };

  // Add MiniApp
  useEffect(() => {
    if (!miniAppContext || !authenticated) {
      return;
    }

    const addMiniApp = async () => {
      await sdk.actions.addMiniApp();
    };

    if (!miniAppContext?.client.added) {
      setTimeout(() => {
        addMiniApp();
      }, 1000);
    }
  }, [miniAppContext, authenticated, ready, user]);

  // If we are on mobile and have miniApp context, connect to farcaster wallet
  useEffect(() => {
    if (isConnected) {
      return;
    }

    if (miniAppContext && isMiniAppOnMobile) {
      connect({ connector: farcasterMiniApp() });
    }
  }, [miniAppContext, isMiniAppOnMobile, isConnected, wallets]);

  return (
    <MiniAppContext.Provider
      value={{
        isSDKLoaded: Boolean(miniAppClient),
        miniAppContext,
        loginIntoMiniApp: login,
        miniAppClient,
      }}
    >
      {children}
    </MiniAppContext.Provider>
  );
};
