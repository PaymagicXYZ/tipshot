'use client';

import { PendingClaims } from './components/PendingClaims';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-toss-bg-main p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider uppercase text-toss-purple-light [text-shadow:3px_4px_0px_rgba(0,0,0,0.6)]">
            Your Profile
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-bold tracking-[0.15em] uppercase text-toss-purple-light [text-shadow:2px_3px_0px_rgba(0,0,0,0.6)]">
            Manage Your Tips & Claims
          </p>
        </div>

        {/* Pending Claims Section */}
        <div className="w-full">
          <PendingClaims />
        </div>
      </div>
    </div>
  );
}
