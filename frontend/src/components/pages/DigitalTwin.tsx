import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Zap, 
  Droplets, 
  Trash2, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Search,
  Filter,
  Users,
  Maximize2,
  TrendingDown,
  ArrowUpRight,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { CampusNode, NodeType } from '../../types';

interface DigitalTwinProps {
  onSelectNode: (nodeId: string) => void;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ onSelectNode }) => {
  const { nodes, anomalies } = useCampus();
  const [filterType, setFilterType] = useState<NodeType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('hostel_h2');

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedId) || nodes[0];
  }, [nodes, selectedId]);

  const academicCount = useMemo(() => nodes.filter(n => n.type === 'academic').length, [nodes]);
  const hostelCount = useMemo(() => nodes.filter(n => n.type === 'hostel').length, [nodes]);
  const facilityCount = useMemo(() => nodes.filter(n => n.type === 'facility').length, [nodes]);

  // Compute filtered nodes based on active category & search query
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesType = filterType === 'all' || node.type === filterType;
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            node.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            node.buildingType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [nodes, filterType, searchQuery]);

  const handleFilterClick = (type: NodeType | 'all') => {
    setFilterType(type);
    const matching = nodes.filter(n => type === 'all' || n.type === type);
    if (matching.length > 0) {
      if (!matching.some(m => m.id === selectedId)) {
        setSelectedId(matching[0].id);
        onSelectNode(matching[0].id);
      }
    }
  };

  const handleSpotlightDeteriorator = () => {
    setFilterType('hostel');
    const hostelB = nodes.find(n => n.id === 'hostel_h2');
    if (hostelB) {
      setSelectedId(hostelB.id);
      onSelectNode(hostelB.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Interactive Filter Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                Digital Twin Topology • GCEK
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Live Telemetry Mesh
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Campus Physical-Digital Synchronizer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any campus structure or use the category filters below to inspect real-time sub-metering, per-capita intensity, and spatial environmental states.
            </p>
          </div>

          <button
            onClick={handleSpotlightDeteriorator}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-600/50 text-xs font-bold hover:bg-rose-600/30 transition-all shrink-0"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>Spotlight Largest Hotspot (Hostel B)</span>
          </button>
        </div>

        {/* Filter Buttons & Live Search Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* 4 Interactive Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => handleFilterClick('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50 ring-2 ring-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterType === 'all' ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
              <span>All ({nodes.length})</span>
            </button>

            <button
              onClick={() => handleFilterClick('academic')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'academic'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/50 ring-2 ring-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterType === 'academic' ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
              <span>Academic ({academicCount})</span>
            </button>

            <button
              onClick={() => handleFilterClick('hostel')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'hostel'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-900/50 ring-2 ring-amber-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterType === 'hostel' ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
              <span>Hostels ({hostelCount})</span>
            </button>

            <button
              onClick={() => handleFilterClick('facility')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'facility'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/50 ring-2 ring-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterType === 'facility' ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
              <span>Facilities ({facilityCount})</span>
            </button>
          </div>

          {/* Search box & Count Indicator */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-cyan-400 whitespace-nowrap hidden lg:inline">
              Showing {filteredNodes.length} of {nodes.length} nodes
            </span>
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search block or code..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Twin Container: Visual Map + Detailed Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Campus Map View (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[580px]">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="font-semibold flex items-center gap-1.5 text-slate-200">
                <Layers className="w-4 h-4 text-cyan-400" />
                Spatial Topology: GCE Kalahandi (Filtered: <strong className="text-cyan-400">{filterType.toUpperCase()}</strong>)
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Optimal
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Anomaly Alert
                </span>
              </div>
            </div>

            {/* Campus SVG/CSS Isometric Canvas */}
            <div className="relative w-full h-[440px] bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 overflow-hidden shadow-inner">
              {/* Grid pattern background */}
              <div 
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Campus Roads and Pathways */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800 stroke-[2] opacity-60">
                <line x1="15%" y1="50%" x2="85%" y2="50%" strokeDasharray="6 4" />
                <line x1="50%" y1="15%" x2="50%" y2="85%" strokeDasharray="6 4" />
                <circle cx="50%" cy="50%" r="50" fill="none" strokeDasharray="4 4" />
              </svg>

              {/* Campus Zones Annotations */}
              <div className="absolute top-3 left-4 text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest">
                [Zone 1: Academic Quad]
              </div>
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest">
                [Zone 2: Residential Halls]
              </div>
              <div className="absolute top-3 right-4 text-[10px] font-mono text-indigo-400/80 uppercase tracking-widest">
                [Zone 3: Central Amenities]
              </div>

              {/* Interactive Node Markers */}
              {nodes.map(node => {
                const matchesFilter = filterType === 'all' || node.type === filterType;
                const matchesSearch = searchQuery === '' || 
                  node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  node.code.toLowerCase().includes(searchQuery.toLowerCase());
                const isVisible = matchesFilter && matchesSearch;

                const isSelected = selectedNode.id === node.id;
                const isCritical = node.status === 'critical';
                const isWarning = node.status === 'warning';

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setSelectedId(node.id);
                      onSelectNode(node.id);
                    }}
                    style={{
                      left: `${node.coordinates.x}%`,
                      top: `${node.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute z-20 cursor-pointer group transition-all duration-300 ${
                      !isVisible 
                        ? 'opacity-20 grayscale pointer-events-none scale-75' 
                        : isSelected 
                        ? 'scale-110 z-30 opacity-100' 
                        : 'opacity-90 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    {/* Pulsing ring for critical nodes */}
                    {isCritical && isVisible && (
                      <span className="absolute -inset-2.5 rounded-xl bg-rose-500/40 animate-ping" />
                    )}

                    {/* Node Card Badge */}
                    <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-2 shadow-lg transition-all ${
                      isCritical
                        ? 'bg-rose-950 text-white border-rose-500 shadow-rose-950/80 ring-2 ring-rose-500/50'
                        : isSelected
                        ? 'bg-cyan-950 text-white border-cyan-400 shadow-cyan-950/80 ring-2 ring-cyan-400/50'
                        : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:border-slate-500'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isCritical ? 'bg-rose-500 animate-pulse' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <div className="text-left">
                        <div className="text-[11px] font-black tracking-tight leading-none">{node.code}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">Score: {node.greenScore}</div>
                      </div>
                    </div>

                    {/* Tooltip on hover */}
                    {isVisible && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-[10px] text-slate-300 pointer-events-none shadow-2xl z-40">
                        <div className="font-bold text-white text-xs">{node.name}</div>
                        <div className="text-[9px] text-slate-400 uppercase font-mono mt-0.5">{node.type}</div>
                        <div className="mt-1.5 flex justify-between border-t border-slate-800 pt-1">
                          <span>Energy:</span>
                          <span className="font-semibold text-amber-300">{node.metrics.energyPerStudent.toFixed(1)} kWh/p</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Water:</span>
                          <span className={`font-semibold ${isCritical ? 'text-rose-400 font-bold' : 'text-cyan-300'}`}>
                            {node.metrics.waterPerStudentPerDay.toFixed(1)} L/d
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Filtered Buildings Interactive Carousel / Cards Strip */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  Matching Facilities ({filteredNodes.length}):
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Click a card to inspect
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {filteredNodes.map(node => {
                  const isSelected = selectedNode.id === node.id;
                  const isCritical = node.status === 'critical';
                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedId(node.id);
                        onSelectNode(node.id);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400' 
                          : isCritical 
                          ? 'bg-rose-950/40 border-rose-600' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{node.code}</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                          node.greenScore >= 80 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {node.greenScore}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{node.name}</p>
                      <div className="mt-1 text-[10px] flex justify-between text-slate-300">
                        <span>{node.population} users</span>
                        <span className={isCritical ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                          {node.metrics.waterPerStudentPerDay.toFixed(0)} L/d
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Node Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 uppercase font-bold">
                  {selectedNode.type} NODE
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  CODE: {selectedNode.code}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                {selectedNode.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedNode.buildingType}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">GreenScore</span>
              <span className={`text-2xl font-black ${
                selectedNode.greenScore >= 80 
                  ? 'text-emerald-400' 
                  : selectedNode.greenScore >= 70 
                  ? 'text-amber-400' 
                  : 'text-rose-400 animate-pulse'
              }`}>
                {selectedNode.greenScore}
              </span>
              <span className="text-[10px] text-slate-500 block">/ 100</span>
            </div>
          </div>

          {/* Anomaly Callout if this node is critical */}
          {selectedNode.status === 'critical' && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-600/70 text-xs">
              <div className="flex items-center gap-2 text-rose-300 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>ACTIVE HOTSPOT ANOMALY: WATER SURGE (+32.4%)</span>
              </div>
              <p className="text-rose-200/90 leading-snug">
                Normal: 142.0 L/student/day. Current: <strong>188.0 L/student/day</strong>. This physical node is currently responsible for the -4.0 point decline in campus-wide GreenScore.
              </p>
            </div>
          )}

          {/* Physical Specifications */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[11px]">Occupancy / Population:</span>
              <span className="font-bold text-white text-sm">{selectedNode.population.toLocaleString()} people</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Built-up Footprint:</span>
              <span className="font-bold text-white text-sm">{selectedNode.areaSqM.toLocaleString()} m²</span>
            </div>
          </div>

          {/* Granular Resource Metrics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Normalized Sustainability State
            </h4>

            {/* Energy */}
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white">Electricity Load</span>
                  <div className="text-[11px] text-slate-400">
                    Meter ID: {selectedNode.meterIds.energy || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white">
                  {selectedNode.metrics.energyKWh.toLocaleString()} kWh
                </span>
                <div className="text-[10px] text-amber-400 font-semibold">
                  {selectedNode.metrics.energyPerStudent.toFixed(1)} kWh/student • {selectedNode.metrics.energyPerSqM.toFixed(2)} kWh/m²
                </div>
              </div>
            </div>

            {/* Water */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              selectedNode.status === 'critical' 
                ? 'bg-rose-950/40 border-rose-700/60' 
                : 'bg-slate-950/40 border-slate-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${
                  selectedNode.status === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white">Water Consumption</span>
                  <div className="text-[11px] text-slate-400">
                    Flow Meter: {selectedNode.meterIds.water || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white">
                  {selectedNode.metrics.waterLitres.toLocaleString()} L
                </span>
                <div className={`text-[10px] font-bold ${
                  selectedNode.status === 'critical' ? 'text-rose-400' : 'text-cyan-400'
                }`}>
                  {selectedNode.metrics.waterPerStudentPerDay.toFixed(1)} L/student/day
                </div>
              </div>
            </div>

            {/* Waste */}
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white">Waste & Circularity</span>
                  <div className="text-[11px] text-slate-400">
                    Scale Register: {selectedNode.meterIds.waste || 'Manual Log'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white">
                  {selectedNode.metrics.wasteKg.toLocaleString()} kg/mo
                </span>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  {selectedNode.metrics.wasteDiversionRate}% Diversion Rate
                </div>
              </div>
            </div>
          </div>

          {/* AI Decision Answering the 5 Questions */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs space-y-1.5">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
              <Activity className="w-3.5 h-3.5" />
              GreenCore Twin Diagnostic Verdict
            </span>
            <p className="text-slate-300 leading-snug">
              {selectedNode.status === 'critical' 
                ? "Physical node responsible for 78% of the campus water score drag. Recommended immediate physical inspection of float valves and night flow isolation."
                : "Operational parameters are within expected seasonal variance. Contributing positively to campus Green League standing."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
