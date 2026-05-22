import React from 'react';

// Definitions for the 12 key pitching sectors in cricket
export const PITCH_ZONES = [
  { id: 'short-off', label: 'Short wide off', length: 'Short', line: 'Outside Off', color: 'rgba(239, 68, 68, 0.15)', hoverColor: 'rgba(239, 68, 68, 0.3)', strokeColor: '#ef4444' },
  { id: 'short-stumps', label: 'Short on stumps', length: 'Short', line: 'Stumps', color: 'rgba(239, 68, 68, 0.15)', hoverColor: 'rgba(239, 68, 68, 0.3)', strokeColor: '#ef4444' },
  { id: 'short-leg', label: 'Short down leg', length: 'Short', line: 'Down Leg', color: 'rgba(239, 68, 68, 0.15)', hoverColor: 'rgba(239, 68, 68, 0.3)', strokeColor: '#ef4444' },
  
  { id: 'good-outside-off', label: 'Good length corridor', length: 'Good', line: 'Outside Off', color: 'rgba(245, 158, 11, 0.15)', hoverColor: 'rgba(245, 158, 11, 0.3)', strokeColor: '#f59e0b' },
  { id: 'good-stumps', label: 'Good length on stumps', length: 'Good', line: 'Stumps', color: 'rgba(245, 158, 11, 0.15)', hoverColor: 'rgba(245, 158, 11, 0.3)', strokeColor: '#f59e0b' },
  { id: 'good-leg', label: 'Good length down leg', length: 'Good', line: 'Down Leg', color: 'rgba(245, 158, 11, 0.15)', hoverColor: 'rgba(245, 158, 11, 0.3)', strokeColor: '#f59e0b' },
  
  { id: 'full-off', label: 'Half-volley wide off', length: 'Full', line: 'Outside Off', color: 'rgba(16, 185, 129, 0.15)', hoverColor: 'rgba(16, 185, 129, 0.3)', strokeColor: '#10b981' },
  { id: 'full-stumps', label: 'Half-volley on stumps', length: 'Full', line: 'Stumps', color: 'rgba(16, 185, 129, 0.15)', hoverColor: 'rgba(16, 185, 129, 0.3)', strokeColor: '#10b981' },
  { id: 'full-leg', label: 'Half-volley down leg (pads)', length: 'Full', line: 'Down Leg', color: 'rgba(16, 185, 129, 0.15)', hoverColor: 'rgba(16, 185, 129, 0.3)', strokeColor: '#10b981' },
  
  { id: 'yorker-off', label: 'Yorker outside off', length: 'Yorker', line: 'Outside Off', color: 'rgba(59, 130, 246, 0.15)', hoverColor: 'rgba(59, 130, 246, 0.3)', strokeColor: '#3b82f6' },
  { id: 'yorker-stumps', label: 'Yorker/Toe-crusher stumps', length: 'Yorker', line: 'Stumps', color: 'rgba(59, 130, 246, 0.15)', hoverColor: 'rgba(59, 130, 246, 0.3)', strokeColor: '#3b82f6' },
  { id: 'yorker-leg', label: 'Yorker/Full-toss on pads', length: 'Yorker', line: 'Down Leg', color: 'rgba(59, 130, 246, 0.15)', hoverColor: 'rgba(59, 130, 246, 0.3)', strokeColor: '#3b82f6' }
];

interface PitchMapProps {
  selectedZone: string;
  onSelectZone?: (zoneId: string) => void;
  readOnly?: boolean;
  type?: 'batsman' | 'bowler';
}

