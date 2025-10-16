import { cn } from '@/lib/utils';
import type React from 'react';

interface ShimmerSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangle' | 'circle';
  width?: string;
  height?: string;
}

export default function ShimmerSkeleton({
  className,
  variant = 'rectangle',
  width,
  height,
  ...props
}: ShimmerSkeletonProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-[#1a1a1c]',
        variant === 'circle' && 'rounded-full aspect-square',
        variant === 'rectangle' && 'rounded-md',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-neutral-700/50 before:to-transparent',
        className,
      )}
      style={{
        width: variant === 'circle' ? width || height : width,
        height: variant === 'circle' ? width || height : height,
      }}
      {...props}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function ShimmerSkeletonText({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <ShimmerSkeleton className="w-full h-4" />
      <ShimmerSkeleton className="w-[80%] h-4" />
      <ShimmerSkeleton className="w-[90%] h-4" />
    </div>
  );
}
