import React, { useState } from 'react';
import { 
  Leaf, 
  Cpu, 
  FileText, 
  PlusCircle, 
  RefreshCw, 
  Activity, 
  Radio, 
  ShieldAlert, 
  Building2, 
  Server,
  Info,
  CheckCircle2,
  Trophy,
  Terminal,
  Award,
  Sliders
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { CampusMode } from '../../types';
import { api } from '../../services/api';

interface HeaderProps {
  onOpenManualEntry: () => void;
  onOpenKillerDemo: () => void;
  onOpenPitchMode: () => void;
  onOpenTelemetry: () => void;
  onOpenMethodology: () => void;
  onOpenCertificate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenManualEntry, 
  onOpenKillerDemo,
  onOpenPitchMode,
  onOpenTelemetry,
  onOpenMethodology,
  onOpenCertificate
}) => {
  const { 
    mode, 
    setMode, 
    scores, 
    anomalies, 
    killerDemoStep, 
    resetDemo,
    isBackendConnected
  } = useCampus();

  const [showModeBanner, setShowModeBanner] = useState<boolean>(true);

  const handleModeChange = (newMode: CampusMode) => {
    setMode(newMode);
    setShowModeBanner(true);
    if (isBackendConnected) {
      api.setMode(newMode).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-md">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand & College details */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 shadow-md shadow-emerald-950/50">
            <Leaf className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white m-0 flex items-center gap-1.5">
                GREENCORE <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">AI TWIN</span>
              </h1>
              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline-block border-l border-slate-700 pl-2">
                CB-SW-05 • HACKVERSE ’26
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <Building2 className="w-3 h-3 text-cyan-400" />
                Govt. College of Engg. Kalahandi (GCEK)
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-medium">Eco Club Sustainability Auditor</span>
            </div>
          </div>
        </div>

        {/* Center: Hybrid Mode Selector & Backend API status */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Hybrid Mode Selector */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/80 shadow-inner text-xs">
            <button
              onClick={() => handleModeChange('manual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                mode === 'manual' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40 ring-2 ring-amber-300' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="College A: 100% Manual Registers and Form Submissions (Zero IoT hardware required)"
            >
              <FileText className={`w-3.5 h-3.5 ${mode === 'manual' ? 'text-slate-950 font-bold' : 'text-amber-400'}`} />
              <span>College A: Manual</span>
              {mode === 'manual' && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
            </button>

            <button
              onClick={() => handleModeChange('hybrid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                mode === 'hybrid' 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40 ring-2 ring-emerald-300' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="College B: Hybrid - Telemetry Sub-meters + Manual Cafeteria / Survey Logs"
            >
              <Radio className={`w-3.5 h-3.5 ${mode === 'hybrid' ? 'text-slate-950 font-bold' : 'text-emerald-400'}`} />
              <span>College B: Hybrid</span>
              {mode === 'hybrid' && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
            </button>

            <button
              onClick={() => handleModeChange('iot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                mode === 'iot' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40 ring-2 ring-cyan-300' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="College C: Full Smart IoT & Autonomous Edge Gateways"
            >
              <Cpu className={`w-3.5 h-3.5 ${mode === 'iot' ? 'text-slate-950 font-bold' : 'text-cyan-400'}`} />
              <span>College C: Full IoT</span>
              {mode === 'iot' && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
            </button>
          </div>

          {/* Backend Connection Badge */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium ${
            isBackendConnected 
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`} title={isBackendConnected ? "Connected to Backend REST API (Port 5000)" : "Running in Standalone Client Mode"}>
            <Server className={`w-3 h-3 ${isBackendConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{isBackendConnected ? 'API: Live (5000)' : 'API: Local'}</span>
          </div>
        </div>

        {/* Right: Actions, Score pill, Killer Demo launcher */}
        <div className="flex items-center gap-2">
          {/* Live Score pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Score:</span>
            <span className={`text-base font-black ${
              scores.compositeScore >= 80 ? 'text-emerald-400' : scores.compositeScore >= 70 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {scores.compositeScore}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono font-bold" title="Data Confidence">
              ({scores.dataConfidence}% conf)
            </span>
            {anomalies.length > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                {anomalies.length} Anomaly
              </span>
            )}
          </div>

          {/* Manual Entry Button */}
          <button
            onClick={onOpenManualEntry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Data</span>
          </button>

          {/* Killer Demo Walkthrough Button */}
          <button
            onClick={onOpenKillerDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/50 transition-all hover:scale-105 active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-200" />
            <span>Killer Demo (Step {killerDemoStep}/8)</span>
          </button>

          {/* Reset Demo button */}
          <button
            onClick={resetDemo}
            title="Reset Campus to Baseline"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Winning Features Quick Access Toolbar */}
      <div className="bg-slate-900/60 border-t border-slate-800/60 px-4 lg:px-6 py-1.5 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            Winner Toolkit:
          </span>

          <button
            onClick={onOpenPitchMode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-[11px] shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-amber-300"
            title="Launch 3-Minute Hackathon Judge Pitch Presentation"
          >
            <Trophy className="w-3 h-3 fill-slate-950" />
            <span>Judge Pitch (3m)</span>
          </button>

          <button
            onClick={onOpenTelemetry}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-800/80 font-bold text-[11px] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Stream Live Modbus-TCP and LoRaWAN Telemetry Packets"
          >
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>Live Telemetry</span>
          </button>

          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-800/80 font-bold text-[11px] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Inspect Audited Mathematical Formulas and Adjust Weights"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span>Score Methodology</span>
          </button>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border border-emerald-800/80 font-bold text-[11px] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Inspect Cryptographic Certificate with Scannable QR Code"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Certificate (QR)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Audit Engine: NAAC 7.1.2 Compliant</span>
        </div>
      </div>

      {/* Dynamic Mode Confirmation & Explainer Strip */}
      {showModeBanner && (
        <div className={`px-4 lg:px-6 py-1.5 border-t text-xs flex items-center justify-between transition-colors ${
          mode === 'manual'
            ? 'bg-amber-950/60 border-amber-800/80 text-amber-200'
            : mode === 'iot'
            ? 'bg-cyan-950/60 border-cyan-800/80 text-cyan-200'
            : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
        }`}>
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>
                {mode === 'manual' && (
                  <>
                    <strong>College A Active (100% Manual Mode):</strong> Zero hardware required. Data captured via manual digital logs & photo dial proofs. Data Confidence recomputed to <strong>64%</strong>.
                  </>
                )}
                {mode === 'hybrid' && (
                  <>
                    <strong>College B Active (Hybrid Mode - Default):</strong> Telemetry sub-meters for key feeders + manual dining registers & student surveys. Data Confidence: <strong>91%</strong>.
                  </>
                )}
                {mode === 'iot' && (
                  <>
                    <strong>College C Active (Autonomous Full IoT):</strong> Automatic LoRaWAN flow meters, Modbus TCP gateways, smart optical bins, and RFID gate sensors. Data Confidence: <strong>98%</strong>.
                  </>
                )}
              </span>
            </div>
            <button
              onClick={() => setShowModeBanner(false)}
              className="text-[10px] uppercase font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/60"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
