import { EventList } from './components/EventList';
import { CreateEventDialog } from './components/CreateEventDialog';
import SignInModal from '@/components/onboard/SingInModal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function EventPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-toss-bg-main gap-6">
      {/* Navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/leaderboard">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <SignInModal />
        <CreateEventDialog />
      </div>
      <EventList />
    </div>
  );
}
