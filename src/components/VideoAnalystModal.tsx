import React, { useState, useRef } from 'react';
import { 
  Video, UploadCloud, Sparkles, Cpu, PlayCircle, Check, Trash2, 
  RefreshCw, FileVideo, AlertCircle, Info, BookmarkCheck
} from 'lucide-react';
import { VideoAnalysis } from '../types';

interface VideoAnalystModalProps {
  playerName: string;
  profileType: 'batsman' | 'bowler';
  orientation: string; // battingHand or bowlingStyle
  currentAnalysis?: VideoAnalysis;
  onClose: () => void;
  onSaveAnalysis: (
    analysis: VideoAnalysis,
    updatedAttrs?: {
      weaknesses: string[];
      pitchMap: string;
      setupPreset?: string;
    }
  ) => void;
  onRemoveAnalysis: () => void;
}

export function VideoAnalystModal({
  playerName,
  profileType,
  orientation,
  currentAnalysis,
  onClose,
  onSaveAnalysis,
  onRemoveAnalysis
}: VideoAnalystModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Standby');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Results view (could be current one, or freshly fetched)
  const [scoutingResult, setScoutingResult] = useState<any>(currentAnalysis || null);
  const [applyToProfile, setApplyToProfile] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'mp4' || extension === 'avi') {
      setSelectedFile(file);
      setAnalysisError(null);
    } else {
      setAnalysisError('Unsupported format! Only MP4 or AVI visual video records are allowed.');
      setSelectedFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Run visual scouting via backend API
  const runAiAnalysis = async (simulate: boolean) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    const messages = [
      "Initializing AI Video stream...",
      "Extracting key biomechanics frame data...",
      "Decoding grip releases and stance triggers...",
      "Synthesizing threat indexes and vulnerabilities...",
      "Structuring scouting intelligence briefing..."
    ];
    
    let msgIndex = 0;
    setStatusMessage(messages[0]);
    
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setStatusMessage(messages[msgIndex]);
    }, 1200);

    try {
      let base64String = "";
      let fileName = "simulated_scout.mp4";
      let fileSize = 3500000;
      let fileType = "video/mp4";

      if (!simulate && selectedFile) {
        fileName = selectedFile.name;
        fileSize = selectedFile.size;
        fileType = selectedFile.type;
        
        // Convert real file to base64
        base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("File reading failed"));
          reader.readAsDataURL(selectedFile);
        });
      }

      const res = await fetch("/api/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoBase64: base64String,
          fileName,
          mimeType: fileType,
          playerName,
          profileType,
          orientation,
          isSimulated: simulate
        })
      });

      clearInterval(interval);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned error (${res.status})`);
      }

      const report = await res.json();
      
      const newAnalysis: VideoAnalysis = {
        fileName,
        fileSize,
        uploadedAt: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        primaryVerdict: report.primaryVerdict,
        weaknessesDetected: report.weaknessesDetected,
        recommendedStrategy: report.recommendedStrategy
      };

      setScoutingResult({
        ...newAnalysis,
        // Carry internal suggestions to auto-apply
        pitchTargetZone: report.pitchTargetZone,
        tacticalFieldSetup: report.tacticalFieldSetup
      });

    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setAnalysisError(err.message || "Failed to process video analysis. Please check your networks.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndApply = () => {
    if (!scoutingResult) return;
    
    // Save metadata
    const analysisToSave: VideoAnalysis = {
      fileName: scoutingResult.fileName,
      fileSize: scoutingResult.fileSize,
      uploadedAt: scoutingResult.uploadedAt,
      primaryVerdict: scoutingResult.primaryVerdict,
      weaknessesDetected: scoutingResult.weaknessesDetected,
      recommendedStrategy: scoutingResult.recommendedStrategy
    };

    let updatedAttrs = undefined;
    if (applyToProfile) {
      updatedAttrs = {
        weaknesses: scoutingResult.weaknessesDetected,
        pitchMap: scoutingResult.pitchTargetZone,
        setupPreset: scoutingResult.tacticalFieldSetup || undefined
      };
    }

    onSaveAnalysis(analysisToSave, updatedAttrs);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col text-slate-800">
        
        {/* Header */}
        <div className="bg-[#1E293B] border-b border-slate-700 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <span>AI Opposition Video Analyst</span>
                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider font-semibold">
                  MP4 / AVI SUPPORT
                </span>
              </h3>
              <p className="text-[10px] text-slate-300">
                Evaluating gameplay recordings for {profileType} <strong>{playerName}</strong> ({orientation})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer font-bold text-xs bg-slate-800 hover:bg-slate-700 w-7 h-7 flex items-center justify-center rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">

          {/* Tabular Error alert */}
          {analysisError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded text-red-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
              <div>
                <span className="font-bold block">Scouting Link Failed</span>
                <span className="leading-relaxed">{analysisError}</span>
              </div>
            </div>
          )}

          {/* Main State Panel Row */}
          {!scoutingResult ? (
            // STATE 1: Upload Dropzone & triggers
            <div className="space-y-4">
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3 transition cursor-pointer duration-150
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".mp4,.avi" 
                  className="hidden" 
                />
                
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Drag and drop your opponent video file here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports high-contrast MP4 or AVI match records up to 50MB
                  </p>
                </div>

                <button
                  type="button"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs uppercase"
                >
                  Choose File
                </button>
              </div>

              {/* Selected file card information */}
              {selectedFile && (
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FileVideo className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-md">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Size: {formatBytes(selectedFile.size)} • File type confirmed
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-700 bg-white border border-slate-200 px-1.5 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* AI Trigger button rules */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  disabled={!selectedFile || isAnalyzing}
                  onClick={() => runAiAnalysis(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded font-bold text-xs uppercase tracking-wider text-white shadow-sm transition-all
                    ${!selectedFile || isAnalyzing
                      ? 'bg-slate-350 cursor-not-allowed text-slate-100'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow cursor-pointer'}`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {statusMessage}
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      Analyze Uploaded Video (Gemini AI)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => runAiAnalysis(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  ✨ Run Automated Demo Analysis
                </button>
              </div>

              {/* Quick tip info */}
              <div className="bg-slate-100 p-3 rounded text-[11px] text-slate-500 flex items-start gap-2 border border-slate-200">
                <Info className="w-4 h-4 flex-shrink-0 text-slate-400 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Testing Tip:</strong> If you don't have a live match video file handy, click the <strong>Run Automated Demo Analysis</strong> button. StrikeScan will generate a synthetic pro-grade tactical analysis immediately.
                </p>
              </div>
            </div>
          ) : (
            // STATE 2: AI Report View
            <div className="space-y-5">
              
              {/* Report summary overview banner */}
              <div className="bg-[#1E293B] text-white p-4.5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-10 h-10 text-blue-400" />
                  <div>
                    <span className="text-[9px] font-mono bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest block w-fit mb-0.5">
                      Completed AI Review
                    </span>
                    <h4 className="text-xs font-bold text-white max-w-xs sm:max-w-md truncate">
                      {scoutingResult.fileName}
                    </h4>
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-300">
                  <p>Uploaded: {scoutingResult.uploadedAt}</p>
                  <p>Size: {formatBytes(scoutingResult.fileSize)}</p>
                </div>
              </div>

              {/* 1. Tactical Verdict */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Biomechanical Critique &amp; Verdict
                </h4>
                <div className="bg-blue-50/50 p-4 border border-blue-150 rounded-lg text-xs leading-relaxed font-serif text-slate-705 italic shadow-xs">
                  "{scoutingResult.primaryVerdict}"
                </div>
              </div>

              {/* 2. Detected Weaknesses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-505" />
                    Opponent Weaknesses
                  </h4>
                  <div className="space-y-2">
                    {scoutingResult.weaknessesDetected.map((w: string, i: number) => (
                      <div key={i} className="bg-red-50/50 border border-red-100 p-3 rounded flex gap-2 w-full text-xs text-red-900">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-[10px] font-bold flex items-center justify-center flex-shrink-0 text-red-600 mt-0.5">
                          {i+1}
                        </span>
                        <p className="leading-relaxed font-semibold">{w}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Tactical Plan */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    Exploitation Counter-Strategy
                  </h4>
                  <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-lg text-xs leading-relaxed text-slate-700 h-[calc(100%-1.75rem)] flex flex-col justify-center">
                    <p className="font-medium italic leading-relaxed">
                      {scoutingResult.recommendedStrategy}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Automated layout injection options */}
              {(scoutingResult.pitchTargetZone || scoutingResult.tacticalFieldSetup) && (
                <div className="border border-indigo-150 bg-indigo-50/40 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <BookmarkCheck className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-tight text-indigo-950">
                        Automated StrikeScan System Settings
                      </h4>
                      <p className="text-[10px] text-indigo-700">
                        Gemini has identified matching pitch zones and field preset overlays.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono p-2.5 bg-white border border-indigo-100 rounded">
                    {scoutingResult.pitchTargetZone && (
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Recommended target zone:</span>
                        <span className="text-indigo-900 font-bold uppercase text-[10px]">
                          🎯 {scoutingResult.pitchTargetZone.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                    {scoutingResult.tacticalFieldSetup && (
                      <div className="space-y-0.5 pl-4 border-l border-slate-100">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Recommended fielding preset:</span>
                        <span className="text-indigo-900 font-bold uppercase text-[10px]">
                          🛡 {scoutingResult.tacticalFieldSetup.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={applyToProfile}
                      onChange={(e) => setApplyToProfile(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700 leading-none">
                      Integrate and push these AI mapping suggestions to the profile directly
                    </span>
                  </label>
                </div>
              )}

              {/* Re-scout option */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setScoutingResult(null);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Scan Different Video Segment
                </button>

                <button
                  type="button"
                  onClick={onRemoveAnalysis}
                  className="text-xs font-bold text-red-650 hover:text-red-800 hover:bg-red-50 py-1 px-2.5 rounded transition flex items-center gap-1 border border-transparent hover:border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Discard and Wipe Analysis
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 font-bold uppercase tracking-wider hover:bg-slate-250 text-slate-705 text-xs rounded transition"
          >
            Close Analyst
          </button>
          
          {scoutingResult && (
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs rounded transition shadow-sm hover:shadow"
            >
              Save &amp; Bind to Player
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
