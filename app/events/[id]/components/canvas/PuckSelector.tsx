import { PuckType, PUCK_TYPES } from '@/lib/constants/gameConfig';

interface PuckSelectorProps {
  selectedPuck: PuckType;
  onSelectPuck: (puck: PuckType) => void;
}

export function PuckSelector({
  selectedPuck,
  onSelectPuck,
}: PuckSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center">
        {(Object.keys(PUCK_TYPES) as PuckType[]).map((puckType) => {
          const puck = PUCK_TYPES[puckType];
          const isSelected = selectedPuck === puckType;

          return (
            <button
              type="button"
              key={puckType}
              onClick={() => onSelectPuck(puckType)}
              className={`
            relative w-10 h-10 rounded-full transition-all
            ${
              isSelected
                ? 'ring-3 ring-white ring-offset-2 ring-offset-black/20 scale-110'
                : 'hover:scale-105 opacity-70 hover:opacity-100'
            }
              `}
              style={{ backgroundColor: puck.color }}
            >
              <span className="text-2xl">{puck.emoji}</span>
              {isSelected && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  ×{puck.scoreMultiplier}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
