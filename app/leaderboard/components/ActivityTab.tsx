'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGlobalTipInsertListener, useRecentTips } from '@/lib/hooks/react-query/useTip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

type RecentTip = {
  id: number;
  created_at: string;
  formatted_value: string;
  sender: { id: number; username: string; pfp_url: string } | null;
  receiver: { id: number; username: string; pfp_url: string } | null;
};

export default function ActivityTab({ initialData, active }: { initialData: RecentTip[]; active: boolean }) {
  const { data, isLoading } = useRecentTips(initialData);
  const [items, setItems] = useState<RecentTip[]>(data ?? []);

  useEffect(() => {
    setItems(data ?? []);
  }, [data]);

  // Keep local state in sync when initial query loads/refetches
  const initial = useMemo(() => data ?? [], [data]);

  const handleInsert = useCallback((activity: {
    tip_id: number;
    created_at: string;
    formatted_value: string;
    sender_id: number;
    sender_username: string;
    sender_pfp_url: string;
    receiver_id: number;
    receiver_username: string;
    receiver_pfp_url: string;
  }) => {
    setItems((prev) => {
      const newItem: RecentTip = {
        id: activity.tip_id,
        created_at: activity.created_at,
        formatted_value: activity.formatted_value,
        sender: {
          id: activity.sender_id,
          username: activity.sender_username,
          pfp_url: activity.sender_pfp_url,
        },
        receiver: {
          id: activity.receiver_id,
          username: activity.receiver_username,
          pfp_url: activity.receiver_pfp_url,
        },
      };
      const exists = prev.some((p) => p.id === newItem.id);
      const next = exists ? prev : [newItem, ...prev];
      return next.slice(0, 20);
    });
  }, []);

  useGlobalTipInsertListener({ enabled: active, onInsert: handleInsert });

  const list = items.length ? items : initial;

  return (
    <div className="mt-2">
      {isLoading && (
        <div className="space-y-3">
          {[0,1,2,3,4,5].map((idx) => (
            <div key={`skeleton-${idx}`} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <div className="text-sm text-muted-foreground">No recent activity</div>
      )}

      <ul className="divide-y divide-border">
        {list.map((t) => (
          <li key={t.id} className="py-3 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={t.sender?.pfp_url || ''} />
              <AvatarFallback>{t.sender?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div className="text-sm text-foreground">
              <span className="font-medium">{t.sender?.username || 'Someone'}</span>
              <span className="text-muted-foreground"> → </span>
              <span className="font-medium">{t.receiver?.username || 'Someone'}</span>
              <span className="text-muted-foreground"> • </span>
              <span className="font-medium">{t.formatted_value}</span>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


