import React from 'react';
import { 
  SlidersHorizontal, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  TrendingUp, 
  IndianRupee, 
  Leaf, 
  Clock, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Droplets, 
  Trash2, 
  Bike,
  HelpCircle
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { ActionSimulationOption } from '../../types';

export const ActionSimulator: React.FC = () => {
  const { 
    simulationOptions, 
    toggleSimulationOption, 
    scores,
    isHostelBAnomalyInjected,
    isOutcomeVerified
  } = useCampus();

  const selectedOptions = simulationOptions.filter(o => o.selected);

  // Compute simulated deltas
  const simulatedEnergyDelta = selectedOptions.reduce((s, o) => s + o.energyImprovementDelta, 0);
  const simulatedWaterDelta = selectedOptions.reduce((s, o) => s + o.waterImprovementDelta, 0);
  const simulatedWasteDelta = selectedOptions.reduce((s, o) => s + o.wasteImprovementDelta, 0);
  const simulatedTransportDelta = selectedOptions.reduce((s, o) => s + o.transportImprovementDelta, 0);

  const currentEnergyScore = scores.energyScore;
  const currentWaterScore = scores.waterScore;
  const currentWasteScore = scores.wasteScore;
  const currentTransportScore = scores.transportScore;
  const currentOverallScore = scores.compositeScore;

  const simulatedEnergyScore = Math.min(100, Math.round(currentEnergyScore + simulatedEnergyDelta));
  const simulatedWaterScore = Math.min(100, Math.round(currentWaterScore + simulatedWaterDelta));
  const simulatedWasteScore = Math.min(100, Math.round(currentWasteScore + simulatedWasteDelta));
  const simulatedTransportScore = Math.min(100, Math.round(currentTransportScore + simulatedTransportDelta));

  // Modeled new composite score
  const simulatedOverallScore = Math.min(100, Math.round(
    simulatedEnergyScore * 0.30 +
    simulatedWaterScore * 0.25 +
    simulatedWasteScore * 0.25 +
    simulatedTransportScore * 0.20
  ));

  const totalCapitalCostINR = selectedOptions.reduce((s, o) => s + o.capitalCostINR, 0);
  const totalAnnualSavingsINR = selectedOptions.reduce((s, o) => s + o.annualSavingsINR, 0);
  const totalCO2ReductionTons = selectedOptions.reduce((s, o) => s + o.co2ReductionTonsPerYear, 0);
  const avgPaybackMonths = totalAnnualSavingsINR > 0 
    ? +((totalCapitalCostINR / totalAnnualSavingsINR) * 12).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
              Scenario Modeling Engine
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Interactive What-If
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            Action Impact Simulator & Sustainability ROI
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            Select proposed green initiatives to model score lifts, capital outlay in ₹, annual operational savings, payback timeline, and CO₂ reduction.
          </p>
        </div>

        <div className="text-[11px] text-slate-400 italic bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          ⚠️ Modeled estimates based on BEE & IGBC metrics, not guaranteed outcomes.
        </div>
      </div>

      {/* Simulator Comparison Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Score Lift Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-emerald-500/40 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">Simulated GreenScore</div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">{currentOverallScore}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className="text-3xl font-black text-emerald-400">{simulatedOverallScore}</span>
          </div>
          <div className="mt-2 text-xs font-bold text-emerald-400">
            +{simulatedOverallScore - currentOverallScore} Points Score Lift
          </div>
        </div>

        {/* Financial Savings Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">Annual Financial Savings</div>
          <div className="mt-2 text-2xl font-black text-white">
            ₹{totalAnnualSavingsINR.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ yr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Capital Outlay: ₹{totalCapitalCostINR.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Payback Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">Estimated Payback Period</div>
          <div className="mt-2 text-2xl font-black text-cyan-400">
            {avgPaybackMonths} <span className="text-xs font-normal text-slate-400">Months</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            ROI: {totalCapitalCostINR > 0 ? ((totalAnnualSavingsINR / totalCapitalCostINR) * 100).toFixed(0) : 0}% per annum
          </div>
        </div>

        {/* Carbon Reduction Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">Annual Carbon Reduction</div>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            {totalCO2ReductionTons.toFixed(1)} <span className="text-xs font-normal text-slate-400">tCO₂e / yr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Equivalent to {Math.round(totalCO2ReductionTons * 45)} trees planted
          </div>
        </div>
      </div>

      {/* Interactive Levers + 2x2 Priority Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Action Levers (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              Toggle Campus Sustainability Interventions
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {selectedOptions.length} of {simulationOptions.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {simulationOptions.map(option => {
              const isSelected = !!option.selected;
              return (
                <div
                  key={option.id}
                  onClick={() => toggleSimulationOption(option.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-400">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{option.name}</h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded uppercase bg-slate-800 text-slate-300">
                            {option.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-400">
                        +{option.overallScoreDelta.toFixed(1)} pts
                      </span>
                      <div className="text-[10px] text-slate-500">
                        Score Delta
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Capital Cost</span>
                      <span className="font-semibold text-white">₹{option.capitalCostINR.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Annual Savings</span>
                      <span className="font-semibold text-emerald-400">₹{option.annualSavingsINR.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Payback</span>
                      <span className="font-semibold text-cyan-400">{option.paybackMonths} mo</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">CO₂ Offset</span>
                      <span className="font-semibold text-white">{option.co2ReductionTonsPerYear} tCO₂e</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 2x2 Action Priority Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Action Priority Matrix (Impact vs Effort)
            </h3>
            <p className="text-xs text-slate-400">
              Strategic decision grid for campus administration capital allocation
            </p>
          </div>

          {/* 2x2 Visual Grid */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Top-Left: High Impact / Low Effort (DO FIRST) */}
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50">
                <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
                  DO FIRST (HIGH IMPACT / LOW EFFORT)
                </span>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-200">
                  <li className="font-medium">• Hostel B Leak Remediation (10.8 mo payback)</li>
                  <li className="font-medium">• Campus 500 LED Retrofit</li>
                </ul>
              </div>

              {/* Top-Right: High Impact / High Effort (PLAN) */}
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40">
                <span className="text-[10px] font-black uppercase text-cyan-400 block tracking-wider">
                  STRATEGIC PLAN (HIGH IMPACT / HIGH EFFORT)
                </span>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <li>• 150 kWp Rooftop Solar Expansion (₹65L capital)</li>
                </ul>
              </div>

              {/* Bottom-Left: Low Impact / Low Effort (QUICK WINS) */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">
                  QUICK WINS (MODERATE IMPACT / LOW EFFORT)
                </span>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
                  <li>• Tap aerator installations</li>
                  <li>• Lab monitor standby sleep rule</li>
                </ul>
              </div>

              {/* Bottom-Right: Low Impact / High Effort (DE-PRIORITIZE) */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 opacity-60">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                  DE-PRIORITIZE (LOW IMPACT / HIGH EFFORT)
                </span>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-500">
                  <li>• Complete perimeter lighting rewiring</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current vs Simulated Breakdown Table */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <span className="text-slate-400 font-bold block text-[11px] uppercase">
              Pillar Score Projection
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900">
                <span className="text-[10px] text-slate-400 block">Energy</span>
                <span className="font-bold text-white">{currentEnergyScore} → <strong className="text-emerald-400">{simulatedEnergyScore}</strong></span>
              </div>
              <div className="p-2 rounded bg-slate-900">
                <span className="text-[10px] text-slate-400 block">Water</span>
                <span className="font-bold text-white">{currentWaterScore} → <strong className="text-emerald-400">{simulatedWaterScore}</strong></span>
              </div>
              <div className="p-2 rounded bg-slate-900">
                <span className="text-[10px] text-slate-400 block">Waste</span>
                <span className="font-bold text-white">{currentWasteScore} → <strong className="text-emerald-400">{simulatedWasteScore}</strong></span>
              </div>
              <div className="p-2 rounded bg-slate-900">
                <span className="text-[10px] text-slate-400 block">Mobility</span>
                <span className="font-bold text-white">{currentTransportScore} → <strong className="text-emerald-400">{simulatedTransportScore}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
