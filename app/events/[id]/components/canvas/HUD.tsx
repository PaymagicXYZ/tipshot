import {
  Volume2,
  VolumeX,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HUDProps {
  score: number;
  bestScore: number;
  shotsRemaining: number;
  battery: number;
  isPaused: boolean;
  soundEnabled: boolean;
  combo: number;
  bestCombo: number;
  onPause: () => void;
  onRetry: () => void;
  onPowerShot: () => void;
  onToggleSound: () => void;
  eventId: number;
  onCaptureCanvas?: () => void;
}

export function HUD({
  score,
  bestScore,
  shotsRemaining,
  battery: _battery,
  isPaused,
  soundEnabled,
  combo,
  bestCombo,
  onPause,
  onRetry: _onRetry,
  onPowerShot: _onPowerShot,
  onToggleSound,
  eventId: _eventId,
  onCaptureCanvas,
}: HUDProps) {

  return (
    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
      
      {/* Top HUD */}
      <div className="flex items-start justify-between p-2">
        {/* Score - Top Left */}
        <div className="pointer-events-auto bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 min-w-[80px]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-white/60 text-[10px]">SCORE</div>
              <div className="text-white text-lg tabular-nums">{score}</div>
              {bestScore > 0 && (
                <div className="text-white/40 text-[10px]">Best: {bestScore}</div>
              )}
            </div>
            {/* Combo badge */}
            {combo > 0 && (
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    px-1.5 py-0.5 rounded-full text-[10px] font-bold
                    ${combo >= 5 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse' : 
                      combo >= 3 ? 'bg-yellow-500/80 text-white' : 
                      'bg-white/20 text-white'}
                  `}
                  style={{
                    boxShadow: combo >= 3 ? '0 0 10px rgba(234, 179, 8, 0.5)' : 'none',
                  }}
                >
                  {combo}x
                </div>
                {bestCombo > 0 && combo < bestCombo && (
                  <div className="text-white/30 text-[8px] mt-0.5">
                    Best: {bestCombo}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Shots - Top Center */}
        <div className="pointer-events-auto bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 min-w-[60px] text-center">
          <div className="text-white/60 text-[10px]">SHOTS</div>
          <div className="text-white text-lg tabular-nums">
            {shotsRemaining}
          </div>
        </div>

        {/* Battery - Top Right */}
        {/* <div className="pointer-events-auto bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[100px]">
          <div className="text-white/60 text-xs">POWER</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${battery}%`,
                  backgroundColor: batteryColor,
                }}
              />
            </div>
            <span className="text-white text-sm tabular-nums">{Math.round(battery)}</span>
          </div>
        </div> */}
      </div>

      {/* Control Buttons - Right Side */}
      <div className="absolute right-2 top-24 flex flex-col gap-2 pointer-events-auto">
        {/* <Button
          size="icon"
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 border-2 border-white/20"
          onClick={onPause}
        >
          <Pause className="w-5 h-5 text-white" />
        </Button>

        <Button
          size="icon"
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 border-2 border-white/20"
          onClick={onRetry}
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </Button>

        <Button
          size="icon"
          className={`w-12 h-12 rounded-full backdrop-blur-sm border-2 transition-all ${
            canUsePower
              ? 'bg-yellow-500/80 hover:bg-yellow-400/90 border-yellow-300/50 shadow-lg shadow-yellow-500/50'
              : 'bg-black/40 border-white/10 opacity-50 cursor-not-allowed'
          }`}
          onClick={onPowerShot}
          disabled={!canUsePower}
        >
          <Zap className={`w-5 h-5 ${canUsePower ? 'text-white' : 'text-white/40'}`} />
        </Button> */}

        <Button
          size="icon"
          className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 border-2 border-white/20"
          onClick={onToggleSound}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <VolumeX className="w-4 h-4 text-white" />
          )}
        </Button>

        {/* Capture/Share Button */}
        {onCaptureCanvas && (
          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 border-2 border-white/20"
            onClick={onCaptureCanvas}
            title="Copy to Clipboard"
          >
            <Camera className="w-4 h-4 text-white" />
          </Button>
        )}
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto">
          <div className="text-center">
            <h2 className="text-white text-4xl mb-8">PAUSED</h2>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 text-xl px-8 py-6"
              onClick={onPause}
            >
              Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
