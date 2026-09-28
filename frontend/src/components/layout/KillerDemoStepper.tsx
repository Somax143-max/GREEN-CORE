import React from 'react';
import { 
  Play, 
  AlertOctagon, 
  HelpCircle, 
  ListOrdered, 
  Sliders, 
  CheckCircle2, 
  FileSpreadsheet, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Droplets,
  ExternalLink
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { TabId } from './Navigation';

interface KillerDemoStepperProps {
  onNavigateTab: (tab: TabId) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const KillerDemoStepper: React.FC<KillerDemoStepperProps> = ({ 
  onNavigateTab, 
  isOpen, 
  onToggle 
}) => {
  const {
    killerDemoStep,
    setKillerDemoStep,
    isHostelBAnomalyInjected,
    isInterventionSimulated,
    isOutcomeVerified,
    injectHostelBWaterAnomaly,
    simulateHostelBIntervention,
    verifyInterventionOutcome,
    resetDemo
  } = useCampus();

  const steps = [
    {
      num: 1,
      title: 'Normal Campus Baseline',
      desc: 'Campus GreenScore 82. All zones within target benchmarks.',
      badge: 'Baseline Optimal',
      tab: 'command' as TabId,
    },
    {
      num: 2,
      title: 'Inject Hidden Leak Event',
      desc: 'Inject underground burst in Hostel B (Indravati): 142 → 188 L/student/day.',
      badge: 'Event Trigger',
      tab: 'water' as TabId,
    },
    {
      num: 3,
      title: 'Anomaly Sentinel Alert',
      desc: 'System detects +32.4% surge. Score drops to 78. Alarm raised.',
      badge: 'ML Detection',
      tab: 'command' as TabId,
    },
    {
      num: 4,
      title: 'Change Fingerprint "Why?"',
      desc: 'Multi-signal correlation: Water +32% while Occupancy +2%. Decoupled.',
      badge: 'Diagnostic AI',
      tab: 'ai' as TabId,
    },
    {
      num: 5,
      title: '"What Should We Do?"',
      desc: 'Prioritized tactical directives: P1 Float valve & underground feeder line.',
      badge: 'Action Engine',
      tab: 'ai' as TabId,
    },
    {
      num: 6,
      title: 'Action Impact Simulator',
      desc: 'Model intervention: +2.3 GreenScore points, ₹1,94,000 annual savings.',
      badge: 'What-If Simulation',
      tab: 'simulator' as TabId,
    },
    {
      num: 7,
      title: 'Closed-Loop Verification',
      desc: 'Physical repair executed: Water normalized to 149 L/day (-20.7%). Score 82 restored.',
      badge: 'Impact Verified',
      tab: 'water' as TabId,
    },
    {
      num: 8,
      title: 'Audit Report & Evidence Chain',
      desc: 'Immutable ledger trace: Problem → Evidence → Action → Verified Outcome.',
      badge: 'Audit-Ready',
      tab: 'audit' as TabId,
    },
  ];

  const currentStepInfo = steps[killerDemoStep - 1] || steps[0];

  return (
    <div className="bg-slate-900/95 border-b border-cyan-900/40 px-4 py-2.5 shadow-lg relative transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Header left */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  Interactive Guided Tour
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                  Step {killerDemoStep} of 8
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                <strong className="text-white">{currentStepInfo.title}:</strong> {currentStepInfo.desc}
              </p>
            </div>
          </div>

          {/* Stepper Interactive Action Button & Stepper Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Step Action Button */}
            {killerDemoStep === 1 && (
              <button
                onClick={() => {
                  injectHostelBWaterAnomaly();
                  onNavigateTab('water');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/50 transition-all hover:scale-105 cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Next: Inject Hostel B Leak (Step 2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {killerDemoStep === 2 && (
              <button
                onClick={() => {
                  setKillerDemoStep(3);
                  onNavigateTab('command');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all hover:scale-105 cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Next: Inspect Detected Anomaly (Step 3)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {killerDemoStep === 3 && (
              <button
                onClick={() => {
                  setKillerDemoStep(4);
                  onNavigateTab('ai');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all hover:scale-105 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Next: Ask AI "Why?" (Step 4)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {killerDemoStep === 4 && (
              <button
                onClick={() => {
                  setKillerDemoStep(5);
                  onNavigateTab('ai');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all hover:scale-105 cursor-pointer"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Next: View Action Plan (Step 5)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {killerDemoStep === 5 && (
              <button
                onClick={() => {
                  simulateHostelBIntervention();
                  onNavigateTab('simulator');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all hover:scale-105 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Next: Simulate ROI &amp; Savings (Step 6)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {killerDemoStep === 6 && (
              <button
                onClick={() => {
                  verifyInterventionOutcome();
                  onNavigateTab('water');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all hover:scale-105 shadow-md shadow-emerald-950/50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Next: Verify Closed-Loop Repair (Step 7)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {killerDemoStep === 7 && (
              <button
                onClick={() => {
                  setKillerDemoStep(8);
                  onNavigateTab('audit');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all hover:scale-105 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Next: View NAAC Audit Proof (Step 8)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {killerDemoStep === 8 && (
              <button
                onClick={resetDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Restart Guided Tour</span>
              </button>
            )}

            {/* Stepper Dots / Quick Jumps */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {steps.map(s => {
                const isActive = killerDemoStep === s.num;
                const isPast = killerDemoStep > s.num;
                return (
                  <button
                    key={s.num}
                    onClick={() => {
                      setKillerDemoStep(s.num);
                      onNavigateTab(s.tab);
                    }}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/50'
                        : isPast
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                    }`}
                    title={`Step ${s.num}: ${s.title}`}
                  >
                    {s.num}
                  </button>
                );
              })}
            </div>

            {/* Close / Dismiss Tour Banner Button */}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer text-xs"
              title="Close tour banner (You can reopen anytime from top bar)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};
