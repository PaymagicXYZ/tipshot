'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameCanvas, type GameCanvasHandle } from './GameCanvas';
import { HUD } from './HUD';
import { PuckSelector } from './PuckSelector';
import { ComboDisplay } from './ComboDisplay';
import { GAME_CONFIG, type PuckType } from '@/lib/constants/gameConfig';
import {
  getBestScore,
  setBestScore,
  getBestCombo,
  setBestCombo,
  getSettings,
  saveSettings,
} from '@/lib/utils/storage';
import { soundManager } from '@/lib/utils/sound';
import { useActiveParticipants } from '@/lib/hooks/react-query/useParticipant';
import { useSupabaseUser } from '@/components/providers/UserProvider';
import { useSendTip } from '@/lib/hooks/react-query/useTip';
import type { Participant } from '../Participants';
import { ParticipantAvatars } from './ParticipantAvatars';
import { formatAmount } from '@/lib/utils';
import { TIP_CONFIG } from '@/lib/constants';
export default function GameField({ eventId }: { eventId: number }) {
  const { supabaseUser } = useSupabaseUser();
  const { data: participants } = useActiveParticipants({
    eventId: eventId,
  });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScoreState] = useState(0);
  const [bestCombo, setBestComboState] = useState(0);
  const [shotsRemaining, setShotsRemaining] = useState(
    GAME_CONFIG.INITIAL_SHOTS,
  );
  const [battery, setBattery] = useState(GAME_CONFIG.INITIAL_BATTERY);
  const [selectedPuck, setSelectedPuck] = useState<PuckType>('coin');
  const [isPowerMode, setIsPowerMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [combo, setCombo] = useState(0);
  const [comboVisible, setComboVisible] = useState(false);
  const sendTip = useSendTip();
  const gameCanvasRef = useRef<GameCanvasHandle>(null);

  // Filter participants by type
  const receivers = participants?.filter((p) => p.type === 'receiver') || [];

  // Load saved data
  useEffect(() => {
    const savedBest = getBestScore();
    setBestScoreState(savedBest);

    const savedBestCombo = getBestCombo();
    setBestComboState(savedBestCombo);

    const settings = getSettings();
    setSoundEnabled(settings.soundEnabled);
    soundManager.setSoundEnabled(settings.soundEnabled);
  }, []);

  // Battery regeneration
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      setBattery((prev: number) =>
        Math.min(
          GAME_CONFIG.INITIAL_BATTERY,
          prev + GAME_CONFIG.BATTERY_DRAIN_RATE,
        ),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isGameOver, isPaused]);

  const handleMiss = useCallback(() => {
    setCombo(0);
    setComboVisible(false);
  }, []);

  const handleShot = useCallback(() => {
    setShotsRemaining((prev) => {
      const newShots = prev - 1;
      if (newShots <= 0) {
        setTimeout(() => {
          // setIsGameOver(true);
          soundManager.playGameOver();
        }, 1000);
        return 0;
      }
      return newShots;
    });
    setIsPowerMode(false);
  }, []);
  //   console.log('senders', senders);
  //   console.log('receivers', receivers);
  //   console.log('participants', participants);
  const handleHit = useCallback(
    (points: number, receiver: Participant) => {
      if (shotsRemaining <= 0) {
        return;
      }

      // Increment combo
      const newCombo = combo + 1;
      setCombo(newCombo);
      setComboVisible(true);

      // Calculate combo multiplier
      const comboMultiplier = Math.min(
        1 + newCombo * GAME_CONFIG.COMBO_BASE_MULTIPLIER,
        GAME_CONFIG.COMBO_MAX_MULTIPLIER,
      );
      const finalScore = Math.round(points * comboMultiplier);

      setScore((prev) => prev + finalScore);

      // Update best combo if needed
      if (newCombo > bestCombo) {
        setBestCombo(newCombo);
        setBestComboState(newCombo);
      }

      // Play appropriate sound based on combo tier
      const tierIndex = GAME_CONFIG.COMBO_TIER_THRESHOLDS.findIndex(
        (threshold) => newCombo === threshold,
      );
      if (tierIndex >= 0) {
        // Milestone reached - play special sound
        soundManager.playPowerUp();
        soundManager.vibrate([50, 100, 50]);
      } else {
        soundManager.playScore();
      }

      if (!supabaseUser) {
        console.error('User not authenticated');
        return;
      }

      // Use wei value directly
      const valueInWei = TIP_CONFIG.AMOUNT_WEI;
      // Format the wei value for display (human readable without $ prefix)
      const formattedValue = formatAmount(
        valueInWei,
        TIP_CONFIG.TOKEN_DECIMALS,
      );

      sendTip.mutate(
        {
          eventId,
          senderId: supabaseUser.id,
          receiverId: receiver.user_id,
          value: valueInWei,
          formattedValue: formattedValue,
          tokenId: TIP_CONFIG.TOKEN_ID,
        },
        {
          onSuccess: () => {
            // console.log('Tip sent successfully');
          },
        },
      );
    },
    [supabaseUser, shotsRemaining, eventId, sendTip, combo, bestCombo],
  );

  const handlePowerShot = useCallback(() => {
    if (battery >= GAME_CONFIG.POWER_SHOT_COST) {
      setIsPowerMode(true);
      soundManager.playPowerUp();
      soundManager.vibrate([20, 50, 20]);
    }
  }, [battery]);

  const handlePowerUsed = useCallback(() => {
    setBattery((prev) => Math.max(0, prev - GAME_CONFIG.POWER_SHOT_COST));
  }, []);

  const handleRetry = useCallback(() => {
    // Save best score if needed
    if (score > bestScore) {
      setBestScore(score);
      setBestScoreState(score);
    }

    // Save best combo if needed
    if (combo > bestCombo) {
      setBestCombo(combo);
      setBestComboState(combo);
    }

    // Reset game state
    setScore(0);
    setShotsRemaining(GAME_CONFIG.INITIAL_SHOTS);
    setBattery(GAME_CONFIG.INITIAL_BATTERY);
    setSelectedPuck('coin');
    setIsPowerMode(false);
    setIsPaused(false);
    // setIsGameOver(false);
    setCombo(0);
    setComboVisible(false);
  }, [score, bestScore, combo, bestCombo]);

  const handleToggleSound = useCallback(() => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    soundManager.setSoundEnabled(newSoundEnabled);

    const settings = getSettings();
    saveSettings({ ...settings, soundEnabled: newSoundEnabled });
  }, [soundEnabled]);

  const handlePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  return (
    <div className="h-screen w-full md:h-full md:flex md:items-center md:justify-center bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Mobile: Fullscreen | Desktop: Centered with max constraints */}
      <div className="w-full h-full md:max-w-[540px] md:max-h-[calc(540px*16/9)] md:aspect-[9/16] flex flex-col shadow-2xl fixed inset-0 md:relative">
        {/* Game Canvas Container */}
        {/* Game Canvas Container */}
        <div className="relative flex-1 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden border-b-2 border-white/5">
          <GameCanvas
            ref={gameCanvasRef}
            selectedPuck={selectedPuck}
            isPowerMode={isPowerMode}
            onShot={handleShot}
            onHit={handleHit}
            onMiss={handleMiss}
            onPowerUsed={handlePowerUsed}
            isPaused={isPaused}
            eventId={eventId}
            receivers={receivers}
            combo={combo}
          />

          <HUD
            score={score}
            bestScore={bestScore}
            shotsRemaining={shotsRemaining}
            battery={battery}
            isPaused={isPaused}
            soundEnabled={soundEnabled}
            combo={combo}
            bestCombo={bestCombo}
            onPause={handlePause}
            onRetry={handleRetry}
            onPowerShot={handlePowerShot}
            onToggleSound={handleToggleSound}
            eventId={eventId}
            onCaptureCanvas={() => gameCanvasRef.current?.captureCanvas()}
          />

          {/* Combo Display */}
          <ComboDisplay combo={combo} isVisible={comboVisible} />

          {/* Participant Avatars - Positioned in canvas area */}
          {!isGameOver && (
            <ParticipantAvatars
              participants={participants?.filter((p) => p.type === 'sender')}
              className="absolute bottom-2 right-2 z-10"
            />
          )}
        </div>

        {/* Bottom Action Bar */}
        {!isGameOver && (
          <div className="relative bg-gradient-to-b from-black/95 to-black backdrop-blur-md border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            {/* Subtle top glow effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="p-3 space-y-2">
              {/* Section Title */}
              <div className="text-white/70 text-[10px] font-semibold tracking-wider text-center uppercase">
                Select Puck
              </div>

              {/* Puck Selector */}
              <div className="flex justify-center">
                <PuckSelector
                  selectedPuck={selectedPuck}
                  onSelectPuck={setSelectedPuck}
                />
              </div>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {/* {isGameOver && (
          <GameOver
            score={score}
            bestScore={bestScore}
            isNewBest={score > bestScore}
            onRetry={handleRetry}
          />
        )} */}
      </div>
    </div>
  );
}
