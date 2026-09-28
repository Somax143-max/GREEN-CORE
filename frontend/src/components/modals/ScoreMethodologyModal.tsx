import React from 'react';
import { 
  Sliders, 
  X, 
  HelpCircle, 
  Zap, 
  Droplet, 
  Trash2, 
  Compass, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

interface ScoreMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoreMethodologyModal: React.FC<ScoreMethodologyModalProps> = ({ isOpen, onClose }) => {
  const { methodology, setMethodology, scores } = useCampus();

  if (!isOpen) return null;

  const handleWeightChange = (key: 'energy' | 'water' | 'waste' | 'transport', value: number) => {
    setMethodology(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: value
      }
    }));
  };

  const totalWeight = Object.values(methodology.weights).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  GREENCORE METHODOLOGY v1.2
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Audited Mathematical Framework
                </span>
              </div>
              <h2 className="text-base font-black text-white">
                How is the GREENScore Calculated?
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Master Equation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-950 to-cyan-950/50 border border-cyan-500/30 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Deterministic Linear Combination Model
            </span>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-sm text-cyan-300 flex flex-wrap items-center gap-2">
              <span className="font-bold text-white">GREENScore</span>
              <span>=</span>
              <span className="text-amber-400 font-bold">(Energy × Wₑ)</span>
              <span>+</span>
              <span className="text-cyan-400 font-bold">(Water × Ww)</span>
              <span>+</span>
              <span className="text-emerald-400 font-bold">(Waste × Wₐ)</span>
              <span>+</span>
              <span className="text-indigo-400 font-bold">(Transport × Wₜ)</span>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Current Live Evaluation:{' '}
              <strong className="text-white">
                ({scores.energyScore} × {methodology.weights.energy}) + ({scores.waterScore} × {methodology.weights.water}) + ({scores.wasteScore} × {methodology.weights.waste}) + ({scores.transportScore} × {methodology.weights.transport}) = 
              </strong>{' '}
              <span className="text-base font-black text-emerald-400">{scores.compositeScore} / 100</span>
            </div>
          </div>

          {/* 4 Pillars Mathematical Derivations */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Four Core Sustainability Vectors & Normalization:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Energy Pillar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    1. ENERGY PILLAR (Weight: {(methodology.weights.energy * 100).toFixed(0)}%)
                  </span>
                  <span className="font-mono font-bold text-amber-300">{scores.energyScore} / 100</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Normalization:</strong> Normalized per student (kWh/student/month) and area intensity (kWh/m²).
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <div>Observed: 59.5 kWh / student / mo</div>
                  <div>IGBC Academic Benchmark: 55.0 kWh / student</div>
                  <div className="text-cyan-400 mt-1">Ratio = 55.0 / 59.5 = 0.92 → Score: {scores.energyScore}</div>
                </div>
              </div>

              {/* Water Pillar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5" />
                    2. WATER PILLAR (Weight: {(methodology.weights.water * 100).toFixed(0)}%)
                  </span>
                  <span className="font-mono font-bold text-cyan-300">{scores.waterScore} / 100</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Normalization:</strong> Litres / occupant / operating day (MoHUA & CPHEEO standard).
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <div>Observed: 81.5 L / student / day</div>
                  <div>CPHEEO Target: 70.0 L / student / day</div>
                  <div className="text-cyan-400 mt-1">Includes ML Anomaly penalty for Hostel B pipe rupture (-14 pts)</div>
                </div>
              </div>

              {/* Waste Pillar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                    3. WASTE PILLAR (Weight: {(methodology.weights.waste * 100).toFixed(0)}%)
                  </span>
                  <span className="font-mono font-bold text-emerald-300">{scores.wasteScore} / 100</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Normalization:</strong> Landfill diversion percentage + per-capita wet/dry generation.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <div>Observed Diversion: 83.4% diverted from landfill</div>
                  <div>Zero Waste Campus Target: 80.0% diversion</div>
                  <div className="text-emerald-400 mt-1">Score bonus from Central Dining Composting bio-methanation</div>
                </div>
              </div>

              {/* Transport Pillar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    4. TRANSPORT PILLAR (Weight: {(methodology.weights.transport * 100).toFixed(0)}%)
                  </span>
                  <span className="font-mono font-bold text-indigo-300">{scores.transportScore} / 100</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Normalization:</strong> Commute modal split (48% walk, 26% cycle, 14% bus, 8% 2W, 4% car) and daily CO₂/capita.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <div>Active / Transit Share: 88.0% sustainable</div>
                  <div>Observed: 0.1102 kg CO₂ / capita / day vs 0.220 kg baseline</div>
                  <div className="text-indigo-400 mt-1">Calculated directly from 1,842 verified campus commute surveys</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Weight Configurator Slider Panel */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Configurable Weight Tuning (Institutional Admin):
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                Math.abs(totalWeight - 1.0) < 0.01 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                Total Sum: {(totalWeight * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-400 font-bold">Energy Weight</span>
                  <span className="font-mono text-white">{(methodology.weights.energy * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.05"
                  value={methodology.weights.energy}
                  onChange={e => handleWeightChange('energy', parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyan-400 font-bold">Water Weight</span>
                  <span className="font-mono text-white">{(methodology.weights.water * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.05"
                  value={methodology.weights.water}
                  onChange={e => handleWeightChange('water', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-bold">Waste Weight</span>
                  <span className="font-mono text-white">{(methodology.weights.waste * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.05"
                  value={methodology.weights.waste}
                  onChange={e => handleWeightChange('waste', parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-400 font-bold">Transport Weight</span>
                  <span className="font-mono text-white">{(methodology.weights.transport * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.05"
                  value={methodology.weights.transport}
                  onChange={e => handleWeightChange('transport', parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
