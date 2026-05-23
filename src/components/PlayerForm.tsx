import React, { useState } from 'react';
import { OpponentBatsman, OpponentBowler, BattingHand, BowlingStyle, Fielder } from '../types';
import { PitchMap } from './PitchMap';
import { FieldPlanner, STRATEGIST_PRESETS } from './FieldPlanner';
import { Plus, X, Search, Check, ShieldAlert } from 'lucide-react';

interface PlayerFormProps {
  onAddBatsman: (batsman: OpponentBatsman) => void;
  onAddBowler: (bowler: OpponentBowler) => void;
  onCancel: () => void;
}

const COMMON_BATS_WEAKNESSES = [
  'Outside Off Corridor', 'Short-Ball Ribline', 'In-Swinging Yorker', 
  'Left-Arm Angle Slant', 'Googly & Wrong-un', 'Slower Cutters', 
  'Spin Drift Out Rough', 'High Bounce Bounce'
];

const COMMON_BOWL_WEAKNESSES = [
  'Leaks under death pressure', 'Loses grip with wet ball', 'Predictable slower ball',
  'Struggles round-the-wicket', 'Struggles with left-handers', 'Easily rattled when attacked',
  'Bad line inside Powerplay', 'Weak cover support'
];

const COMMON_SHOTS = [
  'Cover Drive on rise', 'Horizontal Hook/Pull', 'Late Cut & Slash', 
  'Deep Sweep & Sweep', 'Paddle Scoop / Ramp', 'Step-out Lofted Drive',
  'Flick off hips'
];

