import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Radio, 
  Play, 
  Pause, 
  Wifi, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  X,
  RefreshCw,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

interface PacketLog {
  id: string;
  timestamp: string;
  protocol: 'MODBUS-TCP' | 'LORAWAN' | 'SMART-BIN' | 'MANUAL-SYNC';
  nodeCode: string;
  meterId: string;
  payload: string;
  status: 'VALID' | 'WARNING' | 'ANOMALY';
  latencyMs: number;
}

interface LiveTelemetryTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTelemetryTerminal: React.FC<LiveTelemetryTerminalProps> = ({ isOpen, onClose }) => {
  const { isHostelBAnomalyInjected, isOutcomeVerified } = useCampus();
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [packets, setPackets] = useState<PacketLog[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string>('ALL');

  useEffect(() => {
    // Initial seed packets
    const initial: PacketLog[] = [
      {
        id: 'PKT-1001',
        timestamp: new Date().toLocaleTimeString(),
        protocol: 'MODBUS-TCP',
        nodeCode: 'CSE',
        meterId: 'EM-CSE-101',
        payload: 'V_LN: 239.4V | I_RMS: 44.2A | P_ACT: 31.8kW | PF: 0.96 | CRC: 0x8F2B',
        status: 'VALID',
        latencyMs: 14,
      },
      {
        id: 'PKT-1002',
        timestamp: new Date().toLocaleTimeString(),
        protocol: 'LORAWAN',
        nodeCode: 'H2',
        meterId: 'WM-H2-205',
        payload: isHostelBAnomalyInjected && !isOutcomeVerified
          ? 'PULSE: 3200 L/hr | NIGHT_THRESHOLD: EXCEEDED (+32.4%) | RSSI: -78dBm'
          : 'PULSE: 160 L/hr | BASELINE: NOMINAL | RSSI: -81dBm',
        status: isHostelBAnomalyInjected && !isOutcomeVerified ? 'ANOMALY' : 'VALID',
        latencyMs: 82,
      },
      {
        id: 'PKT-1003',
        timestamp: new Date().toLocaleTimeString(),
        protocol: 'SMART-BIN',
        nodeCode: 'SAC',
        meterId: 'WB-SAC-309',
        payload: 'OPTICAL_FILL: 78.4% | MASS: 1450kg | COMPOST_CLASSIFIER: 94% WET',
        status: 'VALID',
        latencyMs: 45,
      }
    ];
    setPackets(initial);
  }, [isHostelBAnomalyInjected, isOutcomeVerified]);

  useEffect(() => {
    if (!isStreaming || !isOpen) return;

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const nodeChoices = [
        { code: 'CSE', meter: 'EM-CSE-101', proto: 'MODBUS-TCP' as const, payload: `V_LN: ${(238 + Math.random() * 4).toFixed(1)}V | P_ACT: ${(31 + Math.random()).toFixed(1)}kW | PF: 0.96` },
        { code: 'ECE', meter: 'EM-ECE-102', proto: 'MODBUS-TCP' as const, payload: `V_LN: ${(239 + Math.random() * 3).toFixed(1)}V | P_ACT: ${(24 + Math.random()).toFixed(1)}kW | PF: 0.95` },
        { code: 'H2', meter: 'WM-H2-205', proto: 'LORAWAN' as const, payload: isHostelBAnomalyInjected && !isOutcomeVerified ? `PULSE: ${(3180 + Math.random() * 50).toFixed(0)} L/hr [LEAK THRESHOLD BREACH]` : `PULSE: ${(150 + Math.random() * 20).toFixed(0)} L/hr [NOMINAL]` },
        { code: 'H1', meter: 'WM-H1-204', proto: 'LORAWAN' as const, payload: `PULSE: ${(140 + Math.random() * 20).toFixed(0)} L/hr [NOMINAL] | RSSI: -84dBm` },
        { code: 'SAC', meter: 'WB-SAC-309', proto: 'SMART-BIN' as const, payload: `OPTICAL_DEPTH: ${(75 + Math.random() * 5).toFixed(1)}% | WEIGHT: 1450kg` }
      ];

      const choice = nodeChoices[Math.floor(Math.random() * nodeChoices.length)];
      const isAnomaly = choice.code === 'H2' && isHostelBAnomalyInjected && !isOutcomeVerified;

      const newPkt: PacketLog = {
        id: `PKT-${Date.now().toString().slice(-4)}`,
        timestamp: now,
        protocol: choice.proto,
        nodeCode: choice.code,
        meterId: choice.meter,
        payload: choice.payload,
        status: isAnomaly ? 'ANOMALY' : 'VALID',
        latencyMs: Math.floor(12 + Math.random() * 70),
      };

      setPackets(prev => [newPkt, ...prev.slice(0, 19)]);
    }, 1800);

    return () => clearInterval(interval);
  }, [isStreaming, isOpen, isHostelBAnomalyInjected, isOutcomeVerified]);

  if (!isOpen) return null;

  const filteredPackets = packets.filter(p => selectedProtocol === 'ALL' || p.protocol === selectedProtocol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-950 border border-cyan-800/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-wide">
                  Cyber-Physical Telemetry & Ingestion Inspector
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  ● DEMO DATA (SIMULATION MODE)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Packets formatted according to official <strong>Modbus-TCP (IEC 61158)</strong> and <strong>LoRaWAN IN865</strong> payload specs for GCEK campus evaluation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isStreaming 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isStreaming ? 'Pause Stream' : 'Resume'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px]">Protocol Filter:</span>
            {['ALL', 'MODBUS-TCP', 'LORAWAN', 'SMART-BIN'].map(proto => (
              <button
                key={proto}
                onClick={() => setSelectedProtocol(proto)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  selectedProtocol === proto
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>Buffer: {packets.length} Packets</span>
            <span>CRC Checks: 100% Passed</span>
            <span className="text-emerald-400">Zero Packet Drop</span>
          </div>
        </div>

        {/* Packet Stream Console */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-xs bg-slate-950/95 no-scrollbar">
          {filteredPackets.map(pkt => (
            <div
              key={pkt.id}
              className={`p-2.5 rounded-lg border text-[11px] flex items-start justify-between gap-3 transition-all ${
                pkt.status === 'ANOMALY'
                  ? 'bg-rose-950/40 border-rose-500/80 text-rose-200 ring-1 ring-rose-500/50'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-slate-500 text-[10px] whitespace-nowrap mt-0.5">{pkt.timestamp}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  pkt.protocol === 'MODBUS-TCP' 
                    ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                    : pkt.protocol === 'LORAWAN'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {pkt.protocol}
                </span>
                <span className="text-white font-bold whitespace-nowrap">[{pkt.nodeCode} • {pkt.meterId}]</span>
                <span className="text-slate-300 leading-snug">{pkt.payload}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-500">{pkt.latencyMs}ms</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                  pkt.status === 'ANOMALY' 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {pkt.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Telemetry Ingestion Gateway synchronized with GreenCore Edge Bus</span>
          </div>
          <span className="font-mono text-cyan-300">Modbus Port: 502 • LoRaWAN Band: IN865 (India)</span>
        </div>
      </div>
    </div>
  );
};
