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
  Sliders,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ExternalLink
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
  onOpenQuickGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenManualEntry, 
  onOpenKillerDemo,
  onOpenPitchMode,
  onOpenTelemetry,
  onOpenMethodology,
  onOpenCertificate,
  onOpenQuickGuide
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

  const [showModeBanner, setShowModeBanner] = useState<boolean>(false);
  const [showToolsMenu, setShowToolsMenu] = useState<boolean>(false);

  const handleModeChange = (newMode: CampusMode) => {
    setMode(newMode);
    setShowModeBanner(true);
    if (isBackendConnected) {
      api.setMode(newMode).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      {/* Main Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand & Institution */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 shadow-md shadow-emerald-950/50 shrink-0">
            <Leaf className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white m-0 flex items-center gap-1.5">
                GREENCORE <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">AI TWIN</span>
              </h1>
              <span className="text-xs text-slate-500 hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                Govt. College of Engg. Kalahandi
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Live Campus Sustainability System
              </span>
              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="text-slate-400 hidden md:inline">NAAC 7.1.2 Compliant</span>
            </div>
          </div>
        </div>

        {/* Center: Simplified Campus Tier Selector (College A / B / C) */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start md:self-auto text-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase px-2 hidden lg:inline">
            Campus Tier:
          </span>

          <button
            onClick={() => handleModeChange('manual')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'manual' 
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-300' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Tier 1: 100% Manual Forms & Register Slips (Zero IoT cost, ₹0 budget)"
          >
            <FileText className={`w-3.5 h-3.5 ${mode === 'manual' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>Tier 1: Manual</span>
          </button>

          <button
            onClick={() => handleModeChange('hybrid')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'hybrid' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm ring-1 ring-emerald-300' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Tier 2: Hybrid Mode (Sub-meters for key buildings + manual dining logs - 91% confidence)"
          >
            <Radio className={`w-3.5 h-3.5 ${mode === 'hybrid' ? 'text-slate-950' : 'text-emerald-400'}`} />
            <span>Tier 2: Hybrid</span>
          </button>

          <button
            onClick={() => handleModeChange('iot')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'iot' 
                ? 'bg-cyan-500 text-slate-950 shadow-sm ring-1 ring-cyan-300' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Tier 3: Full Smart IoT (LoRaWAN flow meters, Modbus electrical gateways - 98% confidence)"
          >
            <Cpu className={`w-3.5 h-3.5 ${mode === 'iot' ? 'text-slate-950' : 'text-cyan-400'}`} />
            <span>Tier 3: Full IoT</span>
          </button>
        </div>

        {/* Right: Key Actions & Quick Menu */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Real-time GreenScore Pill */}
          <div 
            onClick={onOpenMethodology}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800/90 rounded-xl border border-slate-800 cursor-pointer transition-all shadow-sm"
            title="Click to see how the GreenScore is calculated"
          >
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none">GreenScore</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-base font-black leading-none ${
                  scores.compositeScore >= 80 ? 'text-emerald-400' : scores.compositeScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {scores.compositeScore}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">/100</span>
              </div>
            </div>
            
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
              scores.compositeScore >= 80 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {scores.compositeScore >= 80 ? 'Grade A' : 'Grade B'}
            </span>

            {anomalies.length > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                Leak
              </span>
            )}
          </div>

          {/* Quick Guide: "How It Works" */}
          <button
            onClick={onOpenQuickGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-emerald-300"
            title="Read 60-second plain English guide on how GREENCORE works"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </button>

          {/* Interactive Guided Tour Stepper Toggle */}
          <button
            onClick={onOpenKillerDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Follow the 8-step guided interactive walkthrough"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-200" />
            <span>Guided Tour (Step {killerDemoStep}/8)</span>
          </button>

          {/* Tools & Advanced Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <span>More Tools</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showToolsMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl p-1.5 space-y-1 z-50 animate-in fade-in"
                onMouseLeave={() => setShowToolsMenu(false)}
              >
                <button
                  onClick={() => { setShowToolsMenu(false); onOpenPitchMode(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
                >
                  <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">Judge Pitch (3 min)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Presentation slide deck</div>
                  </div>
                </button>

                <button
                  onClick={() => { setShowToolsMenu(false); onOpenManualEntry(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">Log Manual Data</div>
                    <div className="text-[10px] text-slate-400 font-normal">Submit bills, registers &amp; slips</div>
                  </div>
                </button>

                <button
                  onClick={() => { setShowToolsMenu(false); onOpenCertificate(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all"
                >
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">NAAC Audit Certificate</div>
                    <div className="text-[10px] text-slate-400 font-normal">Official verified PDF with QR</div>
                  </div>
                </button>

                <button
                  onClick={() => { setShowToolsMenu(false); onOpenTelemetry(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all"
                >
                  <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">Live Sensor Stream</div>
                    <div className="text-[10px] text-slate-400 font-normal">Modbus &amp; LoRaWAN packets</div>
                  </div>
                </button>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => { setShowToolsMenu(false); resetDemo(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Reset Campus Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Mode Confirmation Strip (Shows when user changes modes) */}
      {showModeBanner && (
        <div className={`px-4 lg:px-6 py-2 border-t text-xs flex items-center justify-between transition-colors ${
          mode === 'manual'
            ? 'bg-amber-950/60 border-amber-800/80 text-amber-200'
            : mode === 'iot'
            ? 'bg-cyan-950/60 border-cyan-800/80 text-cyan-200'
            : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
        }`}>
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                {mode === 'manual' && (
                  <>
                    <strong>Tier 1 (Manual Mode):</strong> Suitable for colleges with ₹0 hardware budget. Captures electricity bills, water tanker registers, cafeteria weight logs, and mobility forms.
                  </>
                )}
                {mode === 'hybrid' && (
                  <>
                    <strong>Tier 2 (Hybrid Mode - Recommended):</strong> Connects electrical sub-meters and zone water flow meters with manual cafeteria kitchen scale registers. (91% data confidence).
                  </>
                )}
                {mode === 'iot' && (
                  <>
                    <strong>Tier 3 (Full Smart IoT Mode):</strong> Fully automated continuous telemetry via LoRaWAN flow sensors, Modbus gateways, and smart optical trash bins. (98% data confidence).
                  </>
                )}
              </span>
            </div>
            <button
              onClick={() => setShowModeBanner(false)}
              className="text-[10px] uppercase font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/60 cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

