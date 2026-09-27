import React from 'react';
import { 
  Trash2, 
  Recycle, 
  Leaf, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  AlertCircle,
  PieChart
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const WasteAnalytics: React.FC = () => {
  const { nodes } = useCampus();

  const totalCampusWasteKg = 4910;
  const compostedKg = 1280; // 26.1%
  const recycledKg = 2854; // 58.1%
  const recoveredKg = 266; // 5.4%
  const landfilledKg = 510; // 10.4%
  
  // Waste Diversion Rate = (recycled + composted + recovered) / total waste * 100
  const divertedKg = recycledKg + compostedKg + recoveredKg;
  const diversionRate = ((divertedKg / totalCampusWasteKg) * 100).toFixed(1); // 89.6%

  const categories = [
    { name: 'Organic / Wet Food Waste', weightKg: 2950, share: 60.1, dest: 'Aerobic Compost Pit & Biogas', color: '#10b981', icon: '🍎' },
    { name: 'Paper & Cardboard', weightKg: 840, share: 17.1, dest: 'Recycling Pulp Mill Contractor', color: '#06b6d4', icon: '📄' },
    { name: 'Single-Use & Hard Plastic', weightKg: 580, share: 11.8, dest: 'Baled for Pyrolysis / Recycler', color: '#f59e0b', icon: '🧴' },
    { name: 'Metals & Beverage Cans', weightKg: 210, share: 4.3, dest: 'Scrap Metal Recycler', color: '#8b5cf6', icon: '🥫' },
    { name: 'Glass Containers', weightKg: 140, share: 2.9, dest: 'Glass Remelting Batch', color: '#ec4899', icon: '🍾' },
    { name: 'E-Waste & Computer Scrap', weightKg: 110, share: 2.2, dest: 'Authorized PCB E-Waste Dismantler', color: '#6366f1', icon: '💻' },
    { name: 'Residual Non-Recyclable', weightKg: 80, share: 1.6, dest: 'Municipal Sanitary Landfill', color: '#64748b', icon: '🗑' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Diversion Rate Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-emerald-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-emerald-400">Waste Diversion Rate</span>
            <Recycle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{diversionRate}%</div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Diverted: {divertedKg.toLocaleString()} kg</span>
            <span className="text-emerald-400 font-semibold">+10.2% YoY</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Generation</span>
            <Trash2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalCampusWasteKg.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg/mo</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>0.94 kg / capita / mo</span>
            <span className="text-slate-300">Target &lt;1.2 kg</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Landfill Residual</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{landfilledKg.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Only 10.4% to Landfill</span>
            <span className="text-emerald-400 font-semibold">-18% Reduction</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Data Provenance</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">89% <span className="text-sm font-normal text-slate-400">Confidence</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Weighbridge Scale Logs</span>
            <span className="text-slate-300">Signed Daily</span>
          </div>
        </div>
      </div>

      {/* Waste Stream Diversion Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Destination Split Bar */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-400" />
                Waste Destination Split & Diversion Formula
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Formula: (Recycled + Composted + Recovered) / Total × 100 = <strong>{diversionRate}%</strong>
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              Grade A Diversion
            </span>
          </div>

          {/* Visual Destination Multi-Segment Bar */}
          <div className="w-full h-8 bg-slate-950 rounded-xl overflow-hidden flex p-1 border border-slate-800">
            <div 
              style={{ width: `${(recycledKg / totalCampusWasteKg) * 100}%` }} 
              className="bg-cyan-500 h-full rounded-l transition-all"
              title={`Recycled: ${recycledKg} kg (58.1%)`}
            />
            <div 
              style={{ width: `${(compostedKg / totalCampusWasteKg) * 100}%` }} 
              className="bg-emerald-500 h-full transition-all"
              title={`Composted: ${compostedKg} kg (26.1%)`}
            />
            <div 
              style={{ width: `${(recoveredKg / totalCampusWasteKg) * 100}%` }} 
              className="bg-purple-500 h-full transition-all"
              title={`Recovered: ${recoveredKg} kg (5.4%)`}
            />
            <div 
              style={{ width: `${(landfilledKg / totalCampusWasteKg) * 100}%` }} 
              className="bg-slate-600 h-full rounded-r transition-all"
              title={`Landfill: ${landfilledKg} kg (10.4%)`}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Recycled</span>
              </div>
              <div className="text-base font-extrabold text-white mt-1">{recycledKg.toLocaleString()} kg</div>
              <span className="text-[10px] text-slate-400">58.1% of stream</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Composted</span>
              </div>
              <div className="text-base font-extrabold text-white mt-1">{compostedKg.toLocaleString()} kg</div>
              <span className="text-[10px] text-slate-400">26.1% of stream</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Recovered</span>
              </div>
              <div className="text-base font-extrabold text-white mt-1">{recoveredKg.toLocaleString()} kg</div>
              <span className="text-[10px] text-slate-400">5.4% RDF / Bio</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span>Landfill</span>
              </div>
              <div className="text-base font-extrabold text-white mt-1">{landfilledKg.toLocaleString()} kg</div>
              <span className="text-[10px] text-slate-400">10.4% Residual</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs">
            <span className="font-bold text-emerald-400 block mb-0.5">Campus Compost Output:</span>
            <p className="text-slate-300 text-[11px] leading-snug">
              Central Cafeteria wet food waste produces ~450 kg of rich organic compost per month, utilized entirely by the GCEK horticulture nursery, eliminating chemical fertilizer purchases.
            </p>
          </div>
        </div>

        {/* Right: Segregation by Category Table */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Detailed Waste Stream Segregation
              </h3>
              <p className="text-xs text-slate-400">
                Audited monthly quantities across 7 physical categories
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">7 Fractions</span>
          </div>

          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.name} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{cat.icon}</span>
                  <div>
                    <span className="font-bold text-white block">{cat.name}</span>
                    <span className="text-[10px] text-slate-400">{cat.dest}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-white">{cat.weightKg.toLocaleString()} kg</span>
                  <div className="text-[10px] font-semibold" style={{ color: cat.color }}>
                    {cat.share}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
