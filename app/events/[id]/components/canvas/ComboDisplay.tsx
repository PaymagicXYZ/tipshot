'use client';
import { useEffect, useState } from 'react';
import { GAME_CONFIG } from '@/lib/constants/gameConfig';

interface ComboDisplayProps {
  combo: number;
  isVisible: boolean;
}

export function ComboDisplay({ combo, isVisible }: ComboDisplayProps) {
  const [showBreak, setShowBreak] = useState(false);
  const [prevCombo, setPrevCombo] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);

  // Detect combo break
  useEffect(() => {
    if (prevCombo > 2 && combo === 0) {
      setShowBreak(true);
      const timer = setTimeout(() => setShowBreak(false), 1500);
      return () => clearTimeout(timer);
    }
    setPrevCombo(combo);
  }, [combo, prevCombo]);

  // Auto-hide combo display after 2 seconds
  useEffect(() => {
    if (combo >= 2 && isVisible) {
      setShouldShow(true);
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (combo < 2) {
      setShouldShow(false);
    }
  }, [combo, isVisible]);

  // Don't show for combo < 2 and not breaking
  if (combo < 2 && !showBreak) return null;
  
  // Don't show if auto-hide timer expired (unless at milestone)
  const isAtMilestone = GAME_CONFIG.COMBO_TIER_THRESHOLDS.includes(combo);
  if (!shouldShow && !showBreak && !isAtMilestone) return null;

  // Calculate current tier
  const getTier = (comboCount: number): number => {
    const thresholds = GAME_CONFIG.COMBO_TIER_THRESHOLDS;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (comboCount >= thresholds[i]) return i;
    }
    return -1;
  };

  const tier = getTier(combo);
  const tierColor = tier >= 0 ? GAME_CONFIG.COMBO_PARTICLE_COLORS[tier] : '#FFFFFF';
  const tierLabel = tier >= 0 ? GAME_CONFIG.COMBO_TIER_LABELS[tier] : '';
  const multiplier = Math.min(
    1 + combo * GAME_CONFIG.COMBO_BASE_MULTIPLIER,
    GAME_CONFIG.COMBO_MAX_MULTIPLIER
  );

  // Show combo break animation
  if (showBreak) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
        <div className="animate-[fadeOut_1.5s_ease-out] text-red-500 text-3xl font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
          COMBO BROKEN!
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
      <div
        className={`flex flex-col items-center gap-1 transition-opacity duration-500 ${
          shouldShow || isAtMilestone ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          animation: isVisible ? 'comboScale 0.3s ease-out' : 'none',
        }}
      >
        {/* Combo count and multiplier */}
        <div
          className="text-4xl font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
          style={{
            color: tierColor,
            textShadow: `0 0 20px ${tierColor}, 0 0 30px ${tierColor}`,
          }}
        >
          {combo}x
        </div>

        {/* Tier label */}
        {tierLabel && (
          <div
            className="text-xl font-bold animate-[slideUp_0.3s_ease-out]"
            style={{
              color: tierColor,
              textShadow: `0 0 10px ${tierColor}`,
            }}
          >
            {tierLabel}
          </div>
        )}

        {/* Multiplier badge */}
        <div
          className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border-2"
          style={{
            borderColor: tierColor,
            boxShadow: `0 0 15px ${tierColor}`,
          }}
        >
          <div className="text-white text-xs font-bold">
            {multiplier.toFixed(1)}x Score
          </div>
        </div>
      </div>

      {/* Milestone celebration */}
      {GAME_CONFIG.COMBO_TIER_THRESHOLDS.includes(combo) && shouldShow && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute w-64 h-64 rounded-full opacity-20 animate-[ping_1s_ease-out]"
            style={{ backgroundColor: tierColor }}
          />
        </div>
      )}
    </div>
  );
}

