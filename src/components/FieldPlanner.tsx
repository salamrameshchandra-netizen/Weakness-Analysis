import React, { useState, useEffect, useRef } from 'react';
import { BattingHand, Fielder } from '../types';

export const STRATEGIST_PRESETS: Record<string, { label: string; description: string; fielders: (hand: BattingHand) => Fielder[] }> = {
  'slip-cordon': {
    label: 'Slips Overload Trap',
    description: 'Expedites edges in the corridor of uncertainty. Fits wide bowlers and swing specialists.',
    fielders: (hand) => {
      const isRH = hand === 'Right-Hand';
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
  },
  'custom': {
    label: 'Custom Field Placement',
    description: 'Manual positioning mode enabled. Choose a fielder and click anywhere inside the radar circle to reposition them.',
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

const COMMON_FIELD_POSITIONS = [
  '1st Slip', '2nd Slip', '3rd Slip', 'Gully', 'Point', 'Backward Point',
  'Cover', 'Extra Cover', 'Cover Point', 'Mid-Off', 'Mid-On', 'Mid-Wicket',
  'Square Leg', 'Backward Square Leg', 'Short Leg', 'Silly Point', 'Silly Mid-Off',
  'Silly Mid-On', 'Mid-Wicket-Ring', 'Short Fine', 'Fine Leg', 'Deep Cover', 'Deep Point',
  'Long-Off', 'Long-On', 'Deep Mid-Wicket', 'Deep Square Leg', 'Deep Fine Leg', 'Third Man'
];

interface FieldPlannerProps {
  presetKey: string;
  onSelectPreset?: (key: string) => void;
  battingHand: BattingHand;
  readOnly?: boolean;
  customFielders?: Fielder[];
  onChangeCustomFielders?: (fielders: Fielder[]) => void;
}

export const FieldPlanner: React.FC<FieldPlannerProps> = ({
  presetKey,
  onSelectPreset,
  battingHand,
  readOnly = false,
  customFielders,
  onChangeCustomFielders
}) => {
  const currentPreset = STRATEGIST_PRESETS[presetKey] || STRATEGIST_PRESETS['balanced-default'];
  const [selectedFielder, setSelectedFielder] = useState<number | null>(null);
  const [customFielderState, setCustomFielderState] = useState<Fielder[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Sync state from properties
  useEffect(() => {
    if (customFielders && customFielders.length === 9) {
      setCustomFielderState(customFielders);
    } else {
      setCustomFielderState(currentPreset.fielders(battingHand));
    }
  }, [customFielders, presetKey, battingHand]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (readOnly || selectedFielder === null || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert pixels to 200x200 grid
    const x = Math.round((clickX / rect.width) * 200);
    const y = Math.round((clickY / rect.height) * 200);

    // Limit coords to safe playing area bounds inside 0-200
    const constrainedX = Math.min(200, Math.max(0, x));
    const constrainedY = Math.min(200, Math.max(0, y));

    const updated = [...customFielderState];
    updated[selectedFielder] = {
      ...updated[selectedFielder],
      x: constrainedX,
      y: constrainedY
    };

    setCustomFielderState(updated);

    if (onSelectPreset && presetKey !== 'custom') {
      onSelectPreset('custom');
    }
    if (onChangeCustomFielders) {
      onChangeCustomFielders(updated);
    }
  };

  const handleFielderClick = (e: React.MouseEvent, index: number) => {
    if (readOnly) return;
    e.stopPropagation(); // Prevent moving fielder to clicked location immediately
    setSelectedFielder(index);
  };

  const handleUpdateFielderName = (index: number, name: string) => {
    if (readOnly || index < 0 || index >= customFielderState.length) return;

    const updated = [...customFielderState];
    updated[index] = {
      ...updated[index],
      name: name
    };

    setCustomFielderState(updated);

    if (onSelectPreset && presetKey !== 'custom') {
      onSelectPreset('custom');
    }
    if (onChangeCustomFielders) {
      onChangeCustomFielders(updated);
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner w-full">
      <div className="mb-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Visual Field Placement Radar
        </span>
        <p className="text-sm font-medium text-slate-200">
          {presetKey === 'custom' ? 'Custom Field Placement' : currentPreset.label}
        </p>
      </div>

      {/* Preset Buttons for Interaction (if not readOnly) */}
      {!readOnly && onSelectPreset && (
        <div className="flex flex-wrap gap-1.5 justify-center mb-3 w-full">
          {Object.entries(STRATEGIST_PRESETS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onSelectPreset(key);
                setSelectedFielder(null);
                const current = STRATEGIST_PRESETS[key] || STRATEGIST_PRESETS['balanced-default'];
                const defs = current.fielders(battingHand);
                setCustomFielderState(defs);
                if (onChangeCustomFielders) {
                  onChangeCustomFielders(defs);
                }
              }}
              className={`text-[9px] px-2 py-1 rounded transition-all font-semibold uppercase border cursor-pointer
                ${presetKey === key
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
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
        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          onClick={handleSvgClick}
          className={`w-full h-full select-none ${!readOnly && selectedFielder !== null ? 'cursor-crosshair' : 'cursor-default'}`}
        >
          {/* Grass Field Outer Circle (Boundary Rope) */}
          <circle cx="100" cy="100" r="92" fill="#045d31" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="2, 2" />
          
          {/* Inner 30-yard Ring */}
          <circle cx="100" cy="100" r="48" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3, 3" opacity="0.6" />
          
          {/* Pitch Area (Center) */}
          <rect x="94" y="86" width="12" height="28" fill="#bc997d" rx="1" />
          <line x1="94" y1="91" x2="106" y2="91" stroke="#ffffff" strokeWidth="0.5" opacity="0.7" />
          <line x1="94" y1="109" x2="106" y2="109" stroke="#ffffff" strokeWidth="0.5" opacity="0.7" />
          
          {/* Wickets */}
          <line x1="98" y1="89" x2="102" y2="89" stroke="#fb923c" strokeWidth="1" strokeLinecap="round" />
          <line x1="98" y1="111" x2="102" y2="111" stroke="#fb923c" strokeWidth="1" strokeLinecap="round" />
          
          {/* Legend Text: Off side / Leg side */}
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

          {/* Wicket Keeper Dot */}
          <circle cx="100" cy="122" r="3.5" fill="#f87171" stroke="#ffffff" strokeWidth="0.5" />
          <text x="100" y="129" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">WK</text>

          {/* Bowler Dot */}
          <circle cx="100" cy="115" r="3" fill="#a5f3fc" stroke="#0891b2" strokeWidth="0.5" />
          <text x="100" y="111" fill="#a5f3fc" fontSize="4.5" textAnchor="middle">Pacer/Spin</text>

          {/* Batsman active sticker dot at striking end */}
          <rect x="98.5" y="87" width="3" height="3" fill="#ffffff" rx="0.5" />
          <text x="100" y="82" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">BAT</text>

          {/* Fielder dots plotted from preset dynamically */}
          {customFielderState.map((fielder, index) => {
            const isSelected = selectedFielder === index;
            return (
              <g
                key={index}
                className="transition-all duration-300 ease-out cursor-pointer group"
                onClick={(e) => handleFielderClick(e, index)}
              >
                {/* Visual selected highlight ring */}
                {isSelected && !readOnly && (
                  <circle
                    cx={fielder.x}
                    cy={fielder.y}
                    r="8.5"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={fielder.x}
                  cy={fielder.y}
                  r={isSelected && !readOnly ? "4.5" : "3.5"}
                  fill={isSelected && !readOnly ? "#38bdf8" : "#ffdd00"}
                  stroke={isSelected && !readOnly ? "#ffffff" : "#1e293b"}
                  strokeWidth="0.75"
                  className="group-hover:stroke-slate-50 transition-colors"
                />
                <text
                  x={fielder.x}
                  y={fielder.y - 6}
                  fill={isSelected && !readOnly ? "#38bdf8" : "#ffffff"}
                  fontSize="5"
                  fontWeight={isSelected && !readOnly ? "bold" : "semibold"}
                  textAnchor="middle"
                  className="bg-slate-950 font-sans tracking-tight"
                  style={{ filter: 'drop-shadow(1px 1.5px 1px rgba(0,0,0,0.95))' }}
                >
                  {fielder.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Editor (shown only when NOT readOnly) */}
      {!readOnly && (
        <div className="flex flex-col gap-2 mt-3 w-full border-t border-slate-800 pt-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Manual Positioning Controls
          </span>
          <p className="text-[9px] text-slate-500 leading-normal">
            ⚙ Click on any fielder inside the radar circular turf to select, then click on the grass map zone to reposition. 
          </p>

          {selectedFielder !== null ? (
            <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1.5 mt-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-sky-400">
                  Fielder #{selectedFielder + 1} Selected ({customFielderState[selectedFielder]?.name})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFielder(null)}
                  className="text-slate-400 hover:text-white font-semibold cursor-pointer text-[9px] bg-slate-850 px-1 py-0.5 rounded"
                >
                  Deselect
                </button>
              </div>

              <div className="flex gap-1">
                <input
                  type="text"
                  value={customFielderState[selectedFielder]?.name || ''}
                  onChange={(e) => handleUpdateFielderName(selectedFielder, e.target.value)}
                  placeholder="Position Name (e.g. 1st Slip)"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1 max-h-[60px] overflow-y-auto pr-1">
                {COMMON_FIELD_POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => handleUpdateFielderName(selectedFielder, pos)}
                    className={`text-[8px] px-1 py-0.5 rounded cursor-pointer border font-mono
                      ${customFielderState[selectedFielder]?.name === pos
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400'
                      }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 p-2 rounded border border-dashed border-slate-800 text-center text-[9px] text-slate-500 italic">
              (Choose a fielder's gold dot inside the SVG or click one of the quick chips below to adjust positions)
            </div>
          )}

          {/* Quick chip indexes selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 mt-1 pr-1 w-full scrollbar-thin">
            {customFielderState.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedFielder(i)}
                className={`flex-shrink-0 px-2 py-1 rounded text-[9px] border transition text-left cursor-pointer max-w-[95px] truncate
                  ${selectedFielder === i
                    ? 'bg-blue-600 border-blue-400 text-white font-bold'
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-300'
                  }`}
              >
                <div className="opacity-60 text-[7px] font-mono leading-none">F{i + 1}</div>
                <div className="truncate text-[9.5px] leading-tight mt-0.5">{f.name || `Fielder ${i+1}`}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {presetKey !== 'custom' && (
        <div className="mt-2 text-slate-400 text-[10px] text-center italic max-w-[240px] leading-relaxed">
          {currentPreset.description}
        </div>
      )}
    </div>
  );
};
