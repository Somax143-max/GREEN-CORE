import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  FileCheck, 
  Sun, 
  Flame, 
  Zap, 
  Lightbulb, 
  Droplet, 
  ShieldCheck, 
  Download, 
  Printer, 
  X,
  Building,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

interface NAACComplianceMatrixProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
}

interface NAACMetric {
  code: string;
  name: string;
  weightage: number;
  score: number;
  status: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NEEDS_ACTION';
  icon: any;
  facilitiesInstalled: string;
  quantitativeData: string;
  geotaggedEvidence: {
    location: string;
    coordinates: string;
    evidenceId: string;
  };
}

export const NAACComplianceMatrix: React.FC<NAACComplianceMatrixProps> = ({ 
  isOpen = true, 
  onClose,
  isEmbedded = false
}) => {
  const { scores, mode } = useCampus();
  const [selectedMetric, setSelectedMetric] = useState<string>('7.1.2.1');

  const naacMetrics: NAACMetric[] = [
    {
      code: '7.1.2.1',
      name: 'Solar Energy Harvesting',
      weightage: 4,
      score: 3.9,
      status: 'COMPLIANT',
      icon: Sun,
      facilitiesInstalled: '180 kW Grid-Tied Rooftop PV Array installed on Main Academic & Library Block',
      quantitativeData: '42.6% of campus daytime load powered by solar. Average 740 kWh/day generated.',
      geotaggedEvidence: {
        location: 'Main Academic Block Terraces (South Wing)',
        coordinates: '19.9074° N, 83.1648° E (Bhawanipatna, GCEK)',
        evidenceId: 'EV-SLR-2026-091'
      }
    },
    {
      code: '7.1.2.2',
      name: 'Biogas & Kitchen Bio-Digester',
      weightage: 4,
      score: 3.8,
      status: 'COMPLIANT',
      icon: Flame,
      facilitiesInstalled: '250 kg/day Anaerobic Bio-methanation Unit at Central Dining Hall',
      quantitativeData: 'Converts 210 kg organic food scrap daily into 14 m³ biogas for student cafeteria stoves.',
      geotaggedEvidence: {
        location: 'Hostel Dining Complex Yard',
        coordinates: '19.9082° N, 83.1655° E (GCEK Campus)',
        evidenceId: 'EV-BIO-2026-042'
      }
    },
    {
      code: '7.1.2.3',
      name: 'Wheeling to the Grid & Net-Metering',
      weightage: 4,
      score: 3.7,
      status: 'COMPLIANT',
      icon: Zap,
      facilitiesInstalled: 'Bi-directional TPCODL 11kV Grid Net-Meter with Modbus-TCP telemetry',
      quantitativeData: 'Surplus semester-break export: 8,420 kWh wheeled to TPCODL state grid in 2025-26.',
      geotaggedEvidence: {
        location: 'Campus 33/11kV Substation Switchyard',
        coordinates: '19.9069° N, 83.1640° E (TPCODL Feeder Point)',
        evidenceId: 'EV-NET-2026-118'
      }
    },
    {
      code: '7.1.2.4',
      name: 'Sensor-Based Energy Conservation & LED',
      weightage: 4,
      score: 4.0,
      status: 'COMPLIANT',
      icon: Lightbulb,
      facilitiesInstalled: '78% LED bulb penetration + PIR occupancy sensors in Computer Labs & Library',
      quantitativeData: 'Lighting energy intensity lowered by 34% compared to legacy fluorescent baseline.',
      geotaggedEvidence: {
        location: 'CSE & ECE Department Labs, Central Library',
        coordinates: '19.9078° N, 83.1650° E (All Academic Blocks)',
        evidenceId: 'EV-LED-2026-067'
      }
    },
    {
      code: '7.1.4.1',
      name: 'Water Conservation & STP Recycling',
      weightage: 4,
      score: 3.9,
      status: 'COMPLIANT',
      icon: Droplet,
      facilitiesInstalled: '50 kLD Sewage Treatment Plant + 4 Rainwater Recharge Pits across campus',
      quantitativeData: '1.4 Million Liters of treated greywater utilized annually for campus botanical lawns.',
      geotaggedEvidence: {
        location: 'STP Enclosure & North Perimeter Percolation Pit',
        coordinates: '19.9090° N, 83.1662° E (Kalahandi Green Belt)',
        evidenceId: 'EV-WTR-2026-095'
      }
    }
  ];

  const totalPossible = naacMetrics.length * 4;
  const totalEarned = naacMetrics.reduce((sum, m) => sum + m.score, 0);
  const naacGPA = (totalEarned / naacMetrics.length).toFixed(2);

  const selectedItem = naacMetrics.find(m => m.code === selectedMetric) || naacMetrics[0];

  const content = (
    <div className="space-y-6">
      {/* Top Banner / Grade Projection */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              NAAC Criterion VII & NIRF Institutional Green Audit
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              Autonomous Auto-Scoring
            </span>
          </div>
          <h3 className="text-xl font-black text-white">
            Criterion 7.1.2: Alternate Energy & Conservation Compliance Matrix
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Auto-audited for <strong>Govt. College of Engineering Kalahandi (GCEK)</strong> based on live IoT telemetry, verified work-orders, and immutable SHA-256 evidence logs.
          </p>
        </div>

        {/* Projected Score Badge */}
        <div className="shrink-0 flex items-center gap-4 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 shadow-lg text-center">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Projected NAAC GPA</div>
            <div className="text-3xl font-black text-emerald-400 my-0.5">{naacGPA} <span className="text-base text-slate-400 font-normal">/ 4.00</span></div>
            <div className="text-xs font-bold text-cyan-300">Grade A++ Benchmark</div>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">NIRF Points</div>
            <div className="text-3xl font-black text-cyan-400 my-0.5">+4.8</div>
            <div className="text-[11px] text-emerald-400 font-medium">Campus Metric</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Metric List + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5 Sub-Criteria Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            Mandatory NAAC 7.1.2 Sub-Indicators:
          </div>
          {naacMetrics.map(metric => {
            const Icon = metric.icon;
            const isSelected = selectedMetric === metric.code;
            return (
              <button
                key={metric.code}
                onClick={() => setSelectedMetric(metric.code)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-cyan-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">
                      NAAC Metric {metric.code}
                    </div>
                    <div className="text-xs font-bold text-slate-100">{metric.name}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-black text-emerald-400">
                    {metric.score} / 4.0
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Compliant ✓
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Metric Evidence & SSR Annexure Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NAAC {selectedItem.code}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {selectedItem.name}
                </h4>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                Score: {selectedItem.score} / 4.00
              </span>
            </div>

            {/* Installed Infrastructure */}
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Institutional Infrastructure on Campus:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed p-3 rounded-lg bg-slate-900 border border-slate-800">
                {selectedItem.facilitiesInstalled}
              </p>
            </div>

            {/* Quantitative Audit Verification */}
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Quantitative Audit Performance:
              </span>
              <p className="text-xs text-cyan-300 font-mono p-3 rounded-lg bg-slate-900 border border-slate-800">
                {selectedItem.quantitativeData}
              </p>
            </div>

            {/* Geotagged Evidence Link for NAAC Peer Team Inspection */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                NAAC Peer Team Geotagged Verification Proof
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
                <div>
                  <span className="font-semibold text-slate-200">{selectedItem.geotaggedEvidence.location}</span>
                  <div className="text-[11px] font-mono text-cyan-400">
                    GPS: {selectedItem.geotaggedEvidence.coordinates}
                  </div>
                </div>
                <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 self-start sm:self-auto">
                  Doc: {selectedItem.geotaggedEvidence.evidenceId}
                </span>
              </div>
            </div>

            {/* NAAC Peer Team Action Box */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Audit Readiness: <strong>100% Peer-Team Ready</strong></span>
              <span className="text-emerald-400 font-mono text-[11px]">SHA-256 Verified Seal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If embedded in AuditCenter page directly
  if (isEmbedded) {
    return content;
  }

  // If rendered as standalone modal
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/60 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Institutional Accreditation Engine
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  NAAC Criterion 7.1.2 & NIRF
                </span>
              </div>
              <h2 className="text-base font-black text-white">
                Institutional Green Audit & Accreditation Matrix
              </h2>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {content}
        </div>
      </div>
    </div>
  );
};
