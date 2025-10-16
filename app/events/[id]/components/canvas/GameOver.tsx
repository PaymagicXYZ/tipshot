import { Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameOverProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onRetry: () => void;
}

export function GameOver({
  score,
  bestScore,
  isNewBest,
  onRetry,
}: GameOverProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 pointer-events-auto">
      <div className="text-center px-6 max-w-md">
        {isNewBest && (
          <div className="mb-6 animate-bounce">
            <Trophy className="w-20 h-20 mx-auto text-yellow-400" />
          </div>
        )}

        <h2 className="text-white text-5xl mb-2">
          {isNewBest ? '🎉 NEW BEST! 🎉' : 'GAME OVER'}
        </h2>

        <div className="my-8 space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-white/60 text-sm mb-2">FINAL SCORE</div>
            <div className="text-white text-6xl tabular-nums">{score}</div>
          </div>

          {!isNewBest && bestScore > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <div className="text-white/60 text-sm mb-1">BEST SCORE</div>
              <div className="text-white text-3xl tabular-nums">
                {bestScore}
              </div>
            </div>
          )}
        </div>

        <Button
          size="lg"
          className="bg-white text-black hover:bg-white/90 text-xl px-10 py-6 gap-2"
          onClick={onRetry}
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </Button>
      </div>
    </div>
  );
}
