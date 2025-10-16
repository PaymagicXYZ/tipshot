import { getLeaderboard, getRecentTips } from '@/lib/actions/tip';
import { LeaderboardHeader } from './components/LeaderboardHeader';
import TabsClient from './components/TabsClient';

export default async function LeaderboardPage() {
  // Fetch initial data on the server for leaderboard
  const [initialLeaderboard, initialActivity] = await Promise.all([
    getLeaderboard({ limit: 20, offset: 0 }),
    getRecentTips({ limit: 20 }),
  ]);

  return (
    <div className="min-h-screen bg-toss-bg-main p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <LeaderboardHeader />
        <TabsClient
          initialLeaderboard={initialLeaderboard}
          initialActivity={initialActivity}
        />
      </div>
    </div>
  );
}
