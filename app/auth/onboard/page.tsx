'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { SignInWithFarcaster } from '@/components/onboard/SignInWithFarcaster';
import { SignInWithX } from '@/components/onboard/SignInWithX';
import { TipshotSubtitle } from '@/app/(home)/components/TipshotSubtitle';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { AppLink } from '@/components/AppLink';

type OnboardingStep = 'farcaster' | 'twitter' | 'complete';

export default function OnboardPage() {
  const { authenticated, user } = usePrivy();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('farcaster');

  useEffect(() => {
    if (!authenticated) {
      setCurrentStep('farcaster');
      return;
    }

    // Check if user has Farcaster linked
    const hasFarcaster = user?.linkedAccounts?.some(
      (account) => account.type === 'farcaster',
    );

    // Check if user has X linked
    const hasTwitter = user?.linkedAccounts?.some(
      (account) => account.type === 'twitter_oauth',
    );

    if (!hasFarcaster) {
      setCurrentStep('farcaster');
    } else if (!hasTwitter) {
      setCurrentStep('twitter');
    } else {
      setCurrentStep('complete');
    }
  }, [authenticated, user]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: '#191919' }}
    >
      <div className="flex flex-col items-center gap-8 sm:gap-12 w-full max-w-md">
        {currentStep !== 'complete' && (
          <>
            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider uppercase text-center"
              style={{
                color: '#8e34d5',
                textShadow: '3px 4px 0px rgba(0, 0, 0, 0.6)',
              }}
            >
              Almost There!
            </h1>

            <TipshotSubtitle text="Complete Your Profile To Continue" />

            {/* Progress Steps */}
            <div className="w-full flex items-center justify-center gap-4">
              <StepIndicator
                number={1}
                label="Farcaster"
                active={currentStep === 'farcaster'}
                completed={currentStep === 'twitter'}
              />
              <div
                className="h-0.5 w-12"
                style={{
                  backgroundColor:
                    currentStep === 'twitter' ? '#8e34d5' : '#444',
                }}
              />
              <StepIndicator
                number={2}
                label="X"
                active={currentStep === 'twitter'}
                completed={false}
              />
            </div>
          </>
        )}

        {/* Onboarding Content */}
        <div className="w-full flex flex-col gap-6">
          {currentStep === 'farcaster' && (
            <div className="space-y-4">
              <SignInWithFarcaster />
            </div>
          )}

          {currentStep === 'twitter' && (
            <div className="space-y-4">
              <SignInWithX />
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="space-y-8 text-center w-full">
              <div className="flex justify-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#8e34d5' }}
                >
                  <Check className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider uppercase"
                  style={{
                    color: '#8e34d5',
                    textShadow: '3px 4px 0px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Success!
                </h1>
                <p className="text-lg sm:text-xl" style={{ color: '#8e34d5' }}>
                  You successfully linked your X account
                </p>
              </div>
              <AppLink href="https://farcaster.xyz/miniapps/3FMRmta8BM3P/gigbot">
                <Button
                  size="lg"
                  className="w-full h-16 text-xl font-bold uppercase tracking-wider"
                >
                  Start Playing
                </Button>
              </AppLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
        style={{
          backgroundColor: active || completed ? '#8e34d5' : '#444',
          color: 'white',
          border: active ? '2px solid #fff' : 'none',
        }}
      >
        {completed ? <Check className="w-5 h-5" /> : number}
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: active || completed ? '#8e34d5' : '#888' }}
      >
        {label}
      </span>
    </div>
  );
}
