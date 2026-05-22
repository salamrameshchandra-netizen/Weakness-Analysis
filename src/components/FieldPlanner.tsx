import React from 'react';
import { BattingHand } from '../types';

interface Fielder {
  name: string;
  x: number; // 0 to 200 coordinate space
  y: number; // 0 to 200 coordinate space
}

export const STRATEGIST_PRESETS: Record<string, { label: string; description: string; fielders: (hand: BattingHand) => Fielder[] }> = {
  'slip-cordon': {
    label: 'Slips Overload Trap',
    description: 'Expedites edges in the corridor of uncertainty. Fits wide bowlers and swing specialists.',
    fielders: (hand) => {
      const isRH = hand === 'Right-Hand';
      // If RH, Off-side is to the Left (x < 100). Leg is Right (x > 100).
      // Slips go to the Off-side behind the wickets (y around 115-130).
      const f1 = isRH ? { name: '1st Slip', x: 92, y: 116 } : { name: '1st Slip', x: 108, y: 116 };
      const f2 = isRH ? { name: '2nd Slip', x: 86, y: 118 } : { name: '2nd Slip', x: 114, y: 118 };
      const f3 = isRH ? { name: '3rd Slip', x: 80, y: 122 } : { name: '3rd Slip', x: 120, y: 122 };
      const gully = isRH ? { name: 'Gully', x: 70, y: 124 } : { name: 'Gully', x: 130, y: 124 };
      const point = isRH ? { name: 'Backward Point', x: 50, y: 104 } : { name: 'Backward Point', x: 150, y: 104 };
      const cover = isRH ? { name: 'Extra Cover', x: 60, y: 70 } : { name: 'Extra Cover', x: 140, y: 70 };
      const midOff = isRH ? { name: 'Mid-Off', x: 85, y: 60 } : { name: 'Mid-Off', x: 115, y: 60 };
      const fineLeg = isRH ? { name: 'Fine Leg', x: 150, y: 160 } : { name: 'Fine Leg', x: 50, y: 160 };
      const midOn = isRH ? { name: 'Mid-On', x: 120, y: 65 } : { name: 'Mid-On', x: 80, y: 65 };
      
      return [f1, f2, f3, gully, point, cover, midOff, fineLeg, midOn];
    }
  },
  'shortline-choke': {
    label: 'Short-Ball Boundary Choke',
    description: 'Chokes the pull and hook shots. Deep fielders placed near the leg-side fence.',
    fielders: (hand) => {
      const isRH = hand === 'Right-Hand';
      // Leg side is Right (x > 110) for RH, Left (x < 90) for LH.
      const f1 = isRH ? { name: 'Deep Fine Leg', x: 165, y: 155 } : { name: 'Deep Fine Leg', x: 35, y: 155 };
      const f2 = isRH ? { name: 'Deep Square Leg', x: 180, y: 105 } : { name: 'Deep Square Leg', x: 20, y: 105 };
      const f3 = isRH ? { name: 'Deep Midwic', x: 155, y: 65 } : { name: 'Deep Midwic', x: 45, y: 65 };
      const shortLeg = isRH ? { name: 'Short Leg', x: 112, y: 92 } : { name: 'Short Leg', x: 88, y: 92 };
      const f4 = isRH ? { name: 'Backward Square', x: 135, y: 115 } : { name: 'Backward Square', x: 65, y: 115 };
      const midWicket = isRH ? { name: 'Mid-Wicket', x: 130, y: 80 } : { name: 'Mid-Wicket', x: 70, y: 80 };
      const longOn = isRH ? { name: 'Long-On', x: 125, y: 35 } : { name: 'Long-On', x: 75, y: 35 };
      const cover = isRH ? { name: 'Deep Cover', x: 35, y: 65 } : { name: 'Deep Cover', x: 165, y: 65 };
      const point = isRH ? { name: 'Point', x: 55, y: 95 } : { name: 'Point', x: 145, y: 95 };

      return [f1, f2, f3, shortLeg, f4, midWicket, longOn, cover, point];
    }
  },
  'spin-ring': {
    label: 'Spin Ring of Fire',
    description: 'Crowds the bat to amplify pressure on turning pitches. Blocks the single.',
    fielders: (hand) => {
      const isRH = hand === 'Right-Hand';
      // Silly point is off-side close (x < 100, y close)
      const slip = isRH ? { name: 'Backward Slip', x: 88, y: 114 } : { name: 'Backward Slip', x: 112, y: 114 };
      const sillyPoint = isRH ? { name: 'Silly Point', x: 84, y: 92 } : { name: 'Silly Point', x: 116, y: 92 };
      const shortLeg = isRH ? { name: 'Short Leg', x: 112, y: 94 } : { name: 'Short Leg', x: 88, y: 94 };
      const fCover = isRH ? { name: 'Silly Mid-Off', x: 88, y: 82 } : { name: 'Silly Mid-Off', x: 112, y: 82 };
      const cover = isRH ? { name: 'Cover Point', x: 60, y: 85 } : { name: 'Cover Point', x: 140, y: 85 };
      const midWicket = isRH ? { name: 'Mid-Wicket-Ring', x: 125, y: 85 } : { name: 'Mid-Wicket-Ring', x: 75, y: 85 };
      const deepMidWicket = isRH ? { name: 'Deep Midwic', x: 160, y: 55 } : { name: 'Deep Midwic', x: 40, y: 55 };
      const longOn = isRH ? { name: 'Long-On', x: 120, y: 32 } : { name: 'Long-On', x: 80, y: 32 };
      const longOff = isRH ? { name: 'Long-Off', x: 75, y: 30 } : { name: 'Long-Off', x: 125, y: 30 };

      return [slip, sillyPoint, shortLeg, fCover, cover, midWicket, deepMidWicket, longOn, longOff];
    }
  },
  'balanced-default': {
    label: 'Standard Defensive ring',
    description: 'Maintains a balanced field to contain run leakages for reliable spinners/pacers.',
    fielders: (hand) => {
      const isRH = hand === 'Right-Hand';
      const point = isRH ? { name: 'Point', x: 50, y: 98 } : { name: 'Point', x: 150, y: 98 };
      const cover = isRH ? { name: 'Cover', x: 55, y: 75 } : { name: 'Cover', x: 145, y: 75 };
      const midOff = isRH ? { name: 'Mid-Off', x: 82, y: 55 } : { name: 'Mid-Off', x: 118, y: 55 };
      const midOn = isRH ? { name: 'Mid-On', x: 118, y: 56 } : { name: 'Mid-On', x: 82, y: 56 };
      const midWicket = isRH ? { name: 'Mid-Wicket', x: 135, y: 78 } : { name: 'Mid-Wicket', x: 65, y: 78 };
      const squareLeg = isRH ? { name: 'Square Leg', x: 145, y: 100 } : { name: 'Square Leg', x: 55, y: 100 };
      const fineLeg = isRH ? { name: 'Short Fine', x: 135, y: 135 } : { name: 'Short Fine', x: 65, y: 135 };
      const deepCover = isRH ? { name: 'Deep Cover', x: 30, y: 50 } : { name: 'Deep Cover', x: 170, y: 50 };
      const longOn = isRH ? { name: 'Long-On', x: 135, y: 28 } : { name: 'Long-On', x: 65, y: 28 };

      return [point, cover, midOff, midOn, midWicket, squareLeg, fineLeg, deepCover, longOn];
    }
  }
};

