'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sparkles, Coins } from 'lucide-react';
import type { AnimationType } from '@/lib/config/tipAnimations';

interface AnimationTypeSelectorProps {
  value: AnimationType;
  onChange: (type: AnimationType) => void;
}

export const AnimationTypeSelector = ({
  value,
  onChange,
}: AnimationTypeSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (type: AnimationType) => {
    onChange(type);
    setOpen(false); // Close popover after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          {value === 'coin' ? (
            <>
              <Coins className="size-4" />
              <span className="text-xs">Coin</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span className="text-xs">Particle</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Tip Animation</h4>
          <p className="text-xs text-muted-foreground">
            Choose your tip animation style
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant={value === 'coin' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => handleSelect('coin')}
            >
              <Coins className="size-4" />
              Coin
            </Button>
            <Button
              variant={value === 'particle' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => handleSelect('particle')}
            >
              <Sparkles className="size-4" />
              Particle
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
