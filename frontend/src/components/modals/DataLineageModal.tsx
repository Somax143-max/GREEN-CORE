import React from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Clock, 
  FileText, 
  UserCheck, 
  Layers, 
  Lock,
  ExternalLink
} from 'lucide-react';

export interface MetricLineageData {
  metricName: string;
  observedValue: string;
  period: string;
  sourceMeterId: string;
  collectionProtocol: string;
  frequency: string;
  recordsCount: number;
  missingDataPct: number;
  validationStatus: string;
  lastVerified: string;
  confidencePct: number;
  formulaTrace?: string;
  responsibleAuditor?: string;
}

interface DataLineageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineage: MetricLineageData | null;
}

export const DataLineageModal: React.FC<DataLineageModalProps> = ({ isOpen, onClose, lineage }) => {
  if (!isOpen || !lineage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  METRIC PROVENANCE & DATA LINEAGE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Audit Grade
                </span>
              </div>
              <h2 className="text-base font-black text-white">
                {lineage.metricName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Big Value Highlight Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Audited Value</span>
              <div className="text-2xl font-black text-white">{lineage.observedValue}</div>
              <span className="text-xs text-slate-400">{lineage.period}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Data Confidence</span>
              <div className="text-2xl font-black text-cyan-400">{lineage.confidencePct}%</div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3 h-3" />
                {lineage.validationStatus}
              </span>
            </div>
          </div>

          {/* Lineage Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400" />
                Hardware Source / Meter ID
              </span>
              <div className="font-mono font-bold text-slate-200">{lineage.sourceMeterId}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-400" />
                Ingestion Protocol
              </span>
              <div className="font-semibold text-slate-200">{lineage.collectionProtocol}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                Sampling Frequency
              </span>
              <div className="font-semibold text-slate-200">{lineage.frequency}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <FileText className="w-3 h-3 text-indigo-400" />
                Total Sampled Records
              </span>
              <div className="font-mono font-semibold text-slate-200">
                {lineage.recordsCount.toLocaleString()} records ({lineage.missingDataPct}% missing)
              </div>
            </div>
          </div>

          {/* Mathematical Transformation Trace */}
          {lineage.formulaTrace && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                Normalization & Aggregation Trace:
              </span>
              <code className="font-mono text-[11px] text-slate-300 block bg-slate-900 p-2 rounded border border-slate-800/80">
                {lineage.formulaTrace}
              </code>
            </div>
          )}

          {/* Lead Auditor Signoff */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Auditor: <strong className="text-slate-200">{lineage.responsibleAuditor || 'Eco Club Lead Auditor'}</strong></span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">
              Verified: {new Date(lineage.lastVerified).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
