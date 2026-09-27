import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Trash2, 
  Bike, 
  Search, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Activity, 
  Building2, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { ScoreGauge } from '../common/ScoreGauge';
import { MetricCard } from '../common/MetricCard';
import { TabId } from '../layout/Navigation';

interface CommandCenterProps {
  onNavigateTab: (tab: TabId) => void;
  onSelectNode: (nodeId: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigateTab, onSelectNode }) => {
  const { 
    scores, 
    nodes, 
    anomalies, 
    mode, 
    isHostelBAnomalyInjected,
    isOutcomeVerified,
    setKillerDemoStep,
    simulateHostelBIntervention
  } = useCampus();

  const [isWhatChangedExpanded, setIsWhatChangedExpanded] = useState<boolean>(true);

  // Quick stats
  const totalStudents = nodes.reduce((sum, n) => sum + n.population, 0);
  const criticalNodes = nodes.filter(n => n.status === 'critical');
  const warningNodes = nodes.filter(n => n.status === 'warning');

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Anomaly Present */}
      {anomalies.length > 0 && (
        <div className="bg-rose-950/80 border-2 border-rose-600/80 rounded-2xl p-4 shadow-xl shadow-rose-950/40 animate-pulse-ring">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-700 tracking-wider">
                    CRITICAL SUSTAINABILITY ANOMALY DETECTED
                  </span>
                  <span className="text-xs text-rose-300 font-mono">ID: {anomalies[0].id}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {anomalies[0].title} — {anomalies[0].nodeName}
                </h3>
                <p className="text-xs text-rose-200/90 max-w-3xl mt-0.5 leading-relaxed">
                  {anomalies[0].description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setKillerDemoStep(4);
                  onNavigateTab('ai');
                }}
                className="px-3.5 py-2 rounded-xl bg-white text-rose-950 font-bold text-xs shadow-md hover:bg-rose-100 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Ask AI "Why?"</span>
              </button>
              <button
                onClick={() => {
                  setKillerDemoStep(6);
                  simulateHostelBIntervention();
                  onNavigateTab('simulator');
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs border border-rose-600 transition-all flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Fix</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Score Gauge + 4 Pillar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Overall GreenScore Card */}
        <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                  Sept 2026 Audit Cycle
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">Campus GreenScore</h2>
              </div>
              <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Methodology v1.2
              </div>
            </div>

            {/* Score Gauge */}
            <ScoreGauge 
              score={scores.compositeScore} 
              delta={scores.delta}
              confidence={scores.dataConfidence}
              size={190}
            />

            {/* Explanation Summary */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="text-rose-400 font-bold shrink-0">Main Drag:</span>
                <span className="font-medium text-slate-300">{scores.explanation.mainDrag}</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-300">
                <span className="text-emerald-400 font-bold shrink-0">Main Lift:</span>
                <span className="font-medium text-slate-300">{scores.explanation.mainImprovement}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 italic leading-snug">
                "{scores.explanation.summary}"
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              {nodes.length} Physical Facilities
            </span>
            <span className="font-medium">
              {totalStudents.toLocaleString()} Campus Population
            </span>
          </div>
        </div>

        {/* Right: 4 Domain Pillar Cards */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Energy Pillar */}
            <MetricCard
              title="Energy Efficiency"
              category="energy"
              value="245,100"
              unit="kWh"
              subValue="47.1 kWh / student (15.5% Solar Rooftop Mix)"
              score={scores.energyScore}
              scoreDelta={+1.2}
              confidence={scores.categoryConfidence.energy}
              provenance="Substation 11kV Feeder + Delta Solar Telemetry"
              icon={<Zap className="w-5 h-5" />}
              onClick={() => onNavigateTab('energy')}
            />

            {/* Water Pillar */}
            <MetricCard
              title="Water Resource"
              category="water"
              value={isHostelBAnomalyInjected && !isOutcomeVerified ? "7,464,000" : "6,880,000"}
              unit="Litres"
              subValue={isHostelBAnomalyInjected && !isOutcomeVerified 
                ? "47.8 L/capita/day (Hostel B Surge: 188 L/day)" 
                : "44.1 L/capita/day (Optimal baseline)"}
              score={scores.waterScore}
              scoreDelta={isHostelBAnomalyInjected && !isOutcomeVerified ? -12 : +2.5}
              confidence={scores.categoryConfidence.water}
              provenance="Zone Ultrasonic Flow Meters (LoRaWAN)"
              icon={<Droplets className="w-5 h-5" />}
              warning={isHostelBAnomalyInjected && !isOutcomeVerified}
              onClick={() => onNavigateTab('water')}
            />

            {/* Waste Pillar */}
            <MetricCard
              title="Waste & Circularity"
              category="waste"
              value="4,910"
              unit="kg"
              subValue="84.2% Waste Diversion Rate (Compost + Recycled)"
              score={scores.wasteScore}
              scoreDelta={+4.0}
              confidence={scores.categoryConfidence.waste}
              provenance="Central Dining Weighbridge Scale Registers"
              icon={<Trash2 className="w-5 h-5" />}
              onClick={() => onNavigateTab('waste')}
            />

            {/* Mobility Pillar */}
            <MetricCard
              title="Mobility & Carbon"
              category="transport"
              value="184.2"
              unit="tCO₂e"
              subValue="74% Active & Transit Mode Share (Walk/Cycle/Bus)"
              score={scores.transportScore}
              scoreDelta={+0.8}
              confidence={scores.categoryConfidence.transport}
              provenance="Annual Mobility Survey (1,842 respondents)"
              icon={<Bike className="w-5 h-5" />}
              onClick={() => onNavigateTab('mobility')}
            />
          </div>

          {/* Quick Interactive Intelligence Bar: "What Changed?" + "Why?" + "What Next?" */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Autonomous Intelligence Sentinel
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Closed-Loop AI
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Real-time synthesis of multi-source meters, surveys, and campus changes
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsWhatChangedExpanded(!isWhatChangedExpanded)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isWhatChangedExpanded ? 'Hide Diagnostics' : 'Inspect What Changed'}</span>
              </button>
            </div>

            {isWhatChangedExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                {/* 1. What Changed? */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                    <span>🔍 WHAT CHANGED?</span>
                  </div>
                  {isHostelBAnomalyInjected && !isOutcomeVerified ? (
                    <p className="text-xs text-slate-300 leading-snug">
                      Hostel B domestic water jumped <strong className="text-rose-400">+32.4%</strong> to 188 L/student/day. Campus GreenScore slipped from 82 to 78.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-300 leading-snug">
                      Energy load stable (-1.2% cooling drop). Waste diversion improved to <strong>84.2%</strong>. GreenScore steady at 82.
                    </p>
                  )}
                </div>

                {/* 2. Why? */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-1">
                    <span>🤖 WHY DID IT CHANGE?</span>
                  </div>
                  {isHostelBAnomalyInjected && !isOutcomeVerified ? (
                    <p className="text-xs text-slate-300 leading-snug">
                      Change Fingerprint reveals water surge is decoupled from occupancy (+2.1%) and energy (+3.4%). Indicative of mechanical leak.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-300 leading-snug">
                      Cafeteria organic waste diversion increased following the commissioning of the new aerobic compost pit.
                    </p>
                  )}
                </div>

                {/* 3. What Next? */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                      <span>🎯 WHAT SHOULD WE DO?</span>
                    </div>
                    {isHostelBAnomalyInjected && !isOutcomeVerified ? (
                      <p className="text-xs text-slate-300 leading-snug">
                        Dispatch facility plumber to inspect Hostel B overhead float valve and underground feeder line.
                      </p>
                    ) : (
                      <p className="text-xs text-slate-300 leading-snug">
                        Proceed with Phase 2 LED high-bay replacement in ME Workshops for estimated ₹2,86,000 annual savings.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onNavigateTab('ai')}
                    className="mt-2 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 justify-end"
                  >
                    <span>Open AI Diagnostics</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Digital Twin Snapshot & Facility Status Grid */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Campus Digital Twin Node Status (GCEK)
            </h3>
            <p className="text-xs text-slate-400">
              Granular sustainability breakdown across Academic, Residential Hostels, and Central Facilities
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {nodes.filter(n => n.status === 'optimal').length} Optimal
            </span>
            {warningNodes.length > 0 && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {warningNodes.length} Review
              </span>
            )}
            {criticalNodes.length > 0 && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {criticalNodes.length} Critical
              </span>
            )}
            <button
              onClick={() => onNavigateTab('twin')}
              className="ml-2 font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Explore 3D Twin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {nodes.map(node => {
            const isCritical = node.status === 'critical';
            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isCritical
                    ? 'bg-rose-950/40 border-rose-600/80 shadow-lg shadow-rose-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                }`}
              >
                {isCritical && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-rose-500 animate-pulse" />
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {node.type.toUpperCase()} • {node.code}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{node.name}</h4>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-black ${
                    node.greenScore >= 80 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : node.greenScore >= 70
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                  }`}>
                    {node.greenScore}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Energy</span>
                    <span className="font-semibold">{node.metrics.energyPerStudent.toFixed(1)} kWh</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Water</span>
                    <span className={`font-semibold ${isCritical ? 'text-rose-400 font-bold' : ''}`}>
                      {node.metrics.waterPerStudentPerDay.toFixed(1)} L/d
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Diversion</span>
                    <span className="font-semibold">{node.metrics.wasteDiversionRate}%</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Pop: {node.population}</span>
                  <span className="text-cyan-400 hover:underline">Inspect Node →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
