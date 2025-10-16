import { Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-toss-bg-main p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
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

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-gray-400">Top tippers in the last 24 hours</p>
        </div>

        {/* Skeleton List */}
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4 border border-gray-700/50"
            >
              <Skeleton className="w-12 h-8 bg-gray-700" />
              <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 bg-gray-700" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-7 w-12 bg-gray-700 ml-auto" />
                <Skeleton className="h-3 w-8 bg-gray-700 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
