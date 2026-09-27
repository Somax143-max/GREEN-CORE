import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  Zap, 
  Droplets, 
  Trash2, 
  Bike, 
  Sparkles, 
  SlidersHorizontal, 
  Trophy, 
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export type TabId = 
  | 'command' 
  | 'twin' 
  | 'energy' 
  | 'water' 
  | 'waste' 
  | 'mobility' 
  | 'ai' 
  | 'simulator' 
  | 'league' 
  | 'audit';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { anomalies } = useCampus();

  const navItems: { id: TabId; label: string; icon: React.ReactNode; badge?: string; warningBadge?: boolean }[] = [
    { id: 'command', label: '01 Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'twin', label: '02 Digital Twin', icon: <Boxes className="w-4 h-4" /> },
    { id: 'energy', label: '03 Energy Intel', icon: <Zap className="w-4 h-4" /> },
    { 
      id: 'water', 
      label: '04 Water Intel', 
      icon: <Droplets className="w-4 h-4" />, 
      badge: anomalies.length > 0 ? `${anomalies.length} ALARM` : undefined,
      warningBadge: anomalies.length > 0
    },
    { id: 'waste', label: '05 Waste & Circularity', icon: <Trash2 className="w-4 h-4" /> },
    { id: 'mobility', label: '06 Mobility & Carbon', icon: <Bike className="w-4 h-4" /> },
    { id: 'ai', label: '07 AI Insights', icon: <Sparkles className="w-4 h-4" />, badge: '5Q AI' },
    { id: 'simulator', label: '08 Action Simulator', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'league', label: '09 Green League', icon: <Trophy className="w-4 h-4" /> },
    { id: 'audit', label: '10 Audit & Evidence', icon: <FileCheck2 className="w-4 h-4" />, badge: 'Audit-Ready' },
  ];

  return (
    <nav className="bg-slate-900/60 border-b border-slate-800/80 px-4 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                  item.warningBadge 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {item.badge}
                </span>
              )}

              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
