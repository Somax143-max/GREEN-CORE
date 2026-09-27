import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Radio, 
  ShieldCheck, 
  Sliders, 
  FileCheck2, 
  Building2, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Award,
  Terminal,
  Volume2
} from 'lucide-react';
import { TabId } from '../layout/Navigation';

interface JudgePitchModeProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabId) => void;
}

interface PitchSlide {
  number: number;
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  summary: string;
  keyDifferentiators: string[];
  judgeScript: string;
  suggestedTab: TabId;
  actionLabel: string;
  statHighlight: {
    value: string;
    label: string;
    sub: string;
  };
}

export const JudgePitchMode: React.FC<JudgePitchModeProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // 3-minute pitch timer

  const slides: PitchSlide[] = [
    {
      number: 1,
      badge: 'PROBLEM STATEMENT CB-SW-05',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'The Real Problem: Why Indian Colleges Fail Green Audits',
      tagline: 'Scattered registers, zero telemetry, fake estimates, and zero accountability.',
      summary: 'Every day, Indian engineering campuses consume hundreds of thousands of units of power, water, fuel, and cafeteria resources. Yet 94% of institutions track this through fragmented paper registers or annual power bills. When NAAC inspection arrives, numbers are estimated backward.',
      keyDifferentiators: [
        '95% of competitor submissions build a static toy electricity dashboard.',
        'GREENCORE is a 10-module cyber-physical campus digital twin & autonomous action engine.',
        'Measures 4 core sustainability vectors: Energy, Water, Waste, and Mobility Carbon.',
        'Built specifically for ECO CLUB, Government College of Engineering Kalahandi (GCEK).'
      ],
      judgeScript: '"Respected Judges, CB-SW-05 asks for a campus sustainability tracker and auditor. Most solutions only plot charts from dummy CSVs. We built an end-to-end Cyber-Physical Digital Twin with closed-loop action verification and cryptographic auditability."',
      suggestedTab: 'command',
      actionLabel: 'Inspect Command Center',
      statHighlight: {
        value: '78.4 / 100',
        label: 'GREENScore Composite',
        sub: 'Real-time multi-vector index'
      }
    },
    {
      number: 2,
      badge: 'THREE-TIER INGESTION ARCHITECTURE',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      title: 'Zero-Hardware Barrier: Universal Campus Compatibility',
      tagline: 'From zero-budget rural colleges to cutting-edge smart research institutes.',
      summary: 'Most IoT systems fail in real Indian colleges because hardware budget is zero. GREENCORE solves this with a revolutionary 3-tier hybrid ingestion architecture with dynamic data confidence recalculation.',
      keyDifferentiators: [
        'College A (Manual): Zero rupee hardware. Web forms, paper OCR, photo dial verification. (64% confidence).',
        'College B (Hybrid - Default): Sub-meters on critical 433V feeders + manual cafeteria and survey logs. (91% confidence).',
        'College C (Full IoT): Autonomous LoRaWAN flow meters, Modbus TCP gateways, smart optical bins. (98% confidence).',
        'Live button toggle re-weights all scores and confidence metrics instantly.'
      ],
      judgeScript: '"A solution that only works with ₹20 lakh of IoT sensors is useless for 90% of state colleges. Notice our top bar: click College A, B, or C, and watch the platform adapt its data confidence and provenance model live."',
      suggestedTab: 'twin',
      actionLabel: 'Explore 3D Digital Twin',
      statHighlight: {
        value: '64% - 98%',
        label: 'Confidence Spectrum',
        sub: 'Dynamic Bayesian provenance'
      }
    },
    {
      number: 3,
      badge: 'CLOSED-LOOP ANOMALY INTERDICTION',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      title: 'The "Aha!" Moment: Autonomous Pipe Rupture Interdiction',
      tagline: 'Detection is meaningless without automated dispatch and post-fix verification.',
      summary: 'At 03:15 AM, flow meter WM-H2-205 in Hostel B spikes to 3,200 L/hr (32.4% above nighttime baseline). GREENCORE does not just log a warning — it executes a 4-step autonomous closed loop.',
      keyDifferentiators: [
        '1. Anomaly Detection: Statistical z-score outlier detection flags 32.4% midnight surge.',
        '2. Root-Cause Isolation: Triangulated to 2nd Floor West Wing flush valve manifold.',
        '3. Autonomous Dispatch: Priority work order #WO-409 generated for Plumber Mohan Das with emergency SMS.',
        '4. Telemetry Verification: Evaluates 60-min post-repair flow (140 L/hr baseline restored) -> Verdict: OUTCOME VERIFIED.'
      ],
      judgeScript: '"Look at step 4 of our Killer Demo: At 3:15 AM, Hostel B has a burst pipe. Our AI sentinel detects it, isolates the wing, alerts maintenance, and crucially, monitors the telemetry afterwards to cryptographically verify the repair succeeded."',
      suggestedTab: 'ai',
      actionLabel: 'View AI Sentinel & Work Order',
      statHighlight: {
        value: '3,200 → 140',
        label: 'Flow Restored (L/hr)',
        sub: 'Automated 60-min verification'
      }
    },
    {
      number: 4,
      badge: 'ANTI-GAMING ADVERSARIAL TRUST',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Anti-Cheat Engine: Stopping Fraud in Green Audits',
      tagline: 'Why administrators cannot fudge numbers to artificially inflate their score.',
      summary: 'Campuses have strong incentives to artificially depress consumption numbers to win Green Leagues or gain NAAC points. GREENCORE introduces an adversarial verification engine that blocks 4 distinct fraud vectors.',
      keyDifferentiators: [
        'Ghost Meter Trap: Catches impossible consumption drops during active operational hours (>6.2 sigma).',
        'Monotonic Counter Shield: Rejects meter index rollbacks with cryptographic ledger alerts.',
        'Duplicate Manifest Hash: SHA-256 perceptual hash catches recycled cafeteria waste slips.',
        'Continuity Check: Flags uncorroborated 85% drops lacking scheduled maintenance or sensor consensus.'
      ],
      judgeScript: '"Judges always ask: Can a hostel warden just enter fake low numbers to win the Green League? We built an Anti-Gaming Testbench right into the system. Try submitting a fake reading and watch the heuristic engine intercept it instantly."',
      suggestedTab: 'audit',
      actionLabel: 'Inspect Anti-Cheat Ledger',
      statHighlight: {
        value: '4 Vector',
        label: 'Adversarial Shield',
        sub: 'SHA-256 Hash + Z-Score Guard'
      }
    },
    {
      number: 5,
      badge: 'PREDICTIVE ACTION SIMULATOR',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      title: 'What-If Financial ROI & 10-Year Decarbonization',
      tagline: 'Empowering Principals and Chancellors with hard Capex & Payback economics.',
      summary: 'Principals do not approve green projects based on slogans; they need financial payback periods, internal rates of return (IRR), and concrete carbon reduction targets.',
      keyDifferentiators: [
        '180 kW Rooftop Solar PV: Saves ₹18.4L/yr with 34-month payback and 178 tCO₂ reduction.',
        'Academic LED Retrofit: 100% LED replacement with 9-month breakeven and ₹6.2L/yr savings.',
        'STP Greywater Recycling: Recycles 1.4 Million liters for lawns, cutting municipal tanker costs.',
        'Dynamic multi-scenario toggles update composite score projections in real time.'
      ],
      judgeScript: '"We bridge the gap between student idealism and administrative reality. Our What-If Simulator lets the college Dean test real capital investments with 10-year Net Present Value and carbon abatement curves."',
      suggestedTab: 'simulator',
      actionLabel: 'Launch What-If Simulator',
      statHighlight: {
        value: '₹24.6L / yr',
        label: 'Net Financial Savings',
        sub: '34-month combined solar payback'
      }
    },
    {
      number: 6,
      badge: 'ACCREDITATION & IMMUTABILITY',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'NAAC Criterion 7.1.2 & Verifiable Cryptographic Seal',
      tagline: 'Audit-ready compliance documentation with scannable QR verification.',
      summary: 'GREENCORE directly aligns with National Assessment and Accreditation Council (NAAC) Institutional Values and Best Practices (Criterion VII). Generates an immutable, printable compliance dossier with SHA-256 ledger seals and scannable QR verification.',
      keyDifferentiators: [
        'Direct mapping to NAAC 7.1.2.1 through 7.1.2.5 (Solar, Biogas, Wheeling, LED, Water).',
        'Generates institutional Self-Study Report (SSR) Annexures with geotagged photo hashes.',
        'Live Projected NAAC Score: 3.88 / 4.00 (Grade A++ institutional benchmark).',
        'Cryptographic audit certificate with scannable QR code linking to immutable SHA-256 proof.'
      ],
      judgeScript: '"Finally, this directly impacts the college accreditation grade. We generate official NAAC Criterion 7.1.2 audit annexures and a verifiable SHA-256 digital certificate with a live scannable QR code. Thank you, judges!"',
      suggestedTab: 'audit',
      actionLabel: 'View NAAC Audit & Certificate',
      statHighlight: {
        value: '3.88 / 4.00',
        label: 'NAAC Projected Grade',
        sub: 'Grade A++ Institutional Score'
      }
    }
  ];

  const currentSlide = slides[currentSlideIndex];

  // Auto-play timer
  useEffect(() => {
    let interval: any;
    if (isAutoPlay && isOpen) {
      interval = setInterval(() => {
        setCurrentSlideIndex(prev => (prev < slides.length - 1 ? prev + 1 : 0));
      }, 15000); // 15 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, isOpen, slides.length]);

  // Total pitch timer countdown (180s)
  useEffect(() => {
    let timer: any;
    if (isOpen && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timerSeconds]);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleJumpToTab = (tab: TabId) => {
    onNavigateTab(tab);
    onClose();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md">
              <Trophy className="w-4 h-4 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  HACKVERSE ’26 Finalist Pitch Deck
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated 3-Minute Executive Presentation for Hackathon Judges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 3-Minute Countdown Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-bold ${
              timerSeconds < 30 
                ? 'bg-rose-950/50 text-rose-300 border-rose-700 animate-pulse' 
                : 'bg-slate-900 text-slate-300 border-slate-700'
            }`}>
              <span>⏱️ Pitch Clock:</span>
              <span className="text-cyan-400 font-black">{formatTimer(timerSeconds)}</span>
            </div>

            {/* Auto Play Toggle */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                isAutoPlay 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle Auto Slide Advance"
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlay ? 'Auto' : 'Manual'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Progress Indicator Bar */}
        <div className="grid grid-cols-6 gap-1 bg-slate-950 px-6 py-1.5 border-b border-slate-800/80">
          {slides.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlideIndex
                  ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50 scale-y-125'
                  : idx < currentSlideIndex
                  ? 'bg-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Slide Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Slide Header & Stat Badge */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className={`inline-block text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${currentSlide.badgeColor}`}>
                {currentSlide.badge}
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h2>
              <p className="text-sm font-semibold text-cyan-300">
                "{currentSlide.tagline}"
              </p>
            </div>

            {/* Highlight Metric Card */}
            <div className="shrink-0 p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-lg min-w-[200px] text-center lg:text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {currentSlide.statHighlight.label}
              </span>
              <div className="text-3xl font-black text-cyan-400 my-1">
                {currentSlide.statHighlight.value}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">
                {currentSlide.statHighlight.sub}
              </span>
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300 leading-relaxed">
            {currentSlide.summary}
          </div>

          {/* Key Differentiators Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Winning Architectural Differentiators
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {currentSlide.keyDifferentiators.map((diff, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{diff}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Presenter "Judge Script" Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-950 border border-cyan-800/50 shadow-inner">
            <div className="flex items-center gap-2 mb-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                Pitch Script (What to tell the judges right now):
              </span>
            </div>
            <p className="text-xs font-serif italic text-slate-200 leading-relaxed pl-6 border-l-2 border-cyan-500/50">
              {currentSlide.judgeScript}
            </p>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-t border-slate-800">
          {/* Left: Previous Slide */}
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              currentSlideIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Center: Jump to Live Feature in UI */}
          <button
            onClick={() => handleJumpToTab(currentSlide.suggestedTab)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{currentSlide.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Right: Next Slide */}
          <button
            onClick={handleNext}
            disabled={currentSlideIndex === slides.length - 1}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              currentSlideIndex === slides.length - 1
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
