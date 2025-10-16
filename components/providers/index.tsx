'use client';

import { useInit } from '@/lib/hooks/useInit';
import { EventsListenerProvider } from './EventsListenerProvider';
import { MiniAppProvider } from './MiniAppProvider';
import { PrivyProvider } from './PrivyProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { UserProvider } from './UserProvider';
import { WagmiProvider } from './WagmiProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider>
      <ReactQueryProvider>
        <WagmiProvider>
          <MiniAppProvider>
            <UserProvider>
              <EventsListenerProvider>{children}</EventsListenerProvider>
            </UserProvider>
          </MiniAppProvider>
        </WagmiProvider>
      </ReactQueryProvider>
    </PrivyProvider>
  );
}
