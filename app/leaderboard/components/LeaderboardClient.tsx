'use client';

import { useLeaderboard } from '@/lib/hooks/react-query/useTip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useRef } from 'react';
import { Loader2, Trophy } from 'lucide-react';

type LeaderboardUser = {
  user_id: number;
  username: string;
  pfp_url: string;
  tip_count: number;
};

export function LeaderboardClient({
  initialData,
}: {
  initialData: LeaderboardUser[];
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useLeaderboard();

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-300';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Failed to load leaderboard</p>
        <p className="text-gray-400 text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  // Use React Query data if available, fallback to initial data
  const allUsers = data?.pages.flatMap((page) => page) ?? initialData;
  const hasNoData = allUsers.length === 0;

  if (hasNoData) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No tips in the last 24 hours</p>
        <p className="text-gray-500 text-sm mt-2">
          Be the first to send a tip!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {allUsers.map((user, index) => {
          const rank = index + 1;
          const rankBadge = getRankBadge(rank);

          return (
            <div
              key={`${user.user_id}-${index}`}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4 hover:bg-gray-800/70 transition-colors border border-gray-700/50"
            >
              <div
                className={`text-2xl font-bold w-12 text-center ${getRankColor(
                  rank,
                )}`}
              >
                {rankBadge || `#${rank}`}
              </div>

              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={user.pfp_url}
                  alt={user.username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user.username}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-purple-400">
                  {user.tip_count}
                </p>
                <p className="text-xs text-gray-400">
                  {user.tip_count === 1 ? 'tip' : 'tips'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
        </div>
      )}

      <div ref={observerTarget} className="h-4" />

      {!hasNextPage && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            You&apos;ve reached the end of the leaderboard
          </p>
        </div>
      )}
    </>
  );
}
