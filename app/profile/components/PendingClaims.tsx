'use client';

import { usePendingClaims } from '@/lib/hooks/react-query/useTip';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClaimButton } from './ClaimButton';

export function PendingClaims() {
  const { data: claims, isLoading, error } = usePendingClaims();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <Loader2 className="size-8 animate-spin text-toss-purple-light" />
        <p className="text-sm font-medium text-toss-purple-light">
          Loading your claims...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-sm font-medium text-destructive">
          Failed to load claims
        </p>
      </div>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <Card className="border-2 border-toss-purple-border bg-toss-purple-main/20">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <Coins className="size-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <CardTitle className="text-lg text-toss-purple-light uppercase tracking-wider [text-shadow:2px_3px_0px_rgba(0,0,0,0.6)]">
              No Pending Claims
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Tips you receive will appear here
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Coins className="size-6 text-toss-purple-light" />
        <h2 className="text-2xl font-bold uppercase tracking-wider text-toss-purple-light [text-shadow:2px_3px_0px_rgba(0,0,0,0.6)]">
          Pending Claims
        </h2>
        <Badge variant="secondary" className="ml-auto">
          {claims.length} {claims.length === 1 ? 'Tip' : 'Tips'}
        </Badge>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {claims.map((claim) => (
          <Card
            key={claim.id}
            className={cn(
              'border-2 border-toss-purple-border bg-toss-purple-main/40',
              'transition-all hover:border-toss-purple-light',
            )}
          >
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tip Received
                </p>
                <p className="text-xl font-bold uppercase tracking-wide text-toss-purple-light [text-shadow:1px_2px_0px_rgba(0,0,0,0.6)]">
                  {claim.formatted_value}{' '}
                  {claim.token?.symbol && (
                    <span className="text-sm text-toss-purple-light/70">
                      {claim.token.symbol}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {new Date(claim.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {new Date(claim.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Claim All Button */}
      <ClaimButton />
    </div>
  );
}
