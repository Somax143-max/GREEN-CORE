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
  CheckCircle2,
  HelpCircle,
  Wrench,
  RotateCcw,
  Clock,
  Database,
  Compass,
  MapPin
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { ScoreGauge } from '../common/ScoreGauge';
import { MetricCard } from '../common/MetricCard';
import { TabId } from '../layout/Navigation';
import { ScoreMethodologyModal } from '../modals/ScoreMethodologyModal';
import { DataLineageModal, MetricLineageData } from '../modals/DataLineageModal';
import { CampusMemoryTimeline } from '../features/CampusMemoryTimeline';

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
    simulateHostelBIntervention,
    verifyInterventionOutcome
  } = useCampus();

  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [selectedLineage, setSelectedLineage] = useState<MetricLineageData | null>(null);

  // Quick stats
  const totalStudents = nodes.reduce((sum, n) => sum + n.population, 0);
  const criticalNodes = nodes.filter(n => n.status === 'critical');
  const warningNodes = nodes.filter(n => n.status === 'warning');

  const isAnomalyActive = isHostelBAnomalyInjected && !isOutcomeVerified;

  const handleOpenLineage = (category: 'energy' | 'water' | 'waste' | 'transport') => {
    const lineages: Record<string, MetricLineageData> = {
      water: {
        metricName: 'Campus Total Water Consumption',
        observedValue: isAnomalyActive ? '9,130,000 Litres' : '8,420,000 Litres',
        period: '01–30 September 2026',
        sourceMeterId: 'WM-H2-205 (Hostel B Riser Manifold) + 3 Zone Main Meters',
        collectionProtocol: mode === 'iot' ? 'LoRaWAN Packet Gateway (IN865 Band)' : mode === 'hybrid' ? 'Sub-meter LoRaWAN + Manual Hand Logbook' : 'Manual Dial Register Sheets',
        frequency: '15 Minutes Interval Logging',
        recordsCount: 2880,
        missingDataPct: 0.7,
        validationStatus: isAnomalyActive ? 'ANOMALY DETECTED (Z = 4.82σ)' : 'PASS (Within seasonal confidence band)',
        lastVerified: new Date().toISOString(),
        confidencePct: mode === 'iot' ? 98 : mode === 'hybrid' ? 91 : 62,
        formulaTrace: 'TotalWater = Sum(Academic_Flow_Meters) + Sum(Hostel_Inlet_Headers) + STP_Recycled_Offset',
        responsibleAuditor: 'Dr. S. K. Mahapatra (Lead Auditor, ECO CLUB GCEK)'
      },
      energy: {
        metricName: 'Campus Active Grid Electricity',
        observedValue: '222,300 kWh',
        period: '01–30 September 2026',
        sourceMeterId: 'EM-CSE-101, EM-ECE-102, EM-ME-301, 11kV Incomer Feeder',
        collectionProtocol: mode === 'manual' ? 'Physical Dial Logbook' : 'Modbus-TCP RTU Gateway over Optical Fiber',
        frequency: '15 Minutes Interval Logging',
        recordsCount: 2880,
        missingDataPct: 0.2,
        validationStatus: 'PASS (Monotonicity and range verified)',
        lastVerified: new Date().toISOString(),
        confidencePct: mode === 'iot' ? 99 : mode === 'hybrid' ? 98 : 65,
        formulaTrace: 'TotalEnergy = TPCODL_11kV_Feeder_kWh - Rooftop_Solar_Export_Offset',
        responsibleAuditor: 'Er. Rajesh Patra (Assistant Executive Engineer - Electrical)'
      },
      waste: {
        metricName: 'Solid Waste Landfill Diversion Rate',
        observedValue: '83.4% Diverted (6,105 kg / 7,320 kg)',
        period: '01–30 September 2026',
        sourceMeterId: 'SM-SAC-401 (Kitchen Electronic Scale) + Composter Logbook',
        collectionProtocol: 'Digital Weighbridge Bluetooth Terminal + Hand Register',
        frequency: 'Daily Batch Logging (07:30 PM)',
        recordsCount: 30,
        missingDataPct: 0.0,
        validationStatus: 'PASS (Contractor slips verified with SHA-256 digest)',
        lastVerified: new Date().toISOString(),
        confidencePct: 89,
        formulaTrace: 'DiversionRate = (Organic_Composted_kg + Recycled_Dry_Waste_kg) / Total_Waste_kg * 100',
        responsibleAuditor: 'Prof. Ananya Jena (Faculty In-Charge, Eco Club)'
      },
      transport: {
        metricName: 'Commute Decarbonization & Modal Split',
        observedValue: '88% Active / Public Transit • 0.1102 kg CO2 / capita / day',
        period: 'August–September 2026',
        sourceMeterId: 'Annual Mobility Survey (SRV-2026-SEP) + RFID Turnstile Gate Count',
        collectionProtocol: 'Google Workspace Single Sign-On Survey (1,842 respondents) + Main Gate Turnstile Sensor',
        frequency: 'Annual Baseline + Monthly Gate Sample Calibration',
        recordsCount: 1842,
        missingDataPct: 2.1,
        validationStatus: 'PASS (Statistically representative at 95% CI ±2.1% margin)',
        lastVerified: new Date().toISOString(),
        confidencePct: 76,
        formulaTrace: 'Daily_CO2 = Sum(Mode_Share_i * Emission_Factor_i * 8.4 km) / 1000',
        responsibleAuditor: 'Student Welfare & Eco Club Mobility Cell'
      }
    };

    setSelectedLineage(lineages[category] || lineages.water);
  };

  return (
    <div className="space-y-6">
      {/* 🌟 HUMAN-FRIENDLY EXECUTIVE STORYLINE: WHERE, WHAT, WHY & HOW */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 rounded-2xl p-5 border border-slate-700/80 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                Campus Executive Summary • GCE Kalahandi
              </span>
              <h2 className="text-base font-extrabold text-white">
                Where We Stand, What Needs Attention, and How to Fix It
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono font-medium">
              3,730 People • 9 Buildings
            </span>
            <button
              onClick={() => onNavigateTab('twin')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Step Storyline Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: WHERE WE ARE */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                1. Where We Stand (Overall Health)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white">{scores.compositeScore}</span>
                <span className="text-xs font-semibold text-slate-400">/ 100</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  scores.compositeScore >= 80 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {scores.compositeScore >= 80 ? 'Grade A (Target Met)' : 'Grade B'}
                </span>
              </div>
              <p className="text-slate-300 mt-2 leading-relaxed">
                Campus is outperforming in <strong>Energy (100)</strong> and <strong>Waste (74)</strong>. 
                {isAnomalyActive 
                  ? ' Water is currently suffering a -4.8 point drag from an active leak.' 
                  : ' All 4 pillars are operating within healthy target bounds.'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>National Target: 85.0</span>
              <span className="text-emerald-400 font-bold">✓ Met</span>
            </div>
          </div>

          {/* Card 2: WHAT IS THE PROBLEM */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
            isAnomalyActive 
              ? 'bg-rose-950/30 border-rose-600/60 shadow-lg shadow-rose-950/20' 
              : 'bg-emerald-950/20 border-emerald-700/50'
          }`}>
            <div>
              <span className={`text-[10px] font-mono uppercase font-bold block ${
                isAnomalyActive ? 'text-rose-300' : 'text-emerald-300'
              }`}>
                2. Where The Problem Is (Active Alert)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <AlertTriangle className={`w-5 h-5 shrink-0 ${isAnomalyActive ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                <span className="text-sm font-bold text-white">
                  {isAnomalyActive ? 'Hostel B (Indravati Hall)' : 'Zero Active Leaks Detected'}
                </span>
              </div>
              <p className="text-slate-300 mt-2 leading-relaxed">
                {isAnomalyActive 
                  ? '3,200 L/hr night-flow surge detected between 1:00 AM and 4:30 AM while students were asleep. Wasting 580,000 L/month.'
                  : 'Hostel B pipe has been sealed. Ultrasonic flow meters confirm night flow returned to normal 140 L/hr.'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">{isAnomalyActive ? 'Financial Waste:' : 'Verified Savings:'}</span>
              <span className={isAnomalyActive ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {isAnomalyActive ? '₹18,400 / month' : '₹18,400 / month saved'}
              </span>
            </div>
          </div>

          {/* Card 3: HOW WE FIX IT */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                3. How We Fix It (1-Click Action)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Work Order #WO-409</span>
              </div>
              <p className="text-slate-300 mt-2 leading-relaxed">
                Plumber Mohan Das replaces the damaged float valve on 2nd floor west-wing manifold.
              </p>
            </div>
            
            <div className="pt-2">
              {isOutcomeVerified ? (
                <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fix Verified: +4.8 pts &amp; Saved ₹18.4k</span>
                </div>
              ) : (
                <button
                  onClick={() => verifyInterventionOutcome()}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-center transition-all hover:scale-[1.02] shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>👉 1-Click Fix &amp; Verify (+4.8 pts)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Defensible GreenScore Card + 4 Pillar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Defensible GREENCORE SCORE Card (User Req: Bar breakdown, confidence, baseline, why button) */}
        <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                  Sept 2026 Audit Cycle
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">GREENCORE SCORE</h2>
              </div>
              <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Methodology v1.2
              </div>
            </div>

            {/* Score Big Display */}
            <div className="flex items-baseline justify-between py-2 border-b border-slate-800">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-white tracking-tight">{scores.compositeScore}</span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                scores.delta >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {scores.delta >= 0 ? `+${scores.delta}` : scores.delta} vs baseline
              </span>
            </div>

            {/* 4 Pillar Category Breakdown Bars (Defensible Visualization) */}
            <div className="space-y-2.5 mt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Energy
                  </span>
                  <span className="font-mono text-white font-bold">{scores.energyScore}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.energyScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" /> Water
                  </span>
                  <span className="font-mono text-white font-bold">{scores.waterScore}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.waterScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Waste
                  </span>
                  <span className="font-mono text-white font-bold">{scores.wasteScore}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.wasteScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5" /> Transport
                  </span>
                  <span className="font-mono text-white font-bold">{scores.transportScore}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.transportScore}%` }} />
                </div>
              </div>
            </div>

            {/* Defensible Metadata: Confidence, Baseline, Change */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Confidence</span>
                <span className="text-sm font-black text-cyan-400">{scores.dataConfidence}%</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Baseline</span>
                <span className="text-sm font-black text-slate-300">76.0</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Change</span>
                <span className={`text-sm font-black ${scores.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {scores.delta >= 0 ? `+${scores.delta}` : scores.delta}
                </span>
              </div>
            </div>
          </div>

          {/* HOW IS THIS SCORE CALCULATED? Button */}
          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02]"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>HOW IS THIS SCORE CALCULATED?</span>
          </button>
        </div>

        {/* Right: 4 Domain Pillar Cards with Clickable Lineage */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard
              title="1. Energy & Solar"
              category="energy"
              value="222,300"
              unit="kWh"
              subValue="⚡ 59.5 kWh/student • 42.6% Clean Rooftop Solar"
              score={scores.energyScore}
              scoreDelta={+0.6}
              confidence={scores.categoryConfidence.energy}
              provenance="Substation 11kV Feeder + Delta Solar Telemetry"
              icon={<Zap className="w-5 h-5" />}
              onClick={() => handleOpenLineage('energy')}
            />

            <MetricCard
              title="2. Water & Leaks"
              category="water"
              value={isAnomalyActive ? "9,130,000" : "8,420,000"}
              unit="Litres"
              subValue={isAnomalyActive 
                ? "💧 81.5 L/day • ⚠️ Hostel B Leak (3,200 L/hr)" 
                : "💧 72.4 L/day • Optimal Baseline (No Leaks)"}
              score={scores.waterScore}
              scoreDelta={isAnomalyActive ? -14.0 : +2.5}
              confidence={scores.categoryConfidence.water}
              provenance="Zone Ultrasonic Flow Meters (LoRaWAN)"
              icon={<Droplets className="w-5 h-5" />}
              warning={isAnomalyActive}
              onClick={() => handleOpenLineage('water')}
            />

            <MetricCard
              title="3. Waste & Recycling"
              category="waste"
              value="7,320"
              unit="kg"
              subValue="♻️ 83.4% Diverted to Compost & Biogas (Avoiding Landfill)"
              score={scores.wasteScore}
              scoreDelta={+0.8}
              confidence={scores.categoryConfidence.waste}
              provenance="Central Dining Weighbridge Scale Registers"
              icon={<Trash2 className="w-5 h-5" />}
              onClick={() => handleOpenLineage('waste')}
            />

            <MetricCard
              title="4. Travel & Mobility"
              category="transport"
              value="976.0"
              unit="kg CO₂/day"
              subValue="🚲 88% Students & Staff Walk, Cycle, or Take Campus Bus"
              score={scores.transportScore}
              scoreDelta={+0.0}
              confidence={scores.categoryConfidence.transport}
              provenance="Annual Mobility Survey (1,842 respondents)"
              icon={<Bike className="w-5 h-5" />}
              onClick={() => handleOpenLineage('transport')}
            />
          </div>

          {/* Quick Data Lineage Help Banner */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              💡 <strong>Auditor Tip:</strong> Click any of the 4 metric cards above to view full Data Lineage & Provenance metadata.
            </span>
            <button
              onClick={() => handleOpenLineage('water')}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
            >
              View Water Lineage
            </button>
          </div>
        </div>
      </div>

      {/* Feature 12 & 13: "WHY DID MY SCORE CHANGE?" and "WHAT SHOULD WE DO?" Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WHY DID THE SCORE CHANGE? (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white">
                WHY DID THE SCORE CHANGE?
              </h3>
            </div>
            <div className="font-mono text-xs font-bold text-slate-300">
              82 → <span className={scores.compositeScore >= 80 ? 'text-emerald-400' : 'text-rose-400'}>{scores.compositeScore}</span> ({scores.delta >= 0 ? `+${scores.delta}` : scores.delta})
            </div>
          </div>

          {/* Component Contribution Breakdown */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 block font-bold">Water</span>
              <span className={`font-mono font-black ${isAnomalyActive ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isAnomalyActive ? '-4.8' : '+0.2'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 block font-bold">Energy</span>
              <span className="font-mono font-black text-emerald-400">+0.6</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-emerald-400 block font-bold">Waste</span>
              <span className="font-mono font-black text-emerald-400">+0.8</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-indigo-400 block font-bold">Transport</span>
              <span className="font-mono font-black text-slate-400">+0.0</span>
            </div>
          </div>

          {/* Plain English Summary Callout */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <span className="text-amber-400 font-bold shrink-0">💡 Plain English:</span>
            <span>
              {isAnomalyActive 
                ? 'Campus made gains in Energy (+0.6) and Waste (+0.8), but took a -4.8 point drag solely due to the hidden toilet valve leak in Hostel B.'
                : 'All 4 pillars are operating in equilibrium, maintaining an official A-Grade GreenScore of 85/100.'}
            </span>
          </div>

          {/* Primary Driver */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold uppercase tracking-wider text-rose-400">
                Primary Driver: {isAnomalyActive ? 'Hostel B Water Rupture' : 'Normal Seasonal Operations'}
              </span>
              <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800 font-bold">
                {isAnomalyActive ? '+32.4% Surge' : 'Equilibrium'}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              {isAnomalyActive ? (
                <>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-rose-400">●</span> 11 consecutive readings above 99th percentile threshold
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-rose-400">●</span> Biometric occupancy delta was only +2.1% (rules out human surge)
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-rose-400">●</span> Night flow reached 3,200 L/hr (01:00 AM - 04:30 AM)
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-rose-400">●</span> Isolation Forest confidence: <strong>94.2%</strong>
                  </div>
                </>
              ) : (
                <div className="text-slate-400 italic">
                  All 9 campus nodes are operating within normal baseline bounds.
                </div>
              )}
            </div>

            <button
              onClick={() => handleOpenLineage('water')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>[VIEW EVIDENCE & DATA LINEAGE]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* WHAT SHOULD WE DO? (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-white">
                  ACTION PLAN (WHAT SHOULD WE DO?)
                </h3>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                PRIORITY 1
              </span>
            </div>

            <div className="space-y-3 mt-3">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Investigate & Repair Hostel B Water System
                </h4>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span className="text-slate-400">Impact: <strong className="text-emerald-400">HIGH</strong></span>
                  <span className="text-slate-400">Effort: <strong className="text-cyan-400">LOW</strong></span>
                  <span className="text-slate-400">Urgency: <strong className="text-rose-400">CRITICAL</strong></span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Hostel B is consuming 32.4% above normal baseline, draining 580,000 L of excess water/month.
                Expected outcome: <strong>↓ 15–25% water consumption (saves ₹18,400/mo; +4.8 GreenScore pts)</strong>.
              </p>

              {/* Action Checklist */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. Inspect overnight flow sensor WM-H2-205</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Isolate west-wing washroom ball valve</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3. Replace damaged float valve assembly</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>4. Recheck pressure & monitor live LoRaWAN telemetry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Dispatcher / Verification Trigger */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">
              Assignee: <strong>Mohan Das (Plumber Lead)</strong>
            </span>

            {isOutcomeVerified ? (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Work Order #WO-409 Verified
              </span>
            ) : (
              <button
                onClick={() => {
                  verifyInterventionOutcome();
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-md shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Dispatch & Verify Fix (WO-409)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature 11: BEFORE -> AFTER Closed-Loop Impact Card (When verified) */}
      {isOutcomeVerified && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-2 border-emerald-500/60 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                Closed-Loop Verification Complete: Hostel B Intervention
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded border border-emerald-700">
              OUTCOME VERIFIED ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Before Repair</span>
              <span className="text-base font-black text-rose-400">188 L / student / day</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">+32.4% Leak Surge</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">After Repair</span>
              <span className="text-base font-black text-emerald-400">149 L / student / day</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">140 L/hr Night Flow</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Verified Reduction</span>
              <span className="text-base font-black text-cyan-400">20.7% Drop</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">580,000 L / month saved</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Annual Savings</span>
              <span className="text-base font-black text-amber-400">₹18,400 / month</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">420 kg CO₂e Avoided</span>
            </div>
          </div>
        </div>
      )}

      {/* Feature 20: 🌱 GREENCORE "CAMPUS MEMORY" Signature Timeline */}
      <CampusMemoryTimeline />

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
              className="ml-2 font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore 3D Twin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 9 Nodes Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nodes.map(node => (
            <button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                      {node.code}
                    </span>
                    <span className="text-xs font-bold text-slate-100 truncate">{node.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 capitalize">{node.type} • {node.buildingType}</span>
                </div>

                <span className={`w-2 h-2 rounded-full mt-1 ${
                  node.status === 'optimal' ? 'bg-emerald-400' : node.status === 'warning' ? 'bg-amber-400' : 'bg-rose-500 animate-ping'
                }`} />
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-850 text-center text-[10px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block">Energy</span>
                  <span className="text-slate-200 font-bold">{(node.metrics.energyKWh / 1000).toFixed(1)}k</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Water</span>
                  <span className={`font-bold ${node.id === 'hostel_h2' && isAnomalyActive ? 'text-rose-400' : 'text-slate-200'}`}>
                    {(node.metrics.waterLitres / 1000).toFixed(0)}kL
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Waste</span>
                  <span className="text-slate-200 font-bold">{node.metrics.wasteKg}kg</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ScoreMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <DataLineageModal
        isOpen={selectedLineage !== null}
        onClose={() => setSelectedLineage(null)}
        lineage={selectedLineage}
      />
    </div>
  );
};
