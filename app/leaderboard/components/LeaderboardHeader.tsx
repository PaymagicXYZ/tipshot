import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft } from 'lucide-react';

export function LeaderboardHeader() {
  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/events">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Events
          </Button>
        </Link>
      </div>

      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
        </div>
        <p className="text-gray-400">Top tippers in the last 24 hours</p>
      </div>
    </>
  );
}
