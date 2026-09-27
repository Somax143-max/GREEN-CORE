import React from 'react';
import { 
  X, 
  Building2, 
  Zap, 
  Droplets, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Maximize2 
} from 'lucide-react';
import { CampusNode } from '../../types';

interface NodeDetailModalProps {
  node: CampusNode | null;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  const isCritical = node.status === 'critical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`p-5 border-b ${
          isCritical ? 'bg-rose-950/60 border-rose-800' : 'bg-slate-950/80 border-slate-800'
        } flex items-start justify-between`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 uppercase">
                {node.type}
              </span>
              <span className="text-xs text-slate-400 font-mono">CODE: {node.code}</span>
            </div>
            <h3 className="text-base font-black text-white mt-1">{node.name}</h3>
            <p className="text-xs text-slate-400">{node.buildingType}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Score</span>
              <span className={`text-xl font-black ${
                node.greenScore >= 80 ? 'text-emerald-400' : node.greenScore >= 70 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {node.greenScore}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Anomaly banner if critical */}
          {isCritical && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>ACTIVE ANOMALY: WATER USAGE SPIKE (+32.4%)</span>
              </div>
              <p className="text-[11px] leading-snug">
                Meter #WM-H2-205 recorded steady night flow. Maintenance inspection dispatched.
              </p>
            </div>
          )}

          {/* Core Specs */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Occupancy</span>
              <span className="text-sm font-bold text-white font-mono">{node.population.toLocaleString()} Residents/Users</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Built-up Footprint</span>
              <span className="text-sm font-bold text-white font-mono">{node.areaSqM.toLocaleString()} m²</span>
            </div>
          </div>

          {/* Sub-meters */}
          <div>
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-400 mb-2">
              Assigned Telemetry Sub-meters
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Energy Sub-meter:</span>
                <span className="text-amber-400 font-semibold">{node.meterIds.energy || 'Virtual feeder'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Water Flow Meter:</span>
                <span className="text-cyan-400 font-semibold">{node.meterIds.water || 'Virtual flow'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Waste Bin Register:</span>
                <span className="text-emerald-400 font-semibold">{node.meterIds.waste || 'Manual Log'}</span>
              </div>
            </div>
          </div>

          {/* Normalized Breakdown */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-400 mb-1">
              Monthly Consumption Intensity
            </h4>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Energy Intensity:</span>
              <span className="font-mono text-white font-bold">{node.metrics.energyPerStudent.toFixed(1)} kWh/student ({node.metrics.energyPerSqM.toFixed(2)} kWh/m²)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Water Consumption:</span>
              <span className={`font-mono font-bold ${isCritical ? 'text-rose-400' : 'text-cyan-300'}`}>
                {node.metrics.waterPerStudentPerDay.toFixed(1)} L/student/day
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Waste Diversion Rate:</span>
              <span className="font-mono text-emerald-400 font-bold">{node.metrics.wasteDiversionRate}% circular</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
