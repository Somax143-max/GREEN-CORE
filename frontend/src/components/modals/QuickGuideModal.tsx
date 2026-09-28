import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Zap, 
  Droplets, 
  Trash2, 
  Bike, 
  FileText, 
  Radio, 
  Cpu, 
  Search, 
  Wrench, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Building2,
  AlertTriangle,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      tag: 'WHAT IS THIS?',
      title: 'A Sustainability Intelligence Twin for GCEK',
      desc: 'Colleges consume massive amounts of power, water, and resources every day. GREENCORE connects scattered meters, bills, registers, and surveys into one unified live intelligence system.',
      icon: <Building2 className="w-6 h-6 text-emerald-400" />
    },
    {
      num: 2,
      tag: 'WHERE DOES DATA COME FROM?',
      title: 'Works for Any College: Manual, Hybrid, or Full IoT',
      desc: 'Top bar has 3 modes: College A (100% paper/forms, ₹0 hardware), College B (Hybrid: key meters + manual slips, 91% confidence), and College C (Automated LoRaWAN IoT, 98% confidence).',
      icon: <Radio className="w-6 h-6 text-cyan-400" />
    },
    {
      num: 3,
      tag: 'HOW IS THE SCORE MEASURED?',
      title: 'The 4 Balanced Pillars (0–100 GreenScore)',
      desc: 'Energy (kWh/person & solar share), Water (L/person/day), Waste (recycling & compost % diverted from landfill), and Mobility (walking, cycling, and bus mode share). Current Score: 85/100 (Grade A).',
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />
    },
    {
      num: 4,
      tag: 'WHERE IS THE PROBLEM RIGHT NOW?',
      title: 'Active Water Leak Detected in Hostel B',
      desc: 'Our AI noticed 3,200 Litres/hr flowing between 1:00 AM and 4:30 AM in Hostel B (Indravati Hall). Biometric gates showed students were asleep — proving a physical pipe rupture, not student use.',
      icon: <AlertTriangle className="w-6 h-6 text-rose-400" />
    },
    {
      num: 5,
      tag: 'HOW DO WE FIX IT?',
      title: 'Closed-Loop Action: 1-Click Dispatch & Verify',
      desc: 'Click "Dispatch WO-409" in Command Center to assign the plumber. Once fixed, the sensor confirms night flow dropped back to normal. Saves ₹18,400/month and restores +4.8 points to our score.',
      icon: <Wrench className="w-6 h-6 text-teal-400" />
    },
    {
      num: 6,
      tag: 'WHY IT WINS FOR NAAC/AUDIT',
      title: 'Cryptographic Proof & 1-Click Official Certificate',
      desc: 'Every single number is cryptographically signed with SHA-256 blocks. Generate 1-click NAAC Criterion 7.1.2 audit annexures and a verifiable digital certificate with QR code for inspectors.',
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider">
                  30-Second Campus Walkthrough
                </span>
                <span className="text-xs text-slate-400">Step {activeStep} of {steps.length}</span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                How GREENCORE Works (Plain & Simple)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs Row */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-4 py-2 gap-1.5 overflow-x-auto">
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeStep === s.num
                  ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{s.num}.</span>
              <span>{s.tag.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {steps.map(s => {
            if (s.num !== activeStep) return null;
            return (
              <div key={s.num} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase">
                      {s.tag}
                    </span>
                    <h4 className="text-xl font-black text-white mt-1">
                      {s.title}
                    </h4>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {/* Step Specific Visual Card */}
                {s.num === 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Campus</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">GCE Kalahandi</span>
                      <span className="text-[10px] text-emerald-400">9 Key Buildings</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Occupants</span>
                      <span className="text-sm font-bold text-white mt-0.5 block">3,730 People</span>
                      <span className="text-[10px] text-cyan-400">Students & Staff</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">GreenScore</span>
                      <span className="text-sm font-bold text-emerald-400 mt-0.5 block">85 / 100</span>
                      <span className="text-[10px] text-slate-400">Grade A (Target 85+)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Problem</span>
                      <span className="text-sm font-bold text-rose-400 mt-0.5 block">Hostel B Leak</span>
                      <span className="text-[10px] text-rose-300">Fix Available</span>
                    </div>
                  </div>
                )}

                {s.num === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                        <FileText className="w-4 h-4" />
                        <span>College A: Manual</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1.5">
                        For low-budget colleges. Staff enter meter dials & bills into web forms. Built-in anti-cheat rules verify numbers.
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Confidence: 64%
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 ring-1 ring-emerald-500/40">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <Radio className="w-4 h-4" />
                        <span>College B: Hybrid (Active)</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1.5">
                        Digital meters on main substations + digital cafeteria weighbridge + student travel surveys.
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Confidence: 91%
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30">
                      <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                        <Cpu className="w-4 h-4" />
                        <span>College C: Smart IoT</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1.5">
                        Automated LoRaWAN ultrasonic flow meters, Modbus power meters, and RFID turnstile gates.
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                        Confidence: 98%
                      </span>
                    </div>
                  </div>
                )}

                {s.num === 3 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">1. Energy (Score: 100/100)</span>
                          <span className="text-[11px] text-slate-400">59.5 kWh/student • 42.6% generated by rooftop solar</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">Excellent</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-rose-600/40">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-cyan-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">2. Water (Score: 72/100)</span>
                          <span className="text-[11px] text-rose-300">81.5 L/day • ⚠️ Dragged down by Hostel B pipe leak</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-rose-400">Needs Attention</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">3. Waste & Circularity (Score: 74/100)</span>
                          <span className="text-[11px] text-slate-400">83.4% of waste composted & recycled (avoiding landfill)</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">Good</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Bike className="w-4 h-4 text-indigo-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">4. Mobility & Carbon (Score: 76/100)</span>
                          <span className="text-[11px] text-slate-400">88% of campus community walks, cycles, or takes bus</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">Very Good</span>
                    </div>
                  </div>
                )}

                {s.num === 4 && (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-600/60 space-y-3">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Hostel B (Indravati Hall) — Spatial Anomaly Trace</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-rose-900/60">
                        <span className="text-[10px] text-slate-400 block font-mono">Excess Water</span>
                        <span className="text-sm font-black text-rose-400">+580,000 L / mo</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-rose-900/60">
                        <span className="text-[10px] text-slate-400 block font-mono">Night Leak Flow</span>
                        <span className="text-sm font-black text-rose-400">3,200 L / hr</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-rose-900/60">
                        <span className="text-[10px] text-slate-400 block font-mono">Financial Drain</span>
                        <span className="text-sm font-black text-amber-400">₹18,400 / mo</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">
                      The leak was confirmed because water flow surged by 32.4% during sleeping hours while student biometric gate count was constant (+2.1%).
                    </p>
                  </div>
                )}

                {s.num === 5 && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/60 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-300 uppercase tracking-wider">
                        Work Order #WO-409: Assigned to Mohan Das (Plumber)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        1-Click Solution
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block">Step 1: Valve Replacement</span>
                        <span className="text-white font-medium">Replace faulty float valve assembly on 2nd floor riser manifold.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 block">Step 2: Automated Verification</span>
                        <span className="text-white font-medium">LoRaWAN telemetry confirms night flow drops from 3,200 to 140 L/hr.</span>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-200">
                      Result: Immediate 20.7% drop in hostel water use $\rightarrow$ Restores overall GreenScore from 85 to 89!
                    </p>
                  </div>
                )}

                {s.num === 6 && (
                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-600/60 space-y-3">
                    <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Tamper-Proof Ledger & NAAC Grade A++ Preparation</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every single meter reading, manual log, and repair confirmation is hashed with cryptographic SHA-256 blocks. You can click <strong>[VERIFY LEDGER INTEGRITY]</strong> in the Audit Center to recalculate and mathematically prove all numbers.
                    </p>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-slate-300">Official NAAC Criterion 7.1.2 Ready</span>
                      <span className="text-emerald-400 font-mono font-bold">SHA-256 SEAL VERIFIED ✓</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map(s => (
              <span
                key={s.num}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeStep === s.num ? 'bg-emerald-400 scale-125' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>
            )}

            {activeStep < steps.length ? (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <span>Next: Step {activeStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Got it! Start Exploring</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
