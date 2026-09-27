import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  Flame, 
  RotateCcw, 
  FileWarning, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Lock, 
  Terminal, 
  Play, 
  RefreshCw,
  Search,
  Zap,
  Sliders
} from 'lucide-react';

interface AntiGamingSandboxProps {
  isOpen: boolean;
  onClose: () => void;
}

type AttackType = 'ghost' | 'rollback' | 'duplicate' | 'cliff';

interface AttackScenario {
  id: AttackType;
  title: string;
  category: 'Energy' | 'Meters' | 'Waste' | 'Water';
  description: string;
  attackerGoal: string;
  mockPayload: Record<string, any>;
  defenseMechanism: string;
  interceptStage: string;
  proofHash: string;
  verdict: 'BLOCKED' | 'FLAGGED_FOR_AUDITOR';
}

export const AntiGamingSandbox: React.FC<AntiGamingSandboxProps> = ({ isOpen, onClose }) => {
  const [selectedAttack, setSelectedAttack] = useState<AttackType>('ghost');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<{
    stagePassed: number;
    totalStages: number;
    verdict: string;
    defenseLog: string[];
    timestamp: string;
    penaltyApplied: string;
  } | null>(null);

  // Custom slider attack
  const [customFudgePercent, setCustomFudgePercent] = useState<number>(65);

  const attacks: Record<AttackType, AttackScenario> = {
    ghost: {
      id: 'ghost',
      title: 'Ghost Meter Manipulation',
      category: 'Energy',
      description: 'Entering an impossibly low consumption figure (4.2 kWh) for a 4-storey Computer Science block with 400 active workstations during peak lab hours.',
      attackerGoal: 'Artificially depress electricity consumption to win Green League Inter-Department trophy.',
      mockPayload: {
        nodeId: 'cse-dept',
        metric: 'energy_active_kwh',
        reportedValue: 4.2,
        expectedBaseline: 184.6,
        timestamp: new Date().toISOString(),
        author: 'Dept_Representative_User',
        meterId: 'EM-CSE-101'
      },
      defenseMechanism: 'Historical Bayesian Z-Score Check (z = 8.14, p < 0.0001). Extreme deviation without corresponding building shutdown schedule.',
      interceptStage: 'Stage 3: Statistical Baseline Guard',
      proofHash: '0x8f4c3b91a27e012fd9019284ba55c23e',
      verdict: 'BLOCKED'
    },
    rollback: {
      id: 'rollback',
      title: 'Meter Index Rollback Attack',
      category: 'Meters',
      description: 'Submitting a cumulative sub-meter index (48,210 kWh) that is strictly lower than yesterday’s cryptographically signed cumulative ledger reading (49,890 kWh).',
      attackerGoal: 'Reverse cumulative power counter to erase high-consumption weekend HVAC usage.',
      mockPayload: {
        nodeId: 'mech-lab',
        meterId: 'EM-MECH-301',
        cumulativePrevious: 49890.5,
        cumulativeSubmitted: 48210.0,
        delta: -1680.5,
        signature: 'client-key-secp256k1'
      },
      defenseMechanism: 'Monotonic Cumulative Counter Guard. Physical sub-meters can only increment. Negative delta without utility calibration certificate is strictly rejected.',
      interceptStage: 'Stage 2: Monotonicity Constraint Guard',
      proofHash: '0x3a91e5c704b29841ca982d61fe78a994',
      verdict: 'BLOCKED'
    },
    duplicate: {
      id: 'duplicate',
      title: 'Recycled Waste Manifest Exploit',
      category: 'Waste',
      description: 'Re-uploading last month’s wet-waste composting contractor receipt with modified form dates to claim false recycling credits without actual composting.',
      attackerGoal: 'Fulfill NAAC 7.1.3 solid waste recycling quota with zero waste processed.',
      mockPayload: {
        contractor: 'Kalahandi Organic Composting Ltd.',
        manifestId: 'WST-2026-SEP-088',
        claimedWeightKg: 420.0,
        slipHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        previousSubmissionDate: '2026-08-28'
      },
      defenseMechanism: 'SHA-256 Manifest Digest Collision Engine. Perceptual and cryptographic hash matched an already redeemed audit credit.',
      interceptStage: 'Stage 4: Cryptographic Ledger Collision Engine',
      proofHash: '0x17c994ad2f518e339b61d4a008c2a841',
      verdict: 'BLOCKED'
    },
    cliff: {
      id: 'cliff',
      title: 'Sudden Unverified 85% Cliff Drop',
      category: 'Water',
      description: 'Reporting an overnight 85% reduction in Hostel water consumption without corresponding plumbing overhaul, sensor consensus, or academic recess schedule.',
      attackerGoal: 'Avoid hostel water overuse penalties by falsifying manual meter readings.',
      mockPayload: {
        nodeId: 'hostel-a',
        metric: 'water_flow_liters',
        historicalAverage: 24500,
        submittedValue: 3675,
        dropPercentage: '-85.0%',
        linkedWorkOrder: null,
        holidayMode: false
      },
      defenseMechanism: 'Continuity & Multi-Source Cross-Corroboration. Flags drastic anomaly lacking hardware consensus; temporarily suspends trust badge until physical audit verification.',
      interceptStage: 'Stage 3: Cross-Corroboration Sentinel',
      proofHash: '0x62df88a4bc193e2710aa7491cf23901b',
      verdict: 'FLAGGED_FOR_AUDITOR'
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      const current = attacks[selectedAttack];
      setSimulationResult({
        stagePassed: current.id === 'rollback' ? 1 : current.id === 'ghost' ? 2 : current.id === 'cliff' ? 2 : 3,
        totalStages: 4,
        verdict: current.verdict,
        defenseLog: [
          `[${new Date().toLocaleTimeString()}] INGESTION: Received payload from node "${current.mockPayload.nodeId || 'UNKNOWN'}"`,
          `[${new Date().toLocaleTimeString()}] STAGE 1 (Schema & Range): PASS - Syntax and bounds valid`,
          current.id === 'rollback' 
            ? `[${new Date().toLocaleTimeString()}] STAGE 2 (Monotonicity): FAILED - Negative delta (-1,680.5 kWh) detected without recalibration token.`
            : `[${new Date().toLocaleTimeString()}] STAGE 2 (Monotonicity): PASS - Incremental counter check valid`,
          current.id === 'ghost'
            ? `[${new Date().toLocaleTimeString()}] STAGE 3 (Statistical Baseline): FAILED - Reported 4.2 kWh vs Baseline 184.6 kWh (Z = 8.14 > 3.5 threshold).`
            : current.id === 'cliff'
            ? `[${new Date().toLocaleTimeString()}] STAGE 3 (Corroboration): SUSPENDED - 85% drop has zero linked work orders or campus recess.`
            : `[${new Date().toLocaleTimeString()}] STAGE 3 (Statistical Baseline): PASS - Plausible range`,
          current.id === 'duplicate'
            ? `[${new Date().toLocaleTimeString()}] STAGE 4 (Cryptographic Ledger): FAILED - SHA-256 slip hash collision with block #2104.`
            : `[${new Date().toLocaleTimeString()}] STAGE 4 (Cryptographic Ledger): VERDICT COMPUTED`,
          `[${new Date().toLocaleTimeString()}] AUDIT ACTION: ${current.verdict} - Event appended to immutable audit ledger (Tx: ${current.proofHash.slice(0, 14)}...)`
        ],
        timestamp: new Date().toLocaleTimeString(),
        penaltyApplied: current.verdict === 'BLOCKED' ? 'Data Confidence reduced to 42% for submitting node. Red flag logged.' : 'Flagged for Human Environmental Officer approval.'
      });
      setIsSimulating(false);
    }, 700);
  };

  if (!isOpen) return null;

  const currentAttack = attacks[selectedAttack];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/60 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Adversarial Testbench
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  "Try to Cheat GREENScore"
                </span>
              </div>
              <h2 className="text-base font-black text-white">
                Anti-Gaming & Audit Tamper Interdiction Engine
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainer Sub-Banner */}
        <div className="bg-amber-950/40 border-b border-amber-900/50 px-6 py-2.5 text-xs text-amber-200/90 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            Hackathons and green audits suffer from data falsification. GREENCORE incorporates 4 layers of statistical, monotonic, and cryptographic tamper defense.
          </span>
          <span className="font-mono text-[11px] text-amber-300 font-bold hidden sm:inline">
            Status: ZERO TRUST ACTIVE
          </span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Attack Scenario Selector Grid */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Adversarial Attack Vector:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(attacks) as AttackType[]).map(key => {
                const item = attacks[key];
                const isSelected = selectedAttack === key;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedAttack(key);
                      setSimulationResult(null);
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-950/50 ring-1 ring-amber-400'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="text-amber-400 font-bold">{item.category}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.id.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-100">{item.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario Details & Execution Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Attack Definition & Malicious Payload (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    Attack Vector Description
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 font-bold">
                    MALICIOUS INTENT
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAttack.description}
                </p>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Cheat Objective:</span>
                  <p className="text-xs text-amber-300 font-medium italic">
                    "{currentAttack.attackerGoal}"
                  </p>
                </div>
              </div>

              {/* JSON Payload Inspector */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-300">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Raw Malicious Ingestion Frame
                  </span>
                  <span className="text-[10px] text-cyan-400">JSON</span>
                </div>
                <pre className="bg-slate-900/90 p-3 rounded-lg text-[11px] text-emerald-400 overflow-x-auto border border-slate-800 max-h-40">
                  {JSON.stringify(currentAttack.mockPayload, null, 2)}
                </pre>
              </div>

              {/* Simulation Trigger Button */}
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Executing Adversarial Inspection...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Inject Attack & Test Defense Engine</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Defensive Architecture & Simulation Logs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* 4-Stage Defensive Pipeline */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  GREENCORE 4-Stage Tamper Defense Pipeline
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-mono">Stage 1</div>
                    <div className="font-bold text-slate-200 mt-0.5">Schema Validation</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-1">✓ Syntax Check</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-mono">Stage 2</div>
                    <div className="font-bold text-slate-200 mt-0.5">Monotonicity</div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-1">Index Rollback Guard</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-mono">Stage 3</div>
                    <div className="font-bold text-slate-200 mt-0.5">Statistical Z-Score</div>
                    <div className="text-[10px] text-amber-400 font-mono mt-1">&gt;3.5σ Outlier Filter</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-mono">Stage 4</div>
                    <div className="font-bold text-slate-200 mt-0.5">SHA-256 Ledger</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-1">Hash Collision Check</div>
                  </div>
                </div>
              </div>

              {/* Simulation Result or Awaiting Run */}
              {simulationResult ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/50 shadow-xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                      <span className="font-black text-sm text-white">INTERCEPTION VERDICT:</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono border ${
                        simulationResult.verdict === 'BLOCKED'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {simulationResult.verdict}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Intercepted at {currentAttack.interceptStage}
                    </span>
                  </div>

                  {/* Defense Execution Stream */}
                  <div className="space-y-1.5 font-mono text-[11px] bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                    {simulationResult.defenseLog.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={log.includes('FAILED') ? 'text-rose-400 font-bold' : log.includes('PASS') ? 'text-emerald-400' : 'text-slate-300'}
                      >
                        {log}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-2 border-t border-slate-800">
                    <span className="text-rose-300 font-medium">
                      🛡️ Penalty: {simulationResult.penaltyApplied}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">
                      Evidence Hash: {currentAttack.proofHash.slice(0, 18)}...
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-2">
                  <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">Adversarial Simulator Ready</div>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Click "Inject Attack & Test Defense Engine" on the left to see GREENCORE’s real-time interception and cryptographic audit quarantine in action.
                  </p>
                </div>
              )}

              {/* Interactive Falsification Slider */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Interactive Custom Falsification Slider
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    customFudgePercent > 50 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    -{customFudgePercent}% Drop
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={customFudgePercent}
                  onChange={e => setCustomFudgePercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5% (Normal Variation)</span>
                  <span>35% (Suspicious Drop)</span>
                  <span>95% (Extreme Ghost Fraud)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {customFudgePercent <= 20 
                    ? '✓ Within normal variance bounds. Automated ingestion proceeds without flags.'
                    : customFudgePercent <= 45
                    ? '⚠️ Triggers Heuristic Review: Bayesian baseline discrepancy flagged. Confidence drops by -12%.'
                    : '🚨 IMMEDIATE FRAUD INTERCEPT: Outlier z-score exceeds 4.5. Submission quarantined into Auditor Ledger.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
