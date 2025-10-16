'use client';

import { useMiniAppContext } from './providers/MiniAppProvider';
import { openUrl } from '@/lib/utils/miniapp';
import Link from 'next/link';
import { ComponentProps } from 'react';

interface AppLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  href: string;
  children: React.ReactNode;
}

export function AppLink({ href, children, ...props }: AppLinkProps) {
  const { miniAppContext } = useMiniAppContext();

  const handleClick = async (e: React.MouseEvent) => {
    if (miniAppContext) {
      e.preventDefault();
      await openUrl(href);
    }
  };

  // If in miniapp, render a button-like element
  if (miniAppContext) {
    return (
      <div onClick={handleClick} {...(props as any)}>
        {children}
      </div>
    );
  }

  // Otherwise use Next.js Link with target="_blank"
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </Link>
  );
}
