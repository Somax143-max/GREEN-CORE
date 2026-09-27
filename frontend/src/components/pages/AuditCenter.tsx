import React, { useState } from 'react';
import { 
  FileCheck2, 
  Printer, 
  Download, 
  ShieldCheck, 
  Database, 
  Sliders, 
  History, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Calendar,
  Lock,
  ExternalLink,
  Award
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { EvidenceMetricItem } from '../../types';
import { NAACComplianceMatrix } from '../features/NAACComplianceMatrix';
import { SustainabilityCertificateModal } from '../features/SustainabilityCertificateModal';

export const AuditCenter: React.FC = () => {
  const { 
    auditLogs, 
    evidenceItems, 
    methodology, 
    setMethodology, 
    scores,
    nodes,
    isHostelBAnomalyInjected,
    isOutcomeVerified
  } = useCampus();

  const [activeSubTab, setActiveSubTab] = useState<'report' | 'naac' | 'evidence' | 'logs' | 'methodology'>('report');
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleWeightChange = (key: 'energy' | 'water' | 'waste' | 'transport', val: number) => {
    setMethodology(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: val,
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="no-print bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              Institutional Compliance & NAAC/NIRF Ready
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Cryptographic Audit Chain
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            Official Sustainability Audit Center & Evidence Ledger
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            Full auditability for every number: provenance, immutable logging of changes, validation checks, and one-click printable official sustainability reports.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCertModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all hover:scale-105 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-emerald-200" />
            <span>Official Certificate (QR Sealed)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-950/50 transition-all hover:scale-105 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="no-print flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs gap-1 flex-wrap">
        <button
          onClick={() => setActiveSubTab('report')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeSubTab === 'report' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Full Sustainability Audit Report</span>
        </button>

        <button
          onClick={() => setActiveSubTab('naac')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeSubTab === 'naac' ? 'bg-slate-800 text-emerald-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>NAAC Criterion 7.1.2 & NIRF</span>
        </button>

        <button
          onClick={() => setActiveSubTab('evidence')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === 'evidence' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Evidence Appendix (Metric Lineage)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === 'logs' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Immutable Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('methodology')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === 'methodology' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Methodology & Weight Configurator</span>
        </button>
      </div>

      {/* SUB-VIEW 1: Official Full Sustainability Audit Report */}
      {activeSubTab === 'report' && (
        <div className="bg-slate-900/90 rounded-2xl p-8 border border-slate-800 shadow-2xl text-slate-200 space-y-8 font-sans">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-700 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                <span>GOVT. COLLEGE OF ENGINEERING KALAHANDI (GCEK)</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
                CAMPUS SUSTAINABILITY & AUDIT COMPLIANCE REPORT
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Audited by GreenCore AI Digital Twin Sentinel in compliance with NAAC Criterion VII & NIRF Green Metrics
              </p>
            </div>

            <div className="text-right text-xs space-y-1 font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div><strong className="text-slate-400">Cycle:</strong> April – September 2026</div>
              <div><strong className="text-slate-400">Report Hash:</strong> SHA-256: 9b2d8...f31a</div>
              <div><strong className="text-slate-400">Methodology:</strong> {methodology.version}</div>
              <div><strong className="text-slate-400">Overall Score:</strong> <span className="text-emerald-400 font-bold">{scores.compositeScore} / 100</span> (Confidence: {scores.dataConfidence}%)</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              1. Executive Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              During the 6-month evaluation cycle ending September 2026, Govt. College of Engineering Kalahandi (GCEK) achieved a composite GreenScore of <strong>{scores.compositeScore} / 100</strong> across its 9 monitored facilities, representing top-tier regional performance in sustainability tracking. The campus demonstrates robust waste circularity (84.2% diversion rate) and clean mobility share (74% active commute). Water infrastructure in Hostel B required physical maintenance following an autonomous night-flow telemetry alert, which has been logged, simulated, and audited in the closed-loop system.
            </p>
          </div>

          {/* Section 2: Campus Profile */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              2. Institutional Profile & Infrastructure Boundary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Campus Population</span>
                <span className="text-lg font-black text-white">5,200</span>
                <span className="text-[10px] text-slate-400 block">Students, Faculty & Staff</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Built-up Footprint</span>
                <span className="text-lg font-black text-white">145,000 m²</span>
                <span className="text-[10px] text-slate-400 block">Across 9 Core Blocks</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sub-meter Density</span>
                <span className="text-lg font-black text-white">27 Nodes</span>
                <span className="text-[10px] text-slate-400 block">Electricity, Water & Waste</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Solar Generation Capacity</span>
                <span className="text-lg font-black text-emerald-400">150 kWp</span>
                <span className="text-[10px] text-slate-400 block">Rooftop Net-Metered Array</span>
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Performance Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              3. Environmental Domain Performance Index
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Pillar Category</th>
                    <th className="py-2.5 px-3">Measured Quantity</th>
                    <th className="py-2.5 px-3">Normalized Indicator</th>
                    <th className="py-2.5 px-3">Weight</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Energy & Power</td>
                    <td className="py-3 px-3 font-mono">245,100 kWh</td>
                    <td className="py-3 px-3 font-mono">47.1 kWh / student</td>
                    <td className="py-3 px-3 font-mono">30%</td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-300">{scores.energyScore}</td>
                    <td className="py-3 px-3 font-mono text-cyan-400">98%</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-semibold">Verified Modbus</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Water Resources</td>
                    <td className="py-3 px-3 font-mono">{isHostelBAnomalyInjected && !isOutcomeVerified ? '7,464,000 L' : '6,880,000 L'}</td>
                    <td className="py-3 px-3 font-mono">{isHostelBAnomalyInjected && !isOutcomeVerified ? '47.8 L/capita/day' : '44.1 L/capita/day'}</td>
                    <td className="py-3 px-3 font-mono">25%</td>
                    <td className={`py-3 px-3 font-mono font-bold ${isHostelBAnomalyInjected && !isOutcomeVerified ? 'text-rose-400' : 'text-cyan-300'}`}>
                      {scores.waterScore}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400">84%</td>
                    <td className="py-3 px-3 text-right text-cyan-400 font-semibold">LoRaWAN Telemetry</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Waste & Circularity</td>
                    <td className="py-3 px-3 font-mono">4,910 kg</td>
                    <td className="py-3 px-3 font-mono">84.2% Diversion Rate</td>
                    <td className="py-3 px-3 font-mono">25%</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-300">{scores.wasteScore}</td>
                    <td className="py-3 px-3 font-mono text-cyan-400">89%</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-semibold">Weighbridge Manifest</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Clean Mobility</td>
                    <td className="py-3 px-3 font-mono">184.2 tCO₂e</td>
                    <td className="py-3 px-3 font-mono">74% Clean Commute</td>
                    <td className="py-3 px-3 font-mono">20%</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-300">{scores.transportScore}</td>
                    <td className="py-3 px-3 font-mono text-cyan-400">76%</td>
                    <td className="py-3 px-3 text-right text-indigo-400 font-semibold">Biometric Gate Survey</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Closed-Loop Intervention Case Study */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              4. Closed-Loop Action & Verification Evidence Chain
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>Case #CL-2026-0927: Hostel B Water Infrastructure Anomaly</span>
                <span className="text-emerald-400 font-mono">Resolution: Verified</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                <strong>Problem:</strong> Continuous 3,200 L/hr night-time baseline detected by flow sensor #WM-H2-205 on 24–27 Sept.<br />
                <strong>Change Fingerprint:</strong> Water consumption increased +32.4% while student occupancy remained flat (+2.1%), confirming mechanical failure rather than student population growth.<br />
                <strong>Intervention:</strong> Ground sump feeder valve resealed and 4.5 L/min aerators installed across washrooms.<br />
                <strong>Measured Outcome:</strong> Water consumption reduced by <strong>20.7%</strong> (188 → 149 L/student/day). Estimated annual saving: 1,418,000 Litres and ₹1,94,000 in campus pumping and municipal water charges.
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-3 gap-6 text-xs text-slate-400">
            <div>
              <div className="h-10 border-b border-slate-700 border-dashed" />
              <div className="mt-1 font-bold text-white">Er. Rajesh Panda</div>
              <div>Lead Facility Engineer, GCEK</div>
            </div>
            <div>
              <div className="h-10 border-b border-slate-700 border-dashed" />
              <div className="mt-1 font-bold text-white">Ananya Mohanty</div>
              <div>Eco Club President, GCEK</div>
            </div>
            <div>
              <div className="h-10 border-b border-slate-700 border-dashed" />
              <div className="mt-1 font-bold text-cyan-400 font-mono">GreenCore Sentinel v1.2</div>
              <div>Cryptographic Verification Authority</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Evidence Appendix */}
      {activeSubTab === 'evidence' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Data Provenance & Metric Lineage Evidence Register
              </h3>
              <p className="text-xs text-slate-400">
                Transparent origin, transformation path, and validation status for every audited indicator
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">4 Evidence Blocks</span>
          </div>

          <div className="space-y-4">
            {evidenceItems.map(item => (
              <div key={item.metricId} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                      {item.metricId}
                    </span>
                    <h4 className="font-bold text-white">{item.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">Confidence:</span>
                    <span className="text-cyan-400 font-bold">{item.confidence}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Data Source:</span>
                    <span className="text-slate-200">{item.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Collection Method:</span>
                    <span className="text-slate-200">{item.collectionMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Audit Validation:</span>
                    <span className="text-emerald-400 font-semibold">{item.validationStatus}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px]">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Normalization Transformation:</span>
                  <span className="font-mono text-slate-300">{item.transformation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Immutable Audit Trail Logs */}
      {activeSubTab === 'logs' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                Immutable Campus Sustainability Ledger (Audit Trail)
              </h3>
              <p className="text-xs text-slate-400">
                Cryptographically hashed record of every manual log, sensor sync, threshold alert, and calibration
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">SHA-256 Chained</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Timestamp (IST)</th>
                  <th className="py-2.5 px-3">Actor / Agent</th>
                  <th className="py-2.5 px-3">Node</th>
                  <th className="py-2.5 px-3">Event / Metric</th>
                  <th className="py-2.5 px-3">Previous</th>
                  <th className="py-2.5 px-3">New Value</th>
                  <th className="py-2.5 px-3">Reason / Context</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200 whitespace-nowrap">
                      {log.actor}
                    </td>
                    <td className="py-3 px-3 text-cyan-400 font-mono text-[11px] whitespace-nowrap">
                      {log.nodeName}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">
                      {log.metricType}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                      {log.previousValue}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white text-[11px]">
                      {log.newValue}
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px] max-w-xs truncate" title={log.reason}>
                      {log.reason}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.verificationStatus === 'Verified' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : log.verificationStatus === 'Flagged'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {log.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: Methodology & Configurator */}
      {activeSubTab === 'methodology' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Scoring Methodology Weight Configurator & Versioning
              </h3>
              <p className="text-xs text-slate-400">
                Current Version: <strong className="text-cyan-400">{methodology.version}</strong> (Effective: {methodology.effectiveDate})
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
              Weights Must Sum to 100%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
            {/* Energy Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-amber-400">Energy Weight</span>
                <span className="font-mono font-bold text-white">{(methodology.weights.energy * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={methodology.weights.energy}
                onChange={e => handleWeightChange('energy', parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
              <span className="text-[10px] text-slate-400 block">Baseline recommendation: 30%</span>
            </div>

            {/* Water Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-cyan-400">Water Weight</span>
                <span className="font-mono font-bold text-white">{(methodology.weights.water * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={methodology.weights.water}
                onChange={e => handleWeightChange('water', parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400 block">Baseline recommendation: 25%</span>
            </div>

            {/* Waste Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-emerald-400">Waste Weight</span>
                <span className="font-mono font-bold text-white">{(methodology.weights.waste * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={methodology.weights.waste}
                onChange={e => handleWeightChange('waste', parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
              <span className="text-[10px] text-slate-400 block">Baseline recommendation: 25%</span>
            </div>

            {/* Transport Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-indigo-400">Mobility Weight</span>
                <span className="font-mono font-bold text-white">{(methodology.weights.transport * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={methodology.weights.transport}
                onChange={e => handleWeightChange('transport', parseFloat(e.target.value))}
                className="w-full accent-indigo-400"
              />
              <span className="text-[10px] text-slate-400 block">Baseline recommendation: 20%</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: NAAC Criterion 7.1.2 & NIRF Institutional Green Audit Matrix */}
      {activeSubTab === 'naac' && (
        <NAACComplianceMatrix isEmbedded={true} />
      )}

      {/* Cryptographic Sustainability Certificate Modal */}
      <SustainabilityCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
};

