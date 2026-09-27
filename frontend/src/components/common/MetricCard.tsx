import React from 'react';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Database } from 'lucide-react';

interface MetricCardProps {
  title: string;
  category: 'energy' | 'water' | 'waste' | 'transport';
  value: string;
  unit: string;
  subValue?: string;
  score: number;
  scoreDelta?: number;
  confidence: number;
  provenance: string;
  icon: React.ReactNode;
  warning?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  category,
  value,
  unit,
  subValue,
  score,
  scoreDelta,
  confidence,
  provenance,
  icon,
  warning = false,
  onClick,
}) => {
  const getThemeStyles = () => {
    switch (category) {
      case 'energy':
        return {
          border: warning ? 'border-amber-500/80 shadow-amber-950/40' : 'border-amber-500/30 hover:border-amber-500/60',
          accent: 'text-amber-400',
          badge: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
          iconBg: 'bg-amber-500/10 text-amber-400',
        };
      case 'water':
        return {
          border: warning ? 'border-rose-500/80 shadow-rose-950/40' : 'border-cyan-500/30 hover:border-cyan-500/60',
          accent: warning ? 'text-rose-400' : 'text-cyan-400',
          badge: warning ? 'bg-rose-950/80 text-rose-300 border-rose-800/60' : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
          iconBg: warning ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/10 text-cyan-400',
        };
      case 'waste':
        return {
          border: warning ? 'border-rose-500/80' : 'border-emerald-500/30 hover:border-emerald-500/60',
          accent: 'text-emerald-400',
          badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
          iconBg: 'bg-emerald-500/10 text-emerald-400',
        };
      case 'transport':
      default:
        return {
          border: warning ? 'border-rose-500/80' : 'border-indigo-500/30 hover:border-indigo-500/60',
          accent: 'text-indigo-400',
          badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
          iconBg: 'bg-indigo-500/10 text-indigo-400',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      onClick={onClick}
      className={`relative bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${theme.border}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${theme.iconBg}`}>
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-white">Score: {score}</span>
              {scoreDelta !== undefined && (
                <span className={`text-[10px] font-bold flex items-center ${scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {scoreDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(scoreDelta)} pts
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={`text-[11px] font-bold px-2 py-0.5 rounded border ${theme.badge}`}>
          {score >= 80 ? 'Good' : score >= 70 ? 'Moderate' : 'Critical'}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-2 mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
          <span className="text-xs font-medium text-slate-400">{unit}</span>
        </div>
        {subValue && (
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{subValue}</p>
        )}
      </div>

      {/* Provenance & Confidence footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1 truncate max-w-[65%]" title={provenance}>
          <Database className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{provenance}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 font-medium">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-400 font-semibold">{confidence}%</span>
        </div>
      </div>
    </div>
  );
};
