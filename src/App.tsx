import React, { useState, useEffect } from 'react';
import { PRELOADED_BATSMEN, PRELOADED_BOWLERS } from './data/mockPlayers';
import { OpponentBatsman, OpponentBowler, Fielder, VideoAnalysis } from './types';
import { PlayerForm } from './components/PlayerForm';
import { PrintReport } from './components/PrintReport';
import { PitchMap } from './components/PitchMap';
import { FieldPlanner, STRATEGIST_PRESETS } from './components/FieldPlanner';
import { VideoAnalystModal } from './components/VideoAnalystModal';
import { 
  Plus, Search, Trash2, Printer, Trophy, ShieldAlert, Zap, CircleAlert, 
  Sparkles, RotateCcw, UserMinus, ShieldAlert as AlertIcon, BookOpen, ExternalLink,
  Video
} from 'lucide-react';

export default function App() {
  // Persistence via localStorage
  const [batsmen, setBatsmen] = useState<OpponentBatsman[]>(() => {
    try {
      const saved = localStorage.getItem('cricket_batsmen_scout');
      return saved ? JSON.parse(saved) : PRELOADED_BATSMEN;
    } catch {
      return PRELOADED_BATSMEN;
    }
  });

  const [bowlers, setBowlers] = useState<OpponentBowler[]>(() => {
    try {
      const saved = localStorage.getItem('cricket_bowlers_scout');
      return saved ? JSON.parse(saved) : PRELOADED_BOWLERS;
    } catch {
      return PRELOADED_BOWLERS;
    }
  });

  const [activeTab, setActiveTab] = useState<'batsmen' | 'bowlers' | 'guide'>('batsmen');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Overlays
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [printingPlayer, setPrintingPlayer] = useState<{ 
    batsman?: OpponentBatsman; 
    bowler?: OpponentBowler;
    allBatsmen?: OpponentBatsman[];
    allBowlers?: OpponentBowler[];
  } | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Custom Field Placement modal state
  const [customizingFieldBatsman, setCustomizingFieldBatsman] = useState<OpponentBatsman | null>(null);
  const [tempFielders, setTempFielders] = useState<Fielder[]>([]);
  const [tempFieldSetup, setTempFieldSetup] = useState<string>('custom');

  // Video scouting states
  const [activeVideoScoutPlayer, setActiveVideoScoutPlayer] = useState<{
    id: string;
    type: 'batsman' | 'bowler';
  } | null>(null);

  const handleSaveVideoAnalysis = (
    playerId: string,
    type: 'batsman' | 'bowler',
    analysis: VideoAnalysis,
    attrs?: { weaknesses: string[]; pitchMap: string; setupPreset?: string }
  ) => {
    if (type === 'batsman') {
      setBatsmen(prev => prev.map(b => {
        if (b.id === playerId) {
          const updated: OpponentBatsman = {
            ...b,
            videoAnalysis: analysis,
          };
          if (attrs) {
            updated.weaknessTypes = attrs.weaknesses && attrs.weaknesses.length > 0 ? attrs.weaknesses : b.weaknessTypes;
            updated.pitchMapWeakness = attrs.pitchMap || b.pitchMapWeakness;
            if (attrs.setupPreset) {
              updated.tacticalFieldSetup = attrs.setupPreset;
            }
          }
          return updated;
        }
        return b;
      }));
    } else {
      setBowlers(prev => prev.map(b => {
        if (b.id === playerId) {
          const updated: OpponentBowler = {
            ...b,
            videoAnalysis: analysis,
          };
          if (attrs) {
            updated.weaknessTypes = attrs.weaknesses && attrs.weaknesses.length > 0 ? attrs.weaknesses : b.weaknessTypes;
            updated.pitchMapLeak = attrs.pitchMap || b.pitchMapLeak;
          }
          return updated;
        }
        return b;
      }));
    }
    setActiveVideoScoutPlayer(null);
  };

  const handleRemoveVideoAnalysis = (playerId: string, type: 'batsman' | 'bowler') => {
    if (type === 'batsman') {
      setBatsmen(prev => prev.map(b => b.id === playerId ? { ...b, videoAnalysis: undefined } : b));
    } else {
      setBowlers(prev => prev.map(b => b.id === playerId ? { ...b, videoAnalysis: undefined } : b));
    }
  };

  useEffect(() => {
    if (customizingFieldBatsman) {
      setTempFieldSetup(customizingFieldBatsman.tacticalFieldSetup);
      if (customizingFieldBatsman.customFielders && customizingFieldBatsman.customFielders.length === 9) {
        setTempFielders(customizingFieldBatsman.customFielders);
      } else {
        const currentPreset = STRATEGIST_PRESETS[customizingFieldBatsman.tacticalFieldSetup] || STRATEGIST_PRESETS['balanced-default'];
        setTempFielders(currentPreset.fielders(customizingFieldBatsman.battingHand));
      }
    } else {
      setTempFielders([]);
    }
  }, [customizingFieldBatsman]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('cricket_batsmen_scout', JSON.stringify(batsmen));
  }, [batsmen]);

  useEffect(() => {
    localStorage.setItem('cricket_bowlers_scout', JSON.stringify(bowlers));
  }, [bowlers]);

  // Handle deletions
  const handleDeleteBatsman = (id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Batsman Profile',
      message: `Are you sure you want to delete the tactical report for Batsman ${name}?`,
      onConfirm: () => {
        setBatsmen(prev => prev.filter(b => b.id !== id));
        setConfirmState(null);
      }
    });
  };

  const handleDeleteBowler = (id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Bowler Profile',
      message: `Are you sure you want to delete the tactical report for Bowler ${name}?`,
      onConfirm: () => {
        setBowlers(prev => prev.filter(b => b.id !== id));
        setConfirmState(null);
      }
    });
  };

  // Add new player manual additions
  const handleAddBatsman = (newB: OpponentBatsman) => {
    setBatsmen([newB, ...batsmen]);
    setActiveTab('batsmen'); // Ensure tab defaults to newly added batsman
    setIsAddingNew(false);
  };

  const handleSaveFieldLayout = (id: string, updatedFielders: Fielder[], setupKey: string) => {
    setBatsmen(prev => prev.map(b => b.id === id ? { 
      ...b, 
      customFielders: updatedFielders, 
      tacticalFieldSetup: setupKey 
    } : b));
    setCustomizingFieldBatsman(null);
  };

  const handleAddBowler = (newBowl: OpponentBowler) => {
    setBowlers([newBowl, ...bowlers]);
    setActiveTab('bowlers'); // Ensure tab defaults to newly added bowler
    setIsAddingNew(false);
  };

  // Reset to default preloads helper
  const handleResetDefaults = () => {
    setConfirmState({
      isOpen: true,
      title: 'Restore Default Profiles',
      message: 'Would you like to reload all standard opposition profiles? This will restore preloaded players alongside any custom registered ones to their initial state.',
      onConfirm: () => {
        setBatsmen(PRELOADED_BATSMEN);
        setBowlers(PRELOADED_BOWLERS);
        setConfirmState(null);
      }
    });
  };

  // Filters profiles based on searches
  const filteredBatsmen = batsmen.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.weaknessTypes.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredBowlers = bowlers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.weaknessTypes.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Simple statistics
  const totalThreats = batsmen.length + bowlers.length;
  const highRiskBatsmenCount = batsmen.filter(b => (b.stats.average ?? 0) >= 30).length;
  const highRiskBowlersCount = bowlers.filter(b => (b.stats.economy ?? 0) <= 7.5).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-950 font-sans tracking-tight">
      
      {/* Top Navigation Frame Applet Banner */}
      <header className="border-b border-slate-200 bg-[#1E293B] sticky top-0 z-30 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
              STRIKESCAN <span className="text-blue-400 font-mono text-sm uppercase">[v4.1 PRO]</span>
            </h1>
            <p className="text-xs text-slate-300">Scout enemy weaknesses, map target zones, and print professional PDF dossiers.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-[11px] px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 transition font-medium flex items-center gap-1.5 cursor-pointer"
            title="Restore default mock players"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore defaults
          </button>
          
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded border border-slate-700 bg-slate-800 text-slate-205 hover:bg-slate-750 hover:text-white transition duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + ADD MANUAL DATA
          </button>

          <button
            type="button"
            onClick={() => setPrintingPlayer({ allBatsmen: batsmen, allBowlers: bowlers })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded shadow transition duration-200 flex items-center gap-1.5 cursor-pointer"
            title="Export full squad analysis briefing package to PDF"
          >
            <Printer className="w-4 h-4" />
            EXPORT PDF SUMMARY
          </button>
        </div>
      </header>

      {/* Main Content Workspace Layout */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Dashboard Analytics Bar */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-mono tracking-wider font-bold block">ACTIVE PROFILES RECORDS</span>
              <p className="text-base font-bold text-slate-900">{totalThreats} Players Scouting Checked</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-red-50 text-red-650 rounded flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-mono tracking-wider font-bold block">CRITICAL BATTER THREATS</span>
              <p className="text-base font-bold text-red-600">{highRiskBatsmenCount} Threat (Avg &gt; 30)</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-green-50 text-green-650 rounded flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-mono tracking-wider font-bold block">STELLAR CONTAINMENT BOWLERS</span>
              <p className="text-base font-bold text-green-650">{highRiskBowlersCount} Control (Econ &lt;= 7.5)</p>
            </div>
          </div>
        </section>

        {/* Main interactive directory board card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-4 sm:p-6 space-y-6">
          
          {/* Tabs switch & Search controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pb-4 border-b border-slate-200">
            
            {/* Tab buttons */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit border border-slate-250">
              <button
                type="button"
                onClick={() => setActiveTab('batsmen')}
                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
                  ${activeTab === 'batsmen' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'}`}
              >
                Opponent Batsmen ({batsmen.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bowlers')}
                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
                  ${activeTab === 'bowlers' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'}`}
              >
                Opponent Bowlers ({bowlers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer
                  ${activeTab === 'guide' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'}`}
              >
                📖 How to Use
              </button>
            </div>

            {/* Search box inline (hidden in Guide mode) */}
            {activeTab !== 'guide' ? (
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'batsmen' ? "Search batsman by name or weakness..." : "Search bowler by style or weakness..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 px-3 py-2 pl-9 text-xs rounded text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 hover:text-slate-900 bg-white border border-slate-250 p-0.5 px-1.5 rounded uppercase font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                StrikeScan v4.1 operational guidelines
              </div>
            )}

          </div>

          {/* Active Overlay: Add New Form modal */}
          {isAddingNew && (
            <div className="pt-2 animate-fadeIn relative z-40">
              <PlayerForm
                onAddBatsman={handleAddBatsman}
                onAddBowler={handleAddBowler}
                onCancel={() => setIsAddingNew(false)}
              />
            </div>
          )}

          {/* Active Lists display */}
          {!isAddingNew && (
            <>
              {activeTab === 'batsmen' ? (
                // Batsmen Scouting List
                filteredBatsmen.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                    <CircleAlert className="w-10 h-10 text-slate-400 animate-pulse" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">No active batsman profiles found</p>
                      <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or manually establish a new profile card above.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredBatsmen.map((batsman) => (
                      <div 
                        key={batsman.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 shadow-sm hover:shadow transition-all flex flex-col justify-between space-y-4 text-slate-800"
                      >
                        {/* Upper card title row */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-blue-600 font-bold">
                              Opponent Batsman
                            </span>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              {batsman.name}
                              {batsman.customAdded && (
                                <span className="text-[8px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded uppercase border border-green-200 leading-none">
                                  CUSTOM REGISTERED
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-slate-500">{batsman.battingHand} Handed Batsman Stance</p>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveVideoScoutPlayer({ id: batsman.id, type: 'batsman' })}
                              className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 border border-blue-250 transition text-[10px] text-blue-800 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                              title="AI Video Scouting and biomechanical evaluation"
                            >
                              <Video className="w-3.5 h-3.5" />
                              AI VIDEO
                            </button>
                            <button
                              type="button"
                              onClick={() => setPrintingPlayer({ batsman })}
                              className="p-1.5 rounded bg-slate-100 hover:bg-slate-205 border border-slate-200 transition text-[10px] text-slate-705 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                              title="Generate PDF Dossier View"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              PDF SUMMARY
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBatsman(batsman.id, batsman.name)}
                              className="p-1.5 rounded bg-slate-100 hover:bg-red-50 hover:text-red-650 border border-slate-200 hover:border-red-200 transition text-slate-500 cursor-pointer"
                              title="Delete Opponent Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Mid Row: Statistics ticker */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-2 rounded font-mono text-center">
                          <div>
                            <span className="text-[8px] text-slate-400 uppercase font-bold block">Matches</span>
                            <span className="text-xs font-bold text-slate-800">{batsman.stats.matches}</span>
                          </div>
                          <div className="border-l border-r border-slate-200">
                            <span className="text-[8px] text-slate-400 uppercase font-bold block">Average</span>
                            <span className="text-xs font-bold text-red-650 font-sans">{batsman.stats.average ?? 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 uppercase font-bold block">SR</span>
                            <span className="text-xs font-bold text-slate-800">{batsman.stats.strikeRate}</span>
                          </div>
                        </div>

                        {/* Mid Row 2: Weaknesses & target shots columns */}
                        <div className="space-y-3 pt-2">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Identified Weakness Triggers</span>
                            <div className="flex flex-wrap gap-1">
                              {batsman.weaknessTypes.map((tag, idx) => (
                                <span key={idx} className="bg-red-50 text-red-700 border border-red-100 text-[10px] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wide">
                                  ⚠ {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Vulnerable Shot Patterns</span>
                            <div className="flex flex-wrap gap-1">
                              {batsman.vulnerableShots.map((shot, idx) => (
                                <span key={idx} className="bg-amber-50 text-amber-805 border border-amber-200 text-[10px] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wide">
                                  ● {shot}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Visual blueprints box toggle/display */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="space-y-1 border-r border-slate-200 pr-2">
                            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Pitch Target Zone</span>
                            <div className="rounded overflow-hidden">
                              <PitchMap
                                selectedZone={batsman.pitchMapWeakness}
                                readOnly={true}
                                type="batsman"
                              />
                            </div>
                          </div>

                          <div className="space-y-1 pl-1">
                            <div className="flex justify-between items-center pb-0.5">
                              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Defensive Trap Placement</span>
                              <button
                                type="button"
                                onClick={() => setCustomizingFieldBatsman(batsman)}
                                className="text-[9px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer hover:underline transition"
                                title="Edit Field Placement"
                              >
                                ✏ EDIT PLACEMENT
                              </button>
                            </div>
                            <div className="rounded overflow-hidden">
                              <FieldPlanner
                                presetKey={batsman.tacticalFieldSetup}
                                battingHand={batsman.battingHand}
                                readOnly={true}
                                customFielders={batsman.customFielders}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Video analysis summary block */}
                        {batsman.videoAnalysis ? (
                          <div className="bg-indigo-50 border border-indigo-150 p-3 rounded-lg flex flex-col space-y-1.5 text-slate-800">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-extrabold text-indigo-850 uppercase tracking-wider flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                🎥 AI Video Scouting Active
                              </span>
                              <span className="text-[8px] text-slate-400 font-mono">
                                Reviewed: {batsman.videoAnalysis.uploadedAt}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-serif leading-normal italic">
                              "{batsman.videoAnalysis.primaryVerdict}"
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {batsman.videoAnalysis.weaknessesDetected.map((w, idx) => (
                                <span key={idx} className="bg-indigo-100/70 text-indigo-900 text-[9px] px-2 py-0.5 rounded font-mono font-medium">
                                  ⚡ {w}
                                </span>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveVideoScoutPlayer({ id: batsman.id, type: 'batsman' })}
                              className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 mt-1 uppercase text-left w-fit flex items-center gap-1 cursor-pointer"
                            >
                              Configure / Update Video ➔
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-55/60 border border-slate-200 border-dashed p-3 rounded-lg">
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                              <Video className="w-4 h-4 text-slate-400" />
                              No tactical match recordings analyzed.
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveVideoScoutPlayer({ id: batsman.id, type: 'batsman' })}
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold uppercase cursor-pointer hover:underline"
                            >
                              + ANALYZE VIDEO
                            </button>
                          </div>
                        )}

                        {/* Sticky analysis note */}
                        <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400 shadow-xs">
                          <span className="text-[9px] font-bold text-amber-800 uppercase block tracking-wider mb-1">Scouting Field Directives & Strategy</span>
                          <p className="text-xs text-slate-700 leading-relaxed italic font-serif">"{batsman.notes}"</p>
                        </div>

                      </div>
                    ))}
                  </div>
                )
              ) : activeTab === 'bowlers' ? (
                // Bowlers Scouting List
                filteredBowlers.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                    <CircleAlert className="w-10 h-10 text-slate-400 animate-pulse" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">No active bowler profiles found</p>
                      <p className="text-xs text-slate-500 mt-1">Try relaxing your search tags or manually establish a new profile card above.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredBowlers.map((bowler) => (
                      <div 
                        key={bowler.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 shadow-sm hover:shadow transition-all flex flex-col justify-between space-y-4 text-slate-800"
                      >
                        {/* Upper card title row */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[#10b981] font-bold">
                              Opponent Bowler
                            </span>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              {bowler.name}
                              {bowler.customAdded && (
                                <span className="text-[8px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded uppercase border border-green-200 leading-none font-sans">
                                  CUSTOM REGISTERED
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-slate-500">{bowler.bowlingStyle} Bowling Style Delivery</p>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveVideoScoutPlayer({ id: bowler.id, type: 'bowler' })}
                              className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 border border-blue-250 transition text-[10px] text-blue-800 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                              title="AI Video Scouting and biomechanical evaluation"
                            >
                              <Video className="w-3.5 h-3.5" />
                              AI VIDEO
                            </button>
                            <button
                              type="button"
                              onClick={() => setPrintingPlayer({ bowler })}
                              className="p-1.5 rounded bg-slate-100 hover:bg-slate-205 border border-slate-200 transition text-[10px] text-slate-705 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                              title="Generate PDF Dossier View"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              PDF SUMMARY
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBowler(bowler.id, bowler.name)}
                              className="p-1.5 rounded bg-slate-100 hover:bg-red-50 hover:text-red-650 border border-slate-200 hover:border-red-200 transition text-slate-500 cursor-pointer"
                              title="Delete Opponent Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Mid Row: Statistics ticker */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded font-mono text-center">
                          <div>
                            <span className="text-[8px] text-slate-400 uppercase font-bold block">Matches</span>
                            <span className="text-xs font-bold text-slate-800">{bowler.stats.matches}</span>
                          </div>
                          <div className="border-l border-r border-slate-200">
                            <span className="text-[8px] text-slate-400 uppercase font-bold block">Economy</span>
                            <span className="text-xs font-bold text-green-700">{bowler.stats.economy ?? 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 uppercase font-bold block">Bowl SR</span>
                            <span className="text-xs font-bold text-slate-800">{bowler.stats.strikeRate}</span>
                          </div>
                        </div>

                        {/* Mid Row 2: Weaknesses & target shots columns */}
                        <div className="space-y-3 pt-2">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Deliveries / Grip Failures (Weaknesses)</span>
                            <div className="flex flex-wrap gap-1">
                              {bowler.weaknessTypes.map((tag, idx) => (
                                <span key={idx} className="bg-red-50 text-red-700 border border-red-100 text-[10px] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wide">
                                  ⚠ {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Optimal Shots to Exploit Bowler</span>
                            <div className="flex flex-wrap gap-1">
                              {bowler.targetShots.map((shot, idx) => (
                                <span key={idx} className="bg-green-50 text-green-705 border border-green-200 text-[10px] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wide">
                                  ☝ {shot}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Pitch Map leak zones */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 font-sans">
                          <div className="space-y-1 col-span-2">
                            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Frequent Run Leak Zone</span>
                            <div className="flex gap-4 items-center">
                              <div className="scale-90 origin-top-left max-w-[140px] flex-1 rounded overflow-hidden">
                                <PitchMap
                                  selectedZone={bowler.pitchMapLeak}
                                  readOnly={true}
                                  type="bowler"
                                />
                              </div>
                              <div className="text-[11px] text-slate-650 leading-relaxed italic border-l border-slate-200 pl-3">
                                <span className="text-xs font-semibold text-amber-605 uppercase block tracking-wider not-italic mb-0.5">Counter Attack Plan:</span>
                                Target this zone under match conditions as they struggle to hit consistency there.
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Video analysis summary block */}
                        {bowler.videoAnalysis ? (
                          <div className="bg-indigo-50 border border-indigo-150 p-3 rounded-lg flex flex-col space-y-1.5 text-slate-800">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-extrabold text-indigo-850 uppercase tracking-wider flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                🎥 AI Video Scouting Active
                              </span>
                              <span className="text-[8px] text-slate-400 font-mono">
                                Reviewed: {bowler.videoAnalysis.uploadedAt}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-705 font-serif leading-normal italic">
                              "{bowler.videoAnalysis.primaryVerdict}"
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {bowler.videoAnalysis.weaknessesDetected.map((w, idx) => (
                                <span key={idx} className="bg-indigo-100/70 text-indigo-900 text-[9px] px-2 py-0.5 rounded font-mono font-medium">
                                  ⚡ {w}
                                </span>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveVideoScoutPlayer({ id: bowler.id, type: 'bowler' })}
                              className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 mt-1 uppercase text-left w-fit flex items-center gap-1 cursor-pointer"
                            >
                              Configure / Update Video ➔
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-55/60 border border-slate-200 border-dashed p-3 rounded-lg">
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                              <Video className="w-4 h-4 text-slate-400" />
                              No tactical match recordings analyzed.
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveVideoScoutPlayer({ id: bowler.id, type: 'bowler' })}
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold uppercase cursor-pointer hover:underline"
                            >
                              + ANALYZE VIDEO
                            </button>
                          </div>
                        )}

                        {/* Operational directive memo notes */}
                        <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400 shadow-xs">
                          <span className="text-[9px] font-bold text-amber-800 uppercase block tracking-wider mb-1">Counter Tactics Briefing</span>
                          <p className="text-xs text-slate-705 leading-relaxed italic font-serif">"{bowler.notes}"</p>
                        </div>

                      </div>
                    ))}
                  </div>
                )
              ) : (
                // How to Use App Tab Content
                <div className="space-y-6 max-w-4xl mx-auto py-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">StrikeScan Operating &amp; Briefing Guide</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Learn how to identify opponent weaknesses, design customized pitch targets and boundary trap layouts, and generate publication-quality PDF threat dossiers for coaching staffs.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                        <span className="w-6 h-6 rounded bg-slate-100 font-mono text-xs font-bold flex items-center justify-center text-slate-800">1</span>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Registering Opponent Data</h4>
                      </div>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        Click the <strong className="text-blue-600">+ ADD MANUAL DATA</strong> button in the top menu to create a new profile. Specify their batting hand or bowling orientation, history of matches, and metrics.
                      </p>
                      <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 font-serif italic">
                        <li>Register active batting averages, strike rates, or bowing economies.</li>
                        <li>Add customized, searchable tags for primary triggers and vulnerable shots.</li>
                      </ul>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                        <span className="w-6 h-6 rounded bg-slate-100 font-mono text-xs font-bold flex items-center justify-center text-slate-800">2</span>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Visual Blueprint Mapping</h4>
                      </div>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        Use the built-in blueprint tools to pinpoint vulnerable strike sectors and place defensive boundary cords.
                      </p>
                      <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 font-serif italic">
                        <li><strong>Pitch Target Mode:</strong> Map exactly where to bowl (e.g. good-outside-off).</li>
                        <li><strong>Fielder Cordons:</strong> Deploy custom ring setups (aggressive off-side sweep, short-leg traps) tailored to combat specific opponent traits.</li>
                      </ul>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                        <span className="w-6 h-6 rounded bg-slate-100 font-mono text-xs font-bold flex items-center justify-center text-slate-800">3</span>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Dossier PDF Printing</h4>
                      </div>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        Compile field directive memos and printable blueprints into neat PDFs to hand out before the match.
                      </p>
                      <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 font-serif italic">
                        <li>Click <strong>PDF SUMMARY</strong> on any active card to open a custom high-fidelity printing preview canvas.</li>
                        <li>Export high-contrast landscape briefing pages featuring pitch diagrams and fielding plans.</li>
                      </ul>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                        <span className="w-6 h-6 rounded bg-slate-100 font-mono text-xs font-bold flex items-center justify-center text-slate-800">4</span>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Data Maintenance &amp; Defaults</h4>
                      </div>
                      <p className="text-xs text-slate-605 leading-relaxed">
                        Restore default mock profiles or clear obsolete records anytime using custom dialogues.
                      </p>
                      <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 font-serif italic">
                        <li>A quick reset button restores standard profiles for training and sandboxing.</li>
                        <li>Deletions are protected by customized confirmation overlays.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2 font-sans">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-amber-850 flex items-center gap-1.5">
                      💡 Pro Scout Tip
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Always map <strong>vulnerable shot types</strong> corresponding to your target pitch zone. For instance, if a batsman has high cut-shot vulnerability, pair a short-of-length pitch target zone outside off-stump with an aggressive deep gully / backward point cordon.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-center text-xs text-slate-400 font-mono space-y-1">
        <div>STRIKESCAN PRO INTELLIGENCE BRIEFING PLATFORM — VERSION v4.1</div>
        <div>HIGH DENSITY LAYOUT PARADIGM EXECUTED IN REACT & TAILWIND CSS</div>
        <div>OPPOSITION INTEL SYSTEM • OP-DATA PERSISTS LOCALLY</div>
      </footer>

      {/* Interactive fielding placements customization modal */}
      {customizingFieldBatsman && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-850 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Custom Field placement</span>
                  <span className="text-[9px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20 uppercase font-mono tracking-wider font-semibold">
                    Interactive Editor
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Reposition fielders for defending matches against <strong>{customizingFieldBatsman.name}</strong> ({customizingFieldBatsman.battingHand})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomizingFieldBatsman(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer text-xs font-bold bg-slate-800 hover:bg-slate-750 py-1 px-2 rounded-md"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <FieldPlanner
                presetKey={tempFieldSetup}
                onSelectPreset={setTempFieldSetup}
                battingHand={customizingFieldBatsman.battingHand}
                customFielders={tempFielders.length === 9 ? tempFielders : undefined}
                onChangeCustomFielders={setTempFielders}
                readOnly={false}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCustomizingFieldBatsman(null)}
                className="px-3.5 py-1.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-755 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveFieldLayout(customizingFieldBatsman.id, tempFielders, tempFieldSetup);
                }}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Save Custom Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Video analyst overlay modal */}
      {activeVideoScoutPlayer && (
        (() => {
          const details = activeVideoScoutPlayer.type === 'batsman'
            ? batsmen.find(b => b.id === activeVideoScoutPlayer.id)
            : bowlers.find(b => b.id === activeVideoScoutPlayer.id);
          
          if (!details) return null;
          
          return (
            <VideoAnalystModal
              playerName={details.name}
              profileType={activeVideoScoutPlayer.type}
              orientation={
                activeVideoScoutPlayer.type === 'batsman'
                  ? (details as OpponentBatsman).battingHand
                  : (details as OpponentBowler).bowlingStyle
              }
              currentAnalysis={details.videoAnalysis}
              onClose={() => setActiveVideoScoutPlayer(null)}
              onSaveAnalysis={(analysis, attrs) => {
                handleSaveVideoAnalysis(activeVideoScoutPlayer.id, activeVideoScoutPlayer.type, analysis, attrs);
              }}
              onRemoveAnalysis={() => {
                handleRemoveVideoAnalysis(activeVideoScoutPlayer.id, activeVideoScoutPlayer.type);
              }}
            />
          );
        })()
      )}

      {/* Printable / dossier generation preview overlay board */}
      {printingPlayer && (
        <PrintReport
          batsman={printingPlayer.batsman}
          bowler={printingPlayer.bowler}
          allBatsmen={printingPlayer.allBatsmen}
          allBowlers={printingPlayer.allBowlers}
          onClose={() => setPrintingPlayer(null)}
        />
      )}

      {/* High Density custom confirmation dialog overlay */}
      {confirmState && confirmState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-xl overflow-hidden p-6 space-y-4 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{confirmState.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{confirmState.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-150">
              <button
                type="button"
                onClick={() => setConfirmState(null)}
                className="px-4 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmState.onConfirm}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
