import { TipshotTitle } from './components/TipshotTitle';
import { PlayButton } from './components/PlayButton';
import { TipshotSubtitle } from './components/TipshotSubtitle';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: '#191919' }}
    >
      <div className="flex flex-col items-center gap-8 sm:gap-12 md:gap-16 w-full">
        {/* Title Section */}
        <TipshotTitle />

        <TipshotSubtitle />
        {/* Play Button */}
        <PlayButton />

        {/* Leaderboard Link */}
        <Link
          href="/leaderboard"
          className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors group"
        >
          <Trophy className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium">View Leaderboard</span>
        </Link>
      </div>
    </div>
  );
}
