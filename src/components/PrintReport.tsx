import React from 'react';
import { OpponentBatsman, OpponentBowler } from '../types';
import { PitchMap } from './PitchMap';
import { FieldPlanner } from './FieldPlanner';
import { Printer, X, Shield, Calendar, Award, FileText, BookOpen } from 'lucide-react';

interface PrintReportProps {
  batsman?: OpponentBatsman;
  bowler?: OpponentBowler;
  allBatsmen?: OpponentBatsman[];
  allBowlers?: OpponentBowler[];
  onClose: () => void;
}

const PlayerSection: React.FC<{
  player: OpponentBatsman | OpponentBowler;
  isBatsman: boolean;
  currentDate: string;
}> = ({ player, isBatsman, currentDate }) => {
  return (
    <div className="print:break-after-page pb-12 border-b border-slate-200 last:border-b-0 last:pb-0 print:border-none">
      {/* Dossier Header watermark */}
      <div className="border-[4px] border-double border-slate-400 p-6 rounded-lg relative overflow-hidden bg-slate-50/50">
        <div className="absolute top-4 right-4 uppercase tracking-[0.15em] font-mono text-[9px] text-slate-400 font-bold border border-slate-300 px-2 py-0.5 rounded">
          CONFIDENTIAL / PRO-GRADE
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#0ea5e9] uppercase font-bold">
              OPPOSITION SCOUTING DIVISION
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 tracking-tight mt-1">
              {player.name}
            </h2>
            <span className="inline-block bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mt-2 font-sans font-semibold">
              Type: {isBatsman ? `Batsman (${(player as OpponentBatsman).battingHand} Hand)` : `Bowler (${(player as OpponentBowler).bowlingStyle})`}
            </span>
          </div>

          <div className="text-left md:text-right text-xs text-slate-500 font-mono space-y-0.5">
            <div>REPORT REFERENCE ID: <span className="text-slate-900 font-bold">CR-{player.id.toUpperCase()}</span></div>
            <div>COMPILED ON: <span className="text-slate-900 font-bold">{currentDate}</span></div>
            <div>STATION: <span className="text-slate-900 font-bold font-mono">STRIKESCAN PRO</span></div>
          </div>
        </div>
      </div>

      {/* Tactical Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        
        {/* Main Dossier Details Column */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Historical Statistics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 border-b pb-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-900" />
              Performance Metrics Tracker
            </h3>
            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-center border-r border-slate-200">
                <span className="text-[9px] uppercase text-slate-400 font-mono font-bold">Matches</span>
                <p className="text-xl font-bold font-serif text-slate-900">{player.stats.matches}</p>
              </div>
              {isBatsman ? (
                <div className="text-center border-r border-slate-200">
                  <span className="text-[9px] uppercase text-slate-400 font-mono font-bold">Average</span>
                  <p className="text-xl font-bold font-serif text-slate-900">{(player as OpponentBatsman).stats.average || 'N/A'}</p>
                </div>
              ) : (
                <div className="text-center border-r border-slate-200">
                  <span className="text-[9px] uppercase text-slate-400 font-mono font-bold">Economy</span>
                  <p className="text-xl font-bold font-serif text-slate-900">{(player as OpponentBowler).stats.economy || 'N/A'}</p>
                </div>
              )}
              <div className="text-center">
                <span className="text-[9px] uppercase text-slate-400 font-mono font-bold">Strike Rate</span>
                <p className="text-xl font-bold font-serif text-slate-900">{player.stats.strikeRate}</p>
              </div>
            </div>
          </div>

          {/* Strategic Weakness Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 border-b pb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-900" />
              Vulnerability Assessment Indicators
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {player.weaknessTypes.map((weakness, i) => (
                <span 
                  key={i} 
                  className="bg-rose-50 text-red-750 border border-rose-200 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide"
                >
                  ⚠ {weakness}
                </span>
              ))}
            </div>
          </div>

          {/* Targeted Shot Strategy */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 border-b pb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-900" />
              {isBatsman ? 'Vulnerable Shot Behaviors' : 'Recommended Attack Paths & Shot Controls'}
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {isBatsman 
                ? (player as OpponentBatsman).vulnerableShots.map((shot, i) => (
                    <span key={i} className="bg-amber-50 text-amber-850 border border-amber-200 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide">
                      ● {shot}
                    </span>
                  ))
                : (player as OpponentBowler).targetShots.map((shot, i) => (
                    <span key={i} className="bg-green-50 text-green-800 border border-green-200 px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide">
                      ☝ {shot}
                    </span>
                  ))
              }
            </div>
          </div>

          {/* Coaching Directives */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 border-b pb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-900" />
              Operational Field Briefing &amp; Directives
            </h3>
            <div className="bg-[#fdfbf7] border-l-4 border-[#b45309] p-5 rounded-r-lg space-y-2 relative shadow-sm">
              <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-amber-800">COACH BRIEFING:</span>
              <p className="text-xs font-serif text-slate-700 leading-relaxed italic whitespace-pre-wrap">
                "{player.notes}"
              </p>
            </div>
          </div>

        </div>

        {/* Graphical Diagrams Column */}
        <div className="space-y-8 border-l border-slate-100 pl-4 print:border-none print:pl-0">
          
          {/* Pitch Target Location */}
          <div className="space-y-2 text-center">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500">
              {isBatsman ? 'TARGET BOWLING SECTOR' : 'LEAK AREA ZONE'}
            </h3>
            <div className="border border-slate-200 p-2 rounded-lg aspect-[5/8] overflow-hidden bg-white max-w-[200px] mx-auto print:max-w-none">
              <PitchMap
                selectedZone={isBatsman ? (player as OpponentBatsman).pitchMapWeakness : (player as OpponentBowler).pitchMapLeak}
                readOnly={true}
                type={isBatsman ? 'batsman' : 'bowler'}
              />
            </div>
          </div>

          {/* Field placement structure (Only relevant for Batsmen) */}
          {isBatsman && (
            <div className="space-y-2 text-center">
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500">
                EXPLOITATIVE FIELD PLAN
              </h3>
              <div className="border border-slate-200 p-2 rounded-lg aspect-square overflow-hidden bg-white max-w-[200px] mx-auto print:max-w-none">
                <FieldPlanner
                  presetKey={(player as OpponentBatsman).tacticalFieldSetup}
                  battingHand={(player as OpponentBatsman).battingHand}
                  readOnly={true}
                  customFielders={(player as OpponentBatsman).customFielders}
                />
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Dossier Footer watermark */}
      <div className="mt-12 border-t border-dashed border-slate-300 pt-6 flex justify-between items-center text-[10px] font-mono text-slate-400">
        <div>DIVISION CODE: <span className="text-slate-600 font-mono">SCOUT-19</span></div>
        <div className="text-center font-bold text-[#ea580c] uppercase">APPROVED BY SCOUT COACH PANEL</div>
        <div>DRAFT REFERENCE VERSION: <span className="text-slate-600">ALPHA_V4.1</span></div>
      </div>
    </div>
  );
};

export const PrintReport: React.FC<PrintReportProps> = ({
  batsman,
  bowler,
  allBatsmen = [],
  allBowlers = [],
  onClose
}) => {
  const isBulk = allBatsmen.length > 0 || allBowlers.length > 0;
  const singlePlayer = batsman || bowler;

  if (!isBulk && !singlePlayer) return null;

  const handlePrintTrigger = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-y-auto flex flex-col print:relative print:bg-white print:text-black">
      
      {/* Top Banner Control Panel (Hidden during printing) */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 flex flex-wrap gap-4 justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              {isBulk ? 'Bulk Team Report Dossier Compiler' : 'Strategic Dossier Report Generator'}
            </h1>
            <p className="text-xs text-slate-400">
              {isBulk 
                ? `Compiling briefing pages for ${allBatsmen.length + allBowlers.length} players. Choose "Save as PDF" in print options.` 
                : 'Review print preview. Choose "Save as PDF" in your print destinations to export.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handlePrintTrigger}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print or Save as PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            Close Preview
          </button>
        </div>
      </div>

      {/* Main Printable Dossier Card Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-12 bg-white text-slate-900 shadow-2xl my-6 rounded-2xl print:shadow-none print:my-0 print:p-0 print:rounded-none space-y-16">
        
        {isBulk ? (
          <>
            {/* Title / Cover Sheet */}
            <div className="print:break-after-page border-[4px] border-double border-slate-400 p-12 rounded-lg relative overflow-hidden bg-slate-50/50 text-center space-y-6 flex flex-col justify-center min-h-[400px]">
              <div className="absolute top-4 right-4 uppercase tracking-[0.15em] font-mono text-[9px] text-slate-400 font-bold border border-slate-300 px-2 py-0.5 rounded">
                MASTER DOSSIER
              </div>
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#0ea5e9] uppercase font-bold block">
                  OPPOSITION SCOUTING DIVISION
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight">
                  TACTICAL MATCH INTEL BRIEFING
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                  Comprehensive opposition profile assessments, target pitching coordinates, vulnerabilities, and custom target ring setups aligned for squad preparation.
                </p>
              </div>
              
              <div className="pt-8 border-t border-slate-200 text-xs text-slate-500 font-mono max-w-xs mx-auto space-y-1">
                <div>TOTAL ASSESSED BATSMEN: <span className="text-slate-900 font-bold font-mono">{allBatsmen.length}</span></div>
                <div>TOTAL ASSESSED BOWLERS: <span className="text-slate-900 font-bold font-mono">{allBowlers.length}</span></div>
                <div>COMPILED ON: <span className="text-slate-900 font-bold font-mono">{currentDate}</span></div>
                <div className="text-[10px] text-slate-400 mt-2 font-sans italic">STATIONS: ALL COGNITIVE ANALYSIS NODES ONLINE</div>
              </div>
            </div>

            {/* Batsmen Sections */}
            {allBatsmen.map((b) => (
              <PlayerSection 
                key={b.id}
                player={b}
                isBatsman={true}
                currentDate={currentDate}
              />
            ))}

            {/* Bowlers Sections */}
            {allBowlers.map((b) => (
              <PlayerSection 
                key={b.id}
                player={b}
                isBatsman={false}
                currentDate={currentDate}
              />
            ))}
          </>
        ) : (
          singlePlayer && (
            <PlayerSection 
              player={singlePlayer}
              isBatsman={!!batsman}
              currentDate={currentDate}
            />
          )
        )}

      </div>
    </div>
  );
};