interface FieldPlannerProps {
  presetKey: string;
  onSelectPreset?: (key: string) => void;
  battingHand: BattingHand;
  readOnly?: boolean;
}

export const FieldPlanner: React.FC<FieldPlannerProps> = ({
  presetKey,
  onSelectPreset,
  battingHand,
  readOnly = false
}) => {
  const currentPreset = STRATEGIST_PRESETS[presetKey] || STRATEGIST_PRESETS['balanced-default'];
  const fielders = currentPreset.fielders(battingHand);

  return (
    <div className="flex flex-col items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner w-full">
      <div className="mb-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Visual Field Placement Radar
        </span>
        <p className="text-sm font-medium text-slate-200">
          {currentPreset.label}
        </p>
      </div>

      {/* Preset Buttons for Interaction (if not readOnly) */}
      {!readOnly && onSelectPreset && (
        <div className="flex flex-wrap gap-1.5 justify-center mb-3 w-full">
          {Object.entries(STRATEGIST_PRESETS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelectPreset(key)}
              className={`text-[9px] px-2 py-1 rounded transition-all font-semibold uppercase border
                ${presetKey === key
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
            >
              {value.label.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Field Vector Graph */}
      <div className="relative w-full max-w-[280px] aspect-[1/1] bg-slate-950 rounded-lg overflow-hidden border border-slate-700 p-2">
        <svg viewBox="0 0 200 200" className="w-full h-full select-none">
          {/* Grass Field Outer Circle (Boundary Rope) */}
          <circle cx="100" cy="100" r="92" fill="#045d31" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="2, 2" />
          
          {/* Inner 30-yard Ring */}
          <circle cx="100" cy="100" r="48" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3, 3" opacity="0.6" />
          
          {/* Pitch Area (Center) */}
          <rect x="94" y="86" width="12" height="28" fill="#bc997d" rx="1" />
          <line x1="94" y1="91" x2="106" y2="91" stroke="#ffffff" strokeWidth="0.5" opacity="0.7" />
          <line x1="94" y1="109" x2="106" y2="109" stroke="#ffffff" strokeWidth="0.5" opacity="0.7" />
          
          {/* Wickets (Top / Striker, Bottom / Non-Striker) */}
          {/* Batting Crease is at y = 91 (top) & y = 109 (bottom) for RHB (striker stands at top facing downwards) */}
          <line x1="98" y1="89" x2="102" y2="89" stroke="#fb923c" strokeWidth="1" strokeLinecap="round" />
          <line x1="98" y1="111" x2="102" y2="111" stroke="#fb923c" strokeWidth="1" strokeLinecap="round" />
          
          {/* Legend Text: Off side / Leg side */}
          {/* RHB stance: Striker at top (facing down). Bowler runs in from bottom (y=200) to top.
              RHB looks "forward" (to y=200). Off side is right-hander's off side (Left of screen, x < 100), Leg side is Right (x > 100)
              LHB stance: Off side is Left (x > 100), Leg side (x < 100) */}
          <text x="35" y="20" fill="#ffffff" fontSize="6.5" opacity="0.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">
            {battingHand === 'Right-Hand' ? 'OFF SIDE' : 'LEG SIDE'}
          </text>
          <text x="165" y="20" fill="#ffffff" fontSize="6.5" opacity="0.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">
            {battingHand === 'Right-Hand' ? 'LEG SIDE' : 'OFF SIDE'}
          </text>

          {/* Direction of bowler run-up */}
          <text x="100" y="194" fill="#67e8f9" fontSize="5.5" opacity="0.8" fontWeight="bold" textAnchor="middle" letterSpacing="0.08em">
            BOWLER RUN-IN ▲
          </text>

          {/* Wicket Keeper Dot (Default behind wickets, y > 111) */}
          <circle cx="100" cy="122" r="3.5" fill="#f87171" stroke="#ffffff" strokeWidth="0.5" />
          <text x="100" y="129" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">WK</text>

          {/* Bowler Dot (At bottom of pitch delivering) */}
          <circle cx="100" cy="115" r="3" fill="#a5f3fc" stroke="#0891b2" strokeWidth="0.5" />
          <text x="100" y="111" fill="#a5f3fc" fontSize="4.5" textAnchor="middle">Pacer/Spin</text>

          {/* Batsman active sticker dot at striking end */}
          <rect x="98.5" y="87" width="3" height="3" fill="#ffffff" rx="0.5" />
          <text x="100" y="82" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">BAT</text>

          {/* Fielder dots plotted from preset dynamically */}
          {fielders.map((fielder, index) => (
            <g key={index} className="transition-all duration-500 ease-out">
              <circle
                cx={fielder.x}
                cy={fielder.y}
                r="3.5"
                fill="#ffdd00"
                stroke="#1e293b"
                strokeWidth="0.75"
                className="animate-pulse"
              />
              <text
                x={fielder.x}
                y={fielder.y - 5.5}
                fill="#ffffff"
                fontSize="4.5"
                fontWeight="semibold"
                textAnchor="middle"
                className="bg-slate-950 font-sans tracking-tight"
                style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.9))' }}
              >
                {fielder.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 text-slate-400 text-[10px] text-center italic max-w-[240px] leading-relaxed">
        {currentPreset.description}
      </div>
    </div>
  );
};
