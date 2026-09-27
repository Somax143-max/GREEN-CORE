import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  delta?: number;
  confidence?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showConfidence?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  delta,
  confidence = 91,
  size = 180,
  strokeWidth = 14,
  label = 'GREEN SCORE',
  showConfidence = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Determine color theme based on score
  let strokeColor = '#10b981'; // emerald-500
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let ratingText = 'EXCELLENT';
  if (score < 70) {
    strokeColor = '#f43f5e'; // rose-500
    glowColor = 'rgba(244, 63, 94, 0.4)';
    ratingText = 'CRITICAL DEFICIT';
  } else if (score < 80) {
    strokeColor = '#f59e0b'; // amber-500
    glowColor = 'rgba(245, 158, 11, 0.4)';
    ratingText = 'MODERATE / ACTION REQ';
  } else if (score >= 85) {
    strokeColor = '#06b6d4'; // cyan-400
    glowColor = 'rgba(6, 182, 212, 0.4)';
    ratingText = 'EXEMPLARY LEADERSHIP';
  }

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background track */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
          <span className="text-4xl font-extrabold text-white tracking-tight" style={{ color: strokeColor }}>
            {score}
          </span>
          <span className="text-[10px] font-medium text-slate-400">/ 100</span>
          {delta !== undefined && (
            <span className={`text-xs font-bold mt-0.5 px-1.5 py-0.5 rounded-full ${
              delta >= 0 ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
            }`}>
              {delta >= 0 ? `+${delta}%` : `${delta}%`}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase px-2 py-0.5 bg-slate-800/80 rounded border border-slate-700/50">
          {ratingText}
        </span>
      </div>

      {showConfidence && (
        <div className="w-full mt-3 p-2 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Data Confidence:
            </span>
            <span className="font-bold text-cyan-400">{confidence}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Score ≠ Data Certainty</span>
            <span className="text-slate-400">Telemetry + Survey</span>
          </div>
        </div>
      )}
    </div>
  );
};
