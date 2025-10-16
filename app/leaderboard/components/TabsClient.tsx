'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardClient } from './LeaderboardClient';
import ActivityTab from './ActivityTab';
import { useState } from 'react';

type LeaderboardUser = {
  user_id: number;
  username: string;
  pfp_url: string;
  tip_count: number;
};

type RecentTip = {
  id: number;
  created_at: string;
  formatted_value: string;
  sender: { id: number; username: string; pfp_url: string } | null;
  receiver: { id: number; username: string; pfp_url: string } | null;
};

export default function TabsClient({
  initialLeaderboard,
  initialActivity,
}: {
  initialLeaderboard: LeaderboardUser[];
  initialActivity: RecentTip[];
}) {
  const [value, setValue] = useState<'leaderboard' | 'activity'>('leaderboard');

  return (
    <Tabs value={value} onValueChange={(v: string) => setValue(v as 'leaderboard' | 'activity')} className="mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="leaderboard" className="mt-4">
        <LeaderboardClient initialData={initialLeaderboard} />
      </TabsContent>
      <TabsContent value="activity" className="mt-4">
        <ActivityTab initialData={initialActivity} active={value === 'activity'} />
      </TabsContent>
    </Tabs>
  );
}


