import React, { useState } from 'react';
import { 
  History, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Zap, 
  Droplet, 
  Trash2, 
  Compass,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export interface MemoryMilestone {
  id: string;
  monthYear: string;
  title: string;
  category: 'baseline' | 'energy' | 'water' | 'waste' | 'transport' | 'action';
  description: string;
  impactSummary: string;
  evidenceId: string;
  metricChange: string;
}

export const CampusMemoryTimeline: React.FC = () => {
  const { isHostelBAnomalyInjected, isOutcomeVerified } = useCampus();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>('MEM-05');

  const milestones: MemoryMilestone[] = [
    {
      id: 'MEM-01',
      monthYear: 'JAN 2026',
      title: 'Institutional Sustainability Baseline Established',
      category: 'baseline',
      description: 'Comprehensive multi-vector audit conducted across 9 buildings to establish IGBC/BEE benchmarks.',
      impactSummary: 'Baseline score fixed at 76.0/100 across 3,730 campus occupants.',
      evidenceId: 'EV-BASE-2026',
      metricChange: 'Baseline: 76.0'
    },
    {
      id: 'MEM-02',
      monthYear: 'MAR 2026',
      title: '100% LED Retrofit in Central Library & CSE Block',
      category: 'energy',
      description: 'Replaced 480 conventional fluorescent tubes with 18W high-efficacy LED fittings and occupancy PIR sensors.',
      impactSummary: 'Annual energy reduction of 18,400 kWh (saved ₹1,51,000/yr).',
      evidenceId: 'EV-LED-2026',
      metricChange: 'Energy +4.2 pts'
    },
    {
      id: 'MEM-03',
      monthYear: 'MAY 2026',
      title: 'Kitchen Waste Bio-Digester Commissioned',
      category: 'waste',
      description: 'Installed 250 kg/day anaerobic bio-methanation unit in Central Dining complex for organic wet waste.',
      impactSummary: 'Waste diversion increased from 61% to 78%; 14 m³ biogas/day generated for cooking.',
      evidenceId: 'EV-BIO-2026',
      metricChange: 'Waste +6.8 pts'
    },
    {
      id: 'MEM-04',
      monthYear: 'JUL 2026',
      title: 'Bicycle Sharing Racks & EV Charging Station',
      category: 'transport',
      description: 'Deployed 40 GPS-enabled campus bicycles and 2 dual-gun AC Level 2 electric vehicle chargers.',
      impactSummary: 'Cut private motorized commute by 8.4%; avoided 3.2 tCO₂/month.',
      evidenceId: 'EV-MOB-2026',
      metricChange: 'Transport +2.5 pts'
    },
    {
      id: 'MEM-05',
      monthYear: 'SEP 2026',
      title: 'Hostel B Pipe Rupture Detected by ML Sentinel',
      category: 'water',
      description: 'At 03:15 AM, LoRaWAN flow meter WM-H2-205 recorded a 32.4% midnight surge (3,200 L/hr).',
      impactSummary: 'Instant anomaly alert triggered, isolating leak to 2nd Floor West Wing flush manifold.',
      evidenceId: 'EV-ANOM-2026',
      metricChange: 'Water -4.8 pts'
    }
  ];

  if (isOutcomeVerified) {
    milestones.push({
      id: 'MEM-06',
      monthYear: 'SEP 2026',
      title: 'Work Order WO-409 Dispatched & Valve Replaced',
      category: 'action',
      description: 'Campus maintenance replaced sheared valve within 90 minutes of autonomous system dispatch.',
      impactSummary: 'Overnight flow normalized back to 140 L/hr. Outcome verified via 60-min telemetry.',
      evidenceId: 'EV-WO-409',
      metricChange: 'Water +5.1 pts restored'
    });
  }

  const activeMilestone = milestones.find(m => m.id === selectedMilestone) || milestones[milestones.length - 1];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'water': return <Droplet className="w-3.5 h-3.5 text-cyan-400" />;
      case 'waste': return <Trash2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'transport': return <Compass className="w-3.5 h-3.5 text-indigo-400" />;
      case 'action': return <Wrench className="w-3.5 h-3.5 text-emerald-300" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                🌱 GREENCORE "CAMPUS MEMORY"
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                Temporal Twin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Living institutional timeline of interventions, anomalies, and verified outcomes
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          {milestones.length} Historical Milestones
        </span>
      </div>

      {/* Horizontal / Wrapped Timeline Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
        {milestones.map((m, idx) => {
          const isSelected = selectedMilestone === m.id;
          const isAlert = m.category === 'water' && m.id === 'MEM-05' && !isOutcomeVerified;

          return (
            <button
              key={m.id}
              onClick={() => setSelectedMilestone(m.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-800 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400'
                  : isAlert
                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="font-bold text-slate-300">{m.monthYear}</span>
                {getCategoryIcon(m.category)}
              </div>

              <div className="text-xs font-bold truncate text-slate-100">
                {m.title}
              </div>

              <div className="text-[10px] font-mono mt-1 font-semibold text-cyan-400">
                {m.metricChange}
              </div>

              {isAlert && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detailed Selected Milestone Card */}
      {activeMilestone && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 text-[11px]">
                {activeMilestone.monthYear}
              </span>
              <h4 className="font-bold text-sm text-white">{activeMilestone.title}</h4>
            </div>

            <span className="font-mono text-[11px] text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Impact: {activeMilestone.metricChange}
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            {activeMilestone.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
            <span className="text-emerald-300 font-medium">
              ✓ {activeMilestone.impactSummary}
            </span>
            <span className="font-mono text-cyan-400 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Evidence Doc: {activeMilestone.evidenceId}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
