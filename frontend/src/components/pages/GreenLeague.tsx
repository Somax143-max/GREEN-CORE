import React from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Droplets,
  Trash2
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { INITIAL_LEADERBOARD } from '../../data/mockCampusData';

export const GreenLeague: React.FC = () => {
  const { missions, joinMission } = useCampus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
              Fair Gamification Engine
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Anti-Gaming Protected
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            The Green League & Normalized Improvement Standings
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            Ranked by <strong className="text-amber-400">normalized improvement over baseline</strong>, ensuring larger academic blocks and populated residential halls are not unfairly penalized by raw consumption volumes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">Data Integrity Sentinel Active</span>
        </div>
      </div>

      {/* Active Green Missions Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            Active Campus Sustainability Sprints & Missions
          </h3>
          <span className="text-xs text-slate-400">Join to earn Department Eco-Credits</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missions.map(m => (
            <div key={m.id} className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                    {m.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    +{m.pointsReward} Pts
                  </span>
                </div>

                <h4 className="text-sm font-black text-white mt-2.5">{m.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">{m.description}</p>

                <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-medium">Target Progress:</span>
                    <span className="font-bold text-emerald-400">{m.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    Goal: {m.targetGoal}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{m.participantsCount.toLocaleString()} Joined</span>
                </div>

                <button
                  onClick={() => joinMission(m.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all active:scale-95 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-emerald-200" />
                  <span>Join Sprint</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Inter-Departmental Green League Leaderboard
            </h3>
            <p className="text-xs text-slate-400">
              Ranked strictly by % normalized improvement relative to individual historical baselines
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
            Cycle: September 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Facility / Department</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Normalized Lift</th>
                <th className="py-2.5 px-3">GreenScore</th>
                <th className="py-2.5 px-3">Energy</th>
                <th className="py-2.5 px-3">Water</th>
                <th className="py-2.5 px-3">Waste</th>
                <th className="py-2.5 px-3">Mobility</th>
                <th className="py-2.5 px-3 text-right">League Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {INITIAL_LEADERBOARD.map(entry => (
                <tr key={entry.nodeId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-sm">
                    {entry.rank === 1 ? '🥇 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : `#${entry.rank}`}
                  </td>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px]">{entry.code}</span>
                    <span>{entry.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 capitalize">{entry.type}</td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={`flex items-center gap-1 ${
                      entry.normalizedImprovement > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {entry.normalizedImprovement > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {entry.normalizedImprovement > 0 ? `+${entry.normalizedImprovement}%` : `${entry.normalizedImprovement}%`}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-white text-sm">
                    {entry.rawScore}
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-300">{entry.energyScore}</td>
                  <td className="py-3 px-3 font-mono text-cyan-300">{entry.waterScore}</td>
                  <td className="py-3 px-3 font-mono text-emerald-300">{entry.wasteScore}</td>
                  <td className="py-3 px-3 font-mono text-indigo-300">{entry.transportScore}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                      {entry.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
