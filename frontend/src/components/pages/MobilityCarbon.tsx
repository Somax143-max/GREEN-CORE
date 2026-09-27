import React from 'react';
import { 
  Bike, 
  Car, 
  Bus, 
  Footprints, 
  Globe2, 
  Fuel, 
  ShieldCheck, 
  Database, 
  FileText, 
  Zap, 
  Trash2, 
  Droplets,
  ArrowUpRight
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const MobilityCarbon: React.FC = () => {
  const { methodology } = useCampus();

  const totalCarbonMonthlyTons = 184.2;
  const annualFootprintTons = +(totalCarbonMonthlyTons * 12).toFixed(1); // ~2,210 tCO2e

  const scopes = [
    {
      scope: 'Scope 1: Direct Combustion',
      emissionsTons: 14.8,
      share: 8.0,
      color: '#f59e0b',
      sources: 'Backup DG Sets (Diesel) + Campus Maintenance Vans',
      factor: '2.68 kg CO₂ / Litre High-Speed Diesel',
      ref: 'IPCC Guidelines for National GHG Inventories',
      confidence: 94,
    },
    {
      scope: 'Scope 2: Purchased Electricity',
      emissionsTons: 114.2,
      share: 62.0,
      color: '#06b6d4',
      sources: '11kV Grid Incomer (207,200 kWh grid load after solar)',
      factor: '0.716 kg CO₂ / kWh (Eastern Regional Grid CEA v19)',
      ref: 'Central Electricity Authority (CEA) CO₂ Baseline Database India',
      confidence: 98,
    },
    {
      scope: 'Scope 3: Indirect Mobility & Waste',
      emissionsTons: 55.2,
      share: 30.0,
      color: '#8b5cf6',
      sources: 'Student/Faculty Daily Commute + Landfill Waste Methane + Water Pumping',
      factor: 'Survey Model (1,842 respondents × 4.2 km avg return trip)',
      ref: 'GHG Protocol Corporate Value Chain / DEFRA Transport 2025',
      confidence: 76,
    }
  ];

  const modalSplit = [
    { mode: 'Walking / Pedestrian', share: 48, icon: <Footprints className="w-4 h-4 text-emerald-400" />, co2PerKm: '0.00 kg', count: '2,496 students' },
    { mode: 'Bicycles & Campus Cycles', share: 26, icon: <Bike className="w-4 h-4 text-cyan-400" />, co2PerKm: '0.00 kg', count: '1,352 students' },
    { mode: 'Shared Campus & Public Bus', share: 14, icon: <Bus className="w-4 h-4 text-indigo-400" />, co2PerKm: '0.03 kg', count: '728 users' },
    { mode: 'Two-Wheeler (Petrol Bike/Scooter)', share: 8, icon: <Fuel className="w-4 h-4 text-amber-400" />, co2PerKm: '0.045 kg', count: '416 users' },
    { mode: 'Private Passenger Car', share: 4, icon: <Car className="w-4 h-4 text-rose-400" />, co2PerKm: '0.14 kg', count: '208 faculty/staff' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Carbon Ledger Highlight */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                GHG Protocol Aligned • ISO 14064 Standard
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                Audit Verified
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-indigo-400" />
              Campus Carbon Ledger & Mobility Footprint
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Transparent greenhouse gas inventory quantified across Scope 1, Scope 2, and Scope 3 with visible emission factors and source citations.
            </p>
          </div>

          <div className="text-left md:text-right bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Annual Footprint</span>
            <span className="text-3xl font-black text-white tracking-tight">{annualFootprintTons.toLocaleString()}</span>
            <span className="text-xs font-semibold text-slate-400 ml-1">tCO₂e / year</span>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              0.42 tCO₂e / student / year
            </div>
          </div>
        </div>

        {/* Proportional Carbon Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-semibold">
            <span>Emissions by Source: Energy (62%) • Transport & Commute (24%) • Direct/Waste (14%)</span>
            <span className="text-cyan-400 font-mono text-[11px]">Period: Sept 2026</span>
          </div>

          <div className="w-full h-5 bg-slate-950 rounded-lg overflow-hidden flex p-0.5 border border-slate-800">
            <div style={{ width: '62%' }} className="bg-cyan-500 h-full rounded-l" title="Electricity 62%" />
            <div style={{ width: '24%' }} className="bg-indigo-500 h-full" title="Transport 24%" />
            <div style={{ width: '14%' }} className="bg-amber-500 h-full rounded-r" title="Direct Diesel & Waste 14%" />
          </div>
        </div>
      </div>

      {/* Scopes 1, 2, 3 Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scopes.map(item => (
          <div key={item.scope} className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.scope}
                </span>
                <span className="font-mono text-slate-400 font-bold">{item.share}%</span>
              </div>

              <div className="text-2xl font-black text-white mt-1">
                {item.emissionsTons} <span className="text-xs font-normal text-slate-400">tCO₂e / month</span>
              </div>

              <p className="text-xs text-slate-300 mt-2 font-medium">
                {item.sources}
              </p>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Emission Factor:</span>
                  <span className="font-mono text-cyan-300">{item.factor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Citation:</span>
                  <span className="text-slate-300 italic">{item.ref}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                Verified Registry
              </span>
              <span className="text-cyan-400 font-semibold">{item.confidence}% Confidence</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Split and Commute Analytics */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bike className="w-4 h-4 text-emerald-400" />
              Campus Mobility Survey & Modal Split (GCEK)
            </h3>
            <p className="text-xs text-slate-400">
              74% Active Clean Commute (Walking & Cycling) keeps campus per-capita mobility emissions well below national university averages
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
            Sample: 1,842 Survey Responses
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {modalSplit.map(m => (
            <div key={m.mode} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-800/80">
                    {m.icon}
                  </div>
                  <span className="text-lg font-black text-white">{m.share}%</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mt-2.5 leading-snug">{m.mode}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{m.count}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                <span>Emission:</span>
                <span className="font-mono text-slate-200 font-bold">{m.co2PerKm}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
