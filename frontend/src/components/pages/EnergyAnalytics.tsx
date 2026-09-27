import React, { useState } from 'react';
import { 
  Zap, 
  Sun, 
  BatteryCharging, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Building2,
  Info
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { HISTORICAL_12_MONTHS } from '../../data/mockCampusData';

export const EnergyAnalytics: React.FC = () => {
  const { nodes, mode } = useCampus();
  const [selectedFacility, setSelectedFacility] = useState<string>('all');

  const totalCampusEnergy = nodes.reduce((sum, n) => sum + n.metrics.energyKWh, 0);
  const totalSolar = 37900; // kWh generated from rooftop solar
  const solarShare = ((totalSolar / totalCampusEnergy) * 100).toFixed(1);
  const totalPopulation = nodes.reduce((sum, n) => sum + n.population, 0);
  const avgKwhPerStudent = (totalCampusEnergy / totalPopulation).toFixed(1);

  // SVG Chart dimensions
  const maxEnergy = Math.max(...HISTORICAL_12_MONTHS.map(m => m.energyKWh));
  const minEnergy = Math.min(...HISTORICAL_12_MONTHS.map(m => m.energyKWh)) * 0.9;

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Consumption</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalCampusEnergy.toLocaleString()} <span className="text-sm font-normal text-slate-400">kWh/mo</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Grid Incomer: 207,200 kWh</span>
            <span className="text-emerald-400 font-semibold">-1.2% MoM</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Per-Capita Load</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{avgKwhPerStudent} <span className="text-sm font-normal text-slate-400">kWh/student</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Benchmark: 42.0 kWh</span>
            <span className="text-amber-400 font-semibold">+12% vs Standard</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Clean Solar Offset</span>
            <Sun className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{solarShare}% <span className="text-sm font-normal text-slate-400">({totalSolar.toLocaleString()} kWh)</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>150 kWp Rooftop Arrays</span>
            <span className="text-emerald-400 font-semibold">27.1 tCO₂e Saved</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Telemetry Provenance</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">98% <span className="text-sm font-normal text-slate-400">Confidence</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span className="truncate">Modbus TCP Feeder Gateway</span>
            <span className="text-slate-300">Verified</span>
          </div>
        </div>
      </div>

      {/* 12-Month Historical Trend & Anomaly Engine Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 12-Month SVG Chart */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                12-Month Campus Electricity & Solar History (Oct 2025 – Sept 2026)
              </h3>
              <p className="text-xs text-slate-400">
                Historical monthly consumption with seasonal cooling trends and solar generation
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-amber-500" /> Total Energy
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-emerald-500" /> Solar PV
              </span>
            </div>
          </div>

          {/* SVG Bar / Area Chart */}
          <div className="w-full h-64 bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-end">
            <div className="w-full h-48 flex items-end justify-between gap-1.5 pt-4">
              {HISTORICAL_12_MONTHS.map((item, idx) => {
                const totalHeightPercent = ((item.energyKWh - minEnergy) / (maxEnergy - minEnergy)) * 80 + 15;
                const solarHeightPercent = (item.solarKWh / item.energyKWh) * totalHeightPercent;
                const isCurrent = idx === HISTORICAL_12_MONTHS.length - 1;

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-slate-950 border border-slate-700 p-2 rounded-lg text-[10px] text-white pointer-events-none z-30 shadow-xl min-w-28 text-center">
                      <div className="font-bold text-amber-400">{item.month} {item.year}</div>
                      <div>Total: {item.energyKWh.toLocaleString()} kWh</div>
                      <div className="text-emerald-400">Solar: {item.solarKWh.toLocaleString()} kWh</div>
                      <div className="text-cyan-400">Score: {item.greenScore} pts</div>
                    </div>

                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[32px] rounded-t transition-all duration-300 relative overflow-hidden ${
                        isCurrent ? 'bg-amber-500 ring-2 ring-amber-400/80' : 'bg-slate-700/80 hover:bg-slate-600'
                      }`}
                      style={{ height: `${totalHeightPercent}%` }}
                    >
                      {/* Solar portion at the bottom of the bar */}
                      <div 
                        className="w-full bg-emerald-500 absolute bottom-0 left-0"
                        style={{ height: `${(solarHeightPercent / totalHeightPercent) * 100}%` }}
                      />
                    </div>

                    {/* X-axis Label */}
                    <span className={`text-[10px] mt-2 font-mono ${isCurrent ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Anomaly Detection Engine Panel */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  ML Energy Anomaly Sentinel
                </h4>
                <p className="text-[11px] text-slate-400">
                  Rolling Isolation Forest & Baseline Z-score
                </p>
              </div>
            </div>

            {/* Historical CSE Anomaly Example from prompt */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">CSE Server Room Alert (April Event)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Resolved
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Expected Baseline:</span>
                  <span className="font-mono text-slate-200">43,100 kWh</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Recorded Actual:</span>
                  <span className="font-mono text-amber-300 font-bold">58,900 kWh</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                <span className="text-slate-400">Deviation: <strong className="text-amber-400">+36.7%</strong></span>
                <span className="text-cyan-400 font-semibold">Confidence: High (97%)</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Cause: 24/7 Precision AC condenser coil clogged + server expansion bypass. Rectified in 48 hours.
              </p>
            </div>

            {/* Current State Check */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Current Electrical Status: Nominal</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                September electricity across all 9 sub-meters matches seasonal cooling curve within ±3.2% confidence bands.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sampling: 15-min intervals</span>
            <span className="text-amber-400 font-semibold">Zero Unverified Drift</span>
          </div>
        </div>
      </div>

      {/* Granular Facility Breakdown Table */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Granular Building & Departmental Energy Intensity
            </h3>
            <p className="text-xs text-slate-400">
              Normalized against occupancy (kWh/student) and built-up area (kWh/m²) to find consumption hotspots
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Sorted by Total kWh
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Building / Node</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Population</th>
                <th className="py-2.5 px-3">Area (m²)</th>
                <th className="py-2.5 px-3">Monthly kWh</th>
                <th className="py-2.5 px-3">kWh / Person</th>
                <th className="py-2.5 px-3">kWh / m²</th>
                <th className="py-2.5 px-3">Meter ID</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nodes.map(node => (
                <tr key={node.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px]">{node.code}</span>
                    <span>{node.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 capitalize">{node.type}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{node.population.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{node.areaSqM.toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold text-amber-300 font-mono">{node.metrics.energyKWh.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-200 font-mono font-semibold">{node.metrics.energyPerStudent.toFixed(1)}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{node.metrics.energyPerSqM.toFixed(2)}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-cyan-400">{node.meterIds.energy || 'N/A'}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      OPTIMAL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