export const PitchMap: React.FC<PitchMapProps> = ({
  selectedZone,
  onSelectZone,
  readOnly = false,
  type = 'batsman'
}) => {
  const currentZone = PITCH_ZONES.find(z => z.id === selectedZone);

  return (
    <div className="flex flex-col items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner w-full">
      <div className="mb-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Interactive Pitch Target Radar
        </span>
        <p className="text-sm font-medium text-slate-100 min-h-[20px]">
          {currentZone ? `${currentZone.label} (${currentZone.length} length)` : 'Select a target area'}
        </p>
      </div>

      <div className="relative w-full max-w-[280px] aspect-[5/8] bg-emerald-950 rounded-lg overflow-hidden border-2 border-slate-700 flex flex-col justify-end p-2 pb-6">
        {/* Pitch outer border lines */}
        <div className="absolute inset-x-8 top-0 bottom-4 border-l border-r border-dashed border-emerald-800 pointer-events-none" />

        {/* Crease line & stumps at top boundary */}
        <div className="absolute top-8 inset-x-4 h-0.5 bg-white opacity-40 pointer-events-none" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
          <div className="w-1 h-4 bg-orange-400 opacity-80 rounded-t-sm" />
          <div className="w-1 h-4 bg-orange-400 opacity-80 rounded-t-sm" />
          <div className="w-1 h-4 bg-orange-400 opacity-80 rounded-t-sm" />
        </div>

        {/* Batter illustration back-on standing at crease area */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-20 flex flex-col items-center">
          <div className="w-3 h-3 bg-white rounded-full mb-0.5" />
          <div className="w-5 h-7 bg-white rounded-b-md" />
          <div className="w-7 h-1 bg-white rotate-12 origin-left mt-[-10px] rounded-full" />
        </div>

        {/* Wickets, Crease representation at bottom end (Bowler's point of view) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
          <div className="w-1 h-3 bg-slate-400 opacity-40" />
          <div className="w-1 h-3 bg-slate-400 opacity-40" />
          <div className="w-1 h-3 bg-slate-400 opacity-40" />
        </div>
        <div className="absolute bottom-10 inset-x-4 h-0.5 bg-white opacity-20 pointer-events-none" />

        {/* 3D-like Perspective Pitch Grid Container */}
        <div className="grid grid-cols-3 grid-rows-4 w-full h-[82%] relative border border-emerald-800 rounded z-10">
          
          {/* Row 1: Short Length (Top) */}
          <ZoneCell id="short-off" strokeColor="#f43f5e" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Short Off" />
          <ZoneCell id="short-stumps" strokeColor="#f43f5e" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Short On" />
          <ZoneCell id="short-leg" strokeColor="#f43f5e" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Short Leg" />

          {/* Row 2: Good Length */}
          <ZoneCell id="good-outside-off" strokeColor="#eab308" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Good Off" />
          <ZoneCell id="good-stumps" strokeColor="#eab308" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Good On" />
          <ZoneCell id="good-leg" strokeColor="#eab308" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Good Leg" />

          {/* Row 3: Full Length */}
          <ZoneCell id="full-off" strokeColor="#10b981" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Full Off" />
          <ZoneCell id="full-stumps" strokeColor="#10b981" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Full On" />
          <ZoneCell id="full-leg" strokeColor="#10b981" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Full Leg" />

          {/* Row 4: Yorker / Full Toss (Bottom) */}
          <ZoneCell id="yorker-off" strokeColor="#3b82f6" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Yorker Off" />
          <ZoneCell id="yorker-stumps" strokeColor="#3b82f6" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Yorker On" />
          <ZoneCell id="yorker-leg" strokeColor="#3b82f6" activeId={selectedZone} readOnly={readOnly} onClick={onSelectZone} label="Yorker Leg" />

        </div>

        {/* Background Gradients on Length labels on sides */}
        <div className="absolute left-1 top-0 bottom-4 w-4 flex flex-col justify-between text-[8px] text-slate-500 font-mono tracking-tighter uppercase select-none pointer-events-none pt-4 pb-2 z-0">
          <div>Short</div>
          <div>Good</div>
          <div>Full</div>
          <div>Yorker</div>
        </div>

        <div className="absolute right-1 top-0 bottom-4 w-4 flex flex-col justify-between text-[8px] text-slate-500 font-mono tracking-tighter uppercase select-none pointer-events-none pt-4 pb-2 text-right z-0">
          <div>Short</div>
          <div>Good</div>
          <div>Full</div>
          <div>Yorker</div>
        </div>

        {/* Direction Indicator */}
        <div className="absolute bottom-1.5 inset-x-0 text-center text-[8px] tracking-widest text-emerald-400 font-semibold uppercase opacity-60">
          ▲ DIRECTION OF DELIVERY ▲
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 justify-center text-[10px] w-full">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block opacity-70"></span>
          <span className="text-slate-400 text-xs">Short</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block opacity-70"></span>
          <span className="text-slate-400 text-xs">Good</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block opacity-70"></span>
          <span className="text-slate-400 text-xs">Full / Pad</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block opacity-70"></span>
          <span className="text-slate-400 text-xs">Yorker</span>
        </div>
      </div>
    </div>
  );
};

interface ZoneCellProps {
  id: string;
  strokeColor: string;
  activeId: string;
  readOnly: boolean;
  onClick?: (zoneId: string) => void;
  label: string;
}

const ZoneCell: React.FC<ZoneCellProps> = ({ id, strokeColor, activeId, readOnly, onClick, label }) => {
  const isActive = activeId === id;

  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={() => onClick?.(id)}
      className={`relative w-full h-full border-[0.5px] border-emerald-900/40 transition-all flex flex-col items-center justify-center p-0.5 select-none focus:outline-none
        ${readOnly ? 'cursor-default' : 'hover:bg-emerald-800/20 cursor-pointer'}
        ${isActive ? 'bg-slate-900/80 index-20 text-white border-2 scale-[1.03] shadow-md' : 'text-slate-400/50'}
      `}
      style={{
        borderColor: isActive ? strokeColor : undefined,
        boxShadow: isActive ? `0 0 12px ${strokeColor}40` : undefined
      }}
    >
      <span className={`text-[8px] font-mono tracking-tighter leading-none pointer-events-none transition-all duration-150 uppercase
        ${isActive ? 'font-bold text-white scale-110' : 'text-slate-500Group text-xs opacity-40'}
      `}
      style={{
        color: isActive ? strokeColor : undefined
      }}
      >
        {label}
      </span>
      {isActive && (
        <span className="absolute bottom-[2px] right-[2px] w-1.5 h-1.5 rounded-full" 
          style={{ backgroundColor: strokeColor }}
        />
      )}
    </button>
  );
};
