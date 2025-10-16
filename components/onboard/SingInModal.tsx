'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SignInWithFarcaster } from './SignInWithFarcaster';
import { SignInWithX } from './SignInWithX';
import { usePrivy } from '@privy-io/react-auth';
import { UserAccountMenu } from '../user/UserAccountMenu';

export default function SignInModal() {
  const { authenticated } = usePrivy();
  const [open, setOpen] = useState(false);

  if (authenticated) {
    return <UserAccountMenu />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Welcome to Token Toss
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in with your preferred social account to get started
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <SignInWithFarcaster />
          <SignInWithX />
        </div>
      </DialogContent>
    </Dialog>
  );
}
