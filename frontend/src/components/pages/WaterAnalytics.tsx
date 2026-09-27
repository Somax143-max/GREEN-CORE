import React from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Sliders, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { TabId } from '../layout/Navigation';

interface WaterAnalyticsProps {
  onNavigateTab: (tab: TabId) => void;
}

export const WaterAnalytics: React.FC<WaterAnalyticsProps> = ({ onNavigateTab }) => {
  const { 
    nodes, 
    anomalies, 
    isHostelBAnomalyInjected, 
    isOutcomeVerified,
    injectHostelBWaterAnomaly,
    simulateHostelBIntervention,
    verifyInterventionOutcome,
    setKillerDemoStep
  } = useCampus();

  const totalCampusWater = nodes.reduce((sum, n) => sum + n.metrics.waterLitres, 0);
  const hostelBNorm = nodes.find(n => n.id === 'hostel_h2');

  // 24-Hour Night Flow Leak Profile (Simulated telemetry)
  // Normal baseline: low night draw (02:00 to 05:00 AM) ~ 150 L/hr
  // Leak profile: constant 3,200 L/hr night baseline!
  const hours = [
    { time: '00:00', normal: 380, leak: 3200 },
    { time: '02:00', normal: 160, leak: 3150 },
    { time: '04:00', normal: 140, leak: 3250 }, // Night flow leak peak evidence
    { time: '06:00', normal: 1800, leak: 4900 }, // Morning rush
    { time: '08:00', normal: 3600, leak: 6800 },
    { time: '10:00', normal: 1400, leak: 4500 },
    { time: '12:00', normal: 2100, leak: 5200 },
    { time: '14:00', normal: 1200, leak: 4400 },
    { time: '16:00', normal: 1500, leak: 4600 },
    { time: '18:00', normal: 2900, leak: 6100 },
    { time: '20:00', normal: 3400, leak: 6600 },
    { time: '22:00', normal: 1900, leak: 5100 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for Hostel B Water Surge */}
      {isHostelBAnomalyInjected && !isOutcomeVerified && (
        <div className="bg-rose-950/90 border-2 border-rose-500 rounded-2xl p-5 shadow-2xl shadow-rose-950/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-rose-600 text-white shadow-lg animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-700 font-mono">
                    KILLER DEMO ACTIVE • STEP 3
                  </span>
                  <span className="text-xs text-rose-300 font-semibold">Ultrasonic Sub-meter #WM-H2-205</span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  Hostel B (Indravati): Severe Water Consumption Breach (+32.4%)
                </h3>
                <p className="text-xs text-rose-200/90 mt-1 max-w-3xl leading-relaxed">
                  Per-capita water usage spiked from <strong>142.0 L/student/day</strong> to <strong>188.0 L/student/day</strong>. Change fingerprint confirms decoupling from student occupancy (+2.1%). Sustained night-flow indicates physical breach or jammed overhead float valve.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setKillerDemoStep(4);
                  onNavigateTab('ai');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Ask AI "Why?"</span>
              </button>
              <button
                onClick={() => {
                  setKillerDemoStep(6);
                  simulateHostelBIntervention();
                  onNavigateTab('simulator');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Repair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verified Outcome Banner if Step 7 has been reached */}
      {isOutcomeVerified && (
        <div className="bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl p-5 shadow-2xl shadow-emerald-950/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 border border-emerald-700 font-mono">
                    CLOSED-LOOP OUTCOME VERIFIED • STEP 7
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">Post-Intervention Telemetry</span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  Hostel B Repair Successful: -20.7% Water Reduction Verified
                </h3>
                <p className="text-xs text-emerald-200/90 mt-1 max-w-3xl leading-relaxed">
                  Before repair: 188.0 L/student/day. After physical float valve replacement & aerator retrofitting: <strong>149.0 L/student/day</strong>. Total saved: ~46,000 Litres/day. GreenScore restored to <strong>82/100</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setKillerDemoStep(8);
                onNavigateTab('audit');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>View Audit Evidence Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Campus Total Water</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalCampusWater.toLocaleString()} <span className="text-sm font-normal text-slate-400">Litres/mo</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Daily: {(totalCampusWater / 30).toLocaleString(undefined, { maximumFractionDigits: 0 })} L/day</span>
            <span className={isHostelBAnomalyInjected && !isOutcomeVerified ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {isHostelBAnomalyInjected && !isOutcomeVerified ? '+8.5% Surge' : 'Normal'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Hostel B Benchmark</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className={`text-2xl font-black ${
            isHostelBAnomalyInjected && !isOutcomeVerified ? 'text-rose-400' : 'text-white'
          }`}>
            {hostelBNorm?.metrics.waterPerStudentPerDay.toFixed(1)} <span className="text-sm font-normal text-slate-400">L/student/day</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Target: 135 L • Baseline: 142 L</span>
            <span className={isHostelBAnomalyInjected && !isOutcomeVerified ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {isHostelBAnomalyInjected && !isOutcomeVerified ? '+32.4% Breach' : 'Target Aligned'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Night-Flow Leak Rate</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`text-2xl font-black ${
            isHostelBAnomalyInjected && !isOutcomeVerified ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {isHostelBAnomalyInjected && !isOutcomeVerified ? '3,200' : '160'} <span className="text-sm font-normal text-slate-400">L/hour</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Window: 02:00 - 05:00 AM</span>
            <span className={isHostelBAnomalyInjected && !isOutcomeVerified ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {isHostelBAnomalyInjected && !isOutcomeVerified ? 'Leak Confirmed' : 'Zero Loss'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Data Provenance</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">84% <span className="text-sm font-normal text-slate-400">Confidence</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>LoRaWAN Pulse Ultrasonic</span>
            <span className="text-slate-300 font-semibold">Active Mesh</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Night-Flow Telemetry Signature Chart */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                24-Hour Diurnal Water Flow Telemetry & Night-Flow Leak Sentinel
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Hostel B Sub-meter #WM-H2-205
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Comparing normal baseline diurnal profile with active telemetry. Notice the abnormal flat 3,200 L/hr draw at 02:00 - 05:00 AM.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-cyan-400" /> Normal Baseline
            </span>
            {isHostelBAnomalyInjected && !isOutcomeVerified && (
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-3 h-3 rounded bg-rose-500 animate-pulse" /> Active Leak Telemetry
              </span>
            )}
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full h-64 bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-end relative overflow-hidden">
          {/* Highlight night leak box */}
          {isHostelBAnomalyInjected && !isOutcomeVerified && (
            <div className="absolute top-4 left-6 w-36 h-48 bg-rose-500/10 border-2 border-dashed border-rose-500/60 rounded-lg p-2 pointer-events-none">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tight block">
                ⚠ Night Flow Leak
              </span>
              <span className="text-[9px] text-rose-300">
                Sustained 3,200 L/hr during sleep window (02:00–05:00)
              </span>
            </div>
          )}

          <div className="w-full h-48 flex items-end justify-between gap-1 pt-4">
            {hours.map((h, i) => {
              const currentFlow = isHostelBAnomalyInjected && !isOutcomeVerified ? h.leak : h.normal;
              const maxVal = 7000;
              const heightPercent = (currentFlow / maxVal) * 85 + 10;
              const normalHeightPercent = (h.normal / maxVal) * 85 + 10;

              return (
                <div key={h.time} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-slate-950 border border-slate-700 p-2 rounded-lg text-[10px] text-white pointer-events-none z-30 shadow-xl min-w-24 text-center">
                    <div className="font-bold text-cyan-400">{h.time} IST</div>
                    <div>Recorded: {currentFlow.toLocaleString()} L/hr</div>
                    <div className="text-slate-400">Baseline: {h.normal.toLocaleString()} L/hr</div>
                  </div>

                  <div className="w-full max-w-[28px] flex items-end justify-center h-full">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 ${
                        isHostelBAnomalyInjected && !isOutcomeVerified
                          ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                          : 'bg-cyan-500/80 hover:bg-cyan-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-[10px] mt-2 font-mono text-slate-400">
                    {h.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hostel & Facility Water Comparison Table */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Hostel & Facility Water Consumption Intensity Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Residential hostels carry 78% of campus domestic water requirement
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Target: &lt;135 L/student/day
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Node / Residence</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Residents</th>
                <th className="py-2.5 px-3">Monthly Litres</th>
                <th className="py-2.5 px-3">L / Resident / Day</th>
                <th className="py-2.5 px-3">Meter Telemetry</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nodes.map(node => {
                const isCritical = node.status === 'critical';
                return (
                  <tr key={node.id} className={`transition-colors ${isCritical ? 'bg-rose-950/20' : 'hover:bg-slate-800/40'}`}>
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[11px]">{node.code}</span>
                      <span>{node.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 capitalize">{node.type}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{node.population.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {node.metrics.waterLitres.toLocaleString()} L
                    </td>
                    <td className={`py-3 px-3 font-mono font-bold ${
                      isCritical ? 'text-rose-400 text-sm' : 'text-cyan-300'
                    }`}>
                      {node.metrics.waterPerStudentPerDay.toFixed(1)} L/d
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                      {node.meterIds.water || 'Manual Log'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCritical 
                          ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {isCritical ? 'LEAK ALERT (+32%)' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
