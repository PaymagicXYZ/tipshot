'use client';

import { createContext, useContext, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useUpsertUser } from '@/lib/hooks/react-query/useUser';
import { mapPrivyUserToTokenTossUser } from '@/lib/utils/user';
import { useAsyncEffect } from '@/lib/hooks/useAsyncEffect';
import { TokenTossUser } from '@/lib/types';

type UserContextType = {
  supabaseUser: TokenTossUser | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useSupabaseUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useSupabaseUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { ready: privyReady, authenticated, user: privyUser } = usePrivy();
  const { mutateAsync: upsertUser } = useUpsertUser();
  const [supabaseUser, setSupabaseUser] = useState<TokenTossUser | null>(null);

  useAsyncEffect(async () => {
    // Only proceed if user is authenticated and available
    if (!privyReady || !authenticated || !privyUser) {
      setSupabaseUser(null);
      return;
    }

    // Map Privy user to our simple format (username, avatarUrl, privyUserId)
    const mappedUser = mapPrivyUserToTokenTossUser(privyUser);

    // If no social accounts, nothing to do
    if (!mappedUser) {
      return;
    }

    try {
      // Upsert user (insert if not exists, update if exists)
      const user = await upsertUser(mappedUser);
      setSupabaseUser(user);
    } catch (err) {
      console.error('❌ Error syncing user:', err);
    }
  }, [privyReady, authenticated, privyUser, upsertUser]);

  return (
    <UserContext.Provider value={{ supabaseUser }}>
      {children}
    </UserContext.Provider>
  );
};