export const PlayerForm: React.FC<PlayerFormProps> = ({
  onAddBatsman,
  onAddBowler,
  onCancel
}) => {
  const [profileType, setProfileType] = useState<'batsman' | 'bowler'>('batsman');
  
  // General details
  const [name, setName] = useState('');
  const [battingHand, setBattingHand] = useState<BattingHand>('Right-Hand');
  const [bowlingStyle, setBowlingStyle] = useState<BowlingStyle>('Right-Arm Fast');
  const [notes, setNotes] = useState('');
  
  // Stats
  const [matches, setMatches] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);
  const [economy, setEconomy] = useState<number>(6.5);
  const [strikeRate, setStrikeRate] = useState<number>(20);

  // Weaknesses and Shots
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>([]);
  const [customWeakness, setCustomWeakness] = useState('');
  const [selectedShots, setSelectedShots] = useState<string[]>([]);
  const [customShot, setCustomShot] = useState('');

  // Pitch map target and field setups
  const [pitchZone, setPitchZone] = useState<string>(
    profileType === 'batsman' ? 'good-outside-off' : 'good-stumps'
  );
  const [fieldSetup, setFieldSetup] = useState<string>('balanced-default');
  const [customFielders, setCustomFielders] = useState<Fielder[] | undefined>(undefined);

  const handleToggleWeakness = (item: string) => {
    if (selectedWeaknesses.includes(item)) {
      setSelectedWeaknesses(selectedWeaknesses.filter(w => w !== item));
    } else {
      setSelectedWeaknesses([...selectedWeaknesses, item]);
    }
  };

  const handleAddCustomWeakness = () => {
    if (customWeakness.trim() && !selectedWeaknesses.includes(customWeakness.trim())) {
      setSelectedWeaknesses([...selectedWeaknesses, customWeakness.trim()]);
      setCustomWeakness('');
    }
  };

  const handleToggleShot = (item: string) => {
    if (selectedShots.includes(item)) {
      setSelectedShots(selectedShots.filter(s => s !== item));
    } else {
      setSelectedShots([...selectedShots, item]);
    }
  };

  const handleAddCustomShot = () => {
    if (customShot.trim() && !selectedShots.includes(customShot.trim())) {
      setSelectedShots([...selectedShots, customShot.trim()]);
      setCustomShot('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a player name');

    if (profileType === 'batsman') {
      const newBatsman: OpponentBatsman = {
        id: 'bat-' + Date.now(),
        name: name.trim(),
        battingHand,
        weaknessTypes: selectedWeaknesses.length ? selectedWeaknesses : ['General Inexperience'],
        vulnerableShots: selectedShots.length ? selectedShots : ['None identified'],
        pitchMapWeakness: pitchZone || 'good-outside-off',
        tacticalFieldSetup: fieldSetup,
        customFielders: fieldSetup === 'custom' ? customFielders : undefined,
        notes: notes.trim() || 'No additional notes provided.',
        stats: {
          matches: matches || 0,
          average: average || 0,
          strikeRate: strikeRate || 100
        },
        customAdded: true
      };
      onAddBatsman(newBatsman);
    } else {
      const newBowler: OpponentBowler = {
        id: 'bowl-' + Date.now(),
        name: name.trim(),
        bowlingStyle,
        weaknessTypes: selectedWeaknesses.length ? selectedWeaknesses : ['Inconsistent lengths'],
        targetShots: selectedShots.length ? selectedShots : ['Sweep Shot'],
        pitchMapLeak: pitchZone || 'good-stumps',
        antiBowlerStrategy: fieldSetup === 'slip-cordon' ? 'charge-down' : fieldSetup === 'shortline-choke' ? 'death-fringe' : 'sweep-and-scurry',
        notes: notes.trim() || 'No additional notes provided.',
        stats: {
          matches: matches || 0,
          economy: economy || 6.5,
          strikeRate: strikeRate || 24
        },
        customAdded: true
      };
      onAddBowler(newBowler);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto text-slate-800">
      
      {/* Title / Close bar */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            Establish Manual Opponent Profile
          </h2>
          <p className="text-xs text-slate-500">Define tactics and log specific game vulnerabilities in detail.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 px-3 rounded hover:bg-slate-100 border border-slate-200 transition text-xs text-slate-600 font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Role selector */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setProfileType('batsman');
            setSelectedWeaknesses([]);
            setSelectedShots([]);
            setPitchZone('good-outside-off');
          }}
          className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
            ${profileType === 'batsman' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'}`}
        >
          Batsman Profile
        </button>
        <button
          type="button"
          onClick={() => {
            setProfileType('bowler');
            setSelectedWeaknesses([]);
            setSelectedShots([]);
            setPitchZone('good-stumps');
          }}
          className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
            ${profileType === 'bowler' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'}`}
        >
          Bowler Profile
        </button>
      </div>

      {/* Basic Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Row 1 / Col 1: Name */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Player Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Mitchell Richardson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-sans"
          />
        </div>

        {/* Row 1 / Col 2: Style */}
        <div className="space-y-1.5">
          {profileType === 'batsman' ? (
            <>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 font-sans">Batting Hand</label>
              <select
                value={battingHand}
                onChange={(e) => setBattingHand(e.target.value as BattingHand)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Right-Hand">Right-Hand (RHB)</option>
                <option value="Left-Hand">Left-Hand (LHB)</option>
              </select>
            </>
          ) : (
            <>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Bowling Style</label>
              <select
                value={bowlingStyle}
                onChange={(e) => setBowlingStyle(e.target.value as BowlingStyle)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Right-Arm Fast">Right-Arm Fast</option>
                <option value="Left-Arm Fast">Left-Arm Fast</option>
                <option value="Right-Arm Off-Spin">Right-Arm Off-Spin</option>
                <option value="Right-Arm Leg-Spin">Right-Arm Leg-Spin</option>
                <option value="Left-Arm Orthodox">Left-Arm Orthodox</option>
                <option value="Left-Arm Wrist-Spin">Left-Arm Wrist-Spin</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Match Records Stats */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Statistical History</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Matches Played</span>
            <input
              type="number"
              min="0"
              value={matches === 0 ? '' : matches}
              onChange={(e) => setMatches(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="e.g. 15"
              className="w-full bg-white border border-slate-250 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          {profileType === 'batsman' ? (
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Batting Average</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={average === 0 ? '' : average}
                onChange={(e) => setAverage(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 34.50"
                className="w-full bg-white border border-slate-250 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Economy Rate</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={economy === 0 ? '' : economy}
                onChange={(e) => setEconomy(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="e.g. 7.20"
                className="w-full bg-white border border-slate-250 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Strike Rate</span>
            <input
              type="number"
              step="0.1"
              min="0"
              value={strikeRate === 0 ? '' : strikeRate}
              onChange={(e) => setStrikeRate(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder={profileType === 'batsman' ? 'e.g. 142.5' : 'e.g. 18.5'}
              className="w-full bg-white border border-slate-250 rounded px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Weakness Selectors with Pill Tags */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
            Key Opponent Weakness Markers
          </label>
          <p className="text-[10px] text-slate-500">Pick any of our quick-log pillars or type a custom weakness below.</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(profileType === 'batsman' ? COMMON_BATS_WEAKNESSES : COMMON_BOWL_WEAKNESSES).map((weakness) => {
            const isSelected = selectedWeaknesses.includes(weakness);
            return (
              <button
                key={weakness}
                type="button"
                onClick={() => handleToggleWeakness(weakness)}
                className={`text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 relative font-semibold cursor-pointer
                  ${isSelected
                    ? 'bg-rose-50 border-rose-300 text-red-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {weakness}
                {isSelected ? <Check className="w-3 h-3 text-red-650" /> : <Plus className="w-3 h-3 text-slate-400" />}
              </button>
            );
          })}
        </div>

        {/* Custom weakness write in */}
        <div className="flex gap-2 max-w-sm">
          <input
            type="text"
            placeholder="Add custom weakness..."
            value={customWeakness}
            onChange={(e) => setCustomWeakness(e.target.value)}
            className="flex-1 bg-white border border-slate-250 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-red-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomWeakness();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddCustomWeakness}
            className="bg-slate-100 hover:bg-slate-200 px-3 py-1 text-xs rounded border border-slate-200 font-bold cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Target shots for game counter plans */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {profileType === 'batsman' ? 'Vulnerable Shots' : 'Optimal Shots to Attack Bowler'}
          </label>
          <p className="text-[10px] text-slate-500">
            {profileType === 'batsman' 
              ? 'Shots where they make the most mistake or loose catch edges.'
              : 'Shots our batsmen should confidently employ to exploit this bowlers line.'
            }
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {COMMON_SHOTS.map((shot) => {
            const isSelected = selectedShots.includes(shot);
            return (
              <button
                key={shot}
                type="button"
                onClick={() => handleToggleShot(shot)}
                className={`text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 font-semibold cursor-pointer
                  ${isSelected
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {shot}
                {isSelected ? <Check className="w-3 h-3 text-green-650" /> : <Plus className="w-3 h-3 text-slate-400" />}
              </button>
            );
          })}
        </div>

        {/* Custom shot */}
        <div className="flex gap-2 max-w-sm">
          <input
            type="text"
            placeholder="Add custom shot option..."
            value={customShot}
            onChange={(e) => setCustomShot(e.target.value)}
            className="flex-1 bg-white border border-slate-250 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-green-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomShot();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddCustomShot}
            className="bg-slate-100 hover:bg-slate-200 px-3 py-1 text-xs rounded border border-slate-200 font-bold cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Multi-interactive map sectors (Pitch zoning and fielder presets) */}
      <div className="border border-slate-200 rounded-lg overflow-hidden p-4 space-y-4 bg-slate-50">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200">
          Visual Tactical Blueprints
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Col 1 Pitch zones */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-650 block uppercase tracking-wide">
              {profileType === 'batsman' ? 'Select Pitching Target Zone' : 'Boundary Leak Area'}
            </span>
            <p className="text-[10px] text-slate-500 leading-tight">
              Click on the pitch diagram zone to set where to exploit or target.
            </p>
            <div className="bg-white rounded p-1 border border-slate-250 inline-block">
              <PitchMap
                selectedZone={pitchZone}
                onSelectZone={setPitchZone}
                type={profileType}
              />
            </div>
          </div>

          {/* Col 2 Field placing planner (Only relevant for batsman traps in this view, bowler setup can use defaults) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-650 block uppercase tracking-wide">
              Trap Preset Field layout
            </span>
            <p className="text-[10px] text-slate-500 leading-tight">
              Pick a match defense structure or map a custom field to exploit their weakness.
            </p>
            <div className="bg-white rounded p-1 border border-slate-250 inline-block">
              <FieldPlanner
                presetKey={fieldSetup}
                onSelectPreset={setFieldSetup}
                battingHand={battingHand}
                customFielders={customFielders}
                onChangeCustomFielders={setCustomFielders}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Strategic notes block */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">Tactical Directives / Special Instructions</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. He likes to back away inside the leg side. Slower off-cutters thrown into the wider rough are perfect."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-sans"
        />
      </div>

      {/* Submit / actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-100 hover:bg-slate-200 px-5 py-2 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 transition cursor-pointer"
        >
          Discard
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-xs font-bold shadow-sm tracking-wide transition cursor-pointer"
        >
          Confirm Opponent Profile
        </button>
      </div>

    </form>
  );
};
