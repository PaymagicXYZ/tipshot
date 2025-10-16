'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PlayButton() {
  return (
    <Link href="/events" className="w-full max-w-[400px] px-4">
      <Button
        size="lg"
        className="w-full h-16 sm:h-18 md:h-20 text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider"
      >
        Play
      </Button>
    </Link>
  );
}
