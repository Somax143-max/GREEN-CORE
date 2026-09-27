import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  CampusNode, 
  CampusMode, 
  MethodologyConfig, 
  ActionSimulationOption, 
  AuditRecord, 
  EvidenceMetricItem, 
  GreenMission, 
  AnomalyAlert 
} from '../types';
import { 
  INITIAL_NODES, 
  DEFAULT_METHODOLOGY, 
  ACTION_SIMULATION_CATALOG, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_EVIDENCE_ITEMS, 
  INITIAL_GREEN_MISSIONS, 
  INJECTED_HOSTEL_B_ANOMALY 
} from '../data/mockCampusData';
import { calculateCampusScores, ScoreBreakdown } from '../engine/scoringEngine';
import { validateSustainabilitySubmission, ValidationResult } from '../engine/dataQualityEngine';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface CampusContextType {
  mode: CampusMode;
  setMode: (mode: CampusMode) => void;
  nodes: CampusNode[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  methodology: MethodologyConfig;
  setMethodology: React.Dispatch<React.SetStateAction<MethodologyConfig>>;
  scores: ScoreBreakdown;
  anomalies: AnomalyAlert[];
  simulationOptions: ActionSimulationOption[];
  toggleSimulationOption: (id: string) => void;
  auditLogs: AuditRecord[];
  evidenceItems: EvidenceMetricItem[];
  missions: GreenMission[];
  joinMission: (id: string) => void;
  isBackendConnected: boolean;
  
  // Killer Demo Walkthrough Controls
  killerDemoStep: number;
  setKillerDemoStep: (step: number) => void;
  isHostelBAnomalyInjected: boolean;
  isInterventionSimulated: boolean;
  isOutcomeVerified: boolean;
  injectHostelBWaterAnomaly: () => void;
  simulateHostelBIntervention: () => void;
  verifyInterventionOutcome: () => void;
  resetDemo: () => void;

  // Manual logging
  addManualEntry: (params: {
    nodeId: string;
    category: 'energy' | 'water' | 'waste' | 'transport';
    value: number;
    unit: string;
    actor: string;
    reason: string;
  }) => ValidationResult;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<CampusMode>('hybrid');
  const [nodes, setNodes] = useState<CampusNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [methodology, setMethodology] = useState<MethodologyConfig>(DEFAULT_METHODOLOGY);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  
  const [killerDemoStep, setKillerDemoStep] = useState<number>(1);
  const [isHostelBAnomalyInjected, setIsHostelBAnomalyInjected] = useState<boolean>(false);
  const [isInterventionSimulated, setIsInterventionSimulated] = useState<boolean>(false);
  const [isOutcomeVerified, setIsOutcomeVerified] = useState<boolean>(false);

  const [simulationOptions, setSimulationOptions] = useState<ActionSimulationOption[]>(ACTION_SIMULATION_CATALOG);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceMetricItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [missions, setMissions] = useState<GreenMission[]>(INITIAL_GREEN_MISSIONS);

  // Check backend health on mount
  useEffect(() => {
    let mounted = true;
    api.checkHealth().then(res => {
      if (mounted) {
        setIsBackendConnected(res.online);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Active anomalies
  const anomalies = useMemo(() => {
    if (isHostelBAnomalyInjected && !isOutcomeVerified) {
      return [INJECTED_HOSTEL_B_ANOMALY];
    }
    return [];
  }, [isHostelBAnomalyInjected, isOutcomeVerified]);

  // Dynamic scores (recomputes confidence & provenance when mode changes)
  const scores = useMemo(() => {
    return calculateCampusScores(nodes, methodology, isHostelBAnomalyInjected && !isOutcomeVerified, mode);
  }, [nodes, methodology, isHostelBAnomalyInjected, isOutcomeVerified, mode]);

  // Toggle Action Simulation option
  const toggleSimulationOption = (id: string) => {
    setSimulationOptions(prev => prev.map(opt => {
      if (opt.id === id) {
        return { ...opt, selected: !opt.selected };
      }
      return opt;
    }));
  };

  // Join Green Mission
  const joinMission = (id: string) => {
    if (isBackendConnected) {
      api.joinMission(id).catch(() => {});
    }

    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
        return {
          ...m,
          participantsCount: m.participantsCount + 1,
          progressPercent: Math.min(100, m.progressPercent + 2)
        };
      }
      return m;
    }));
  };

  // Killer Demo Step Actions
  const injectHostelBWaterAnomaly = () => {
    if (isBackendConnected) {
      api.injectAnomaly().catch(() => {});
    }

    setIsHostelBAnomalyInjected(true);
    setIsOutcomeVerified(false);
    setKillerDemoStep(3);

    // Update Hostel B state to show surge: 142 -> 188 L/student/day
    setNodes(prev => prev.map(n => {
      if (n.id === 'hostel_h2') {
        return {
          ...n,
          status: 'critical',
          greenScore: 68,
          metrics: {
            ...n.metrics,
            waterLitres: 2368800,
            waterPerStudentPerDay: 188.0,
          }
        };
      }
      return n;
    }));

    // Add audit log entry
    const newLog: AuditRecord = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'Autonomous LoRaWAN Sentinel',
      nodeId: 'hostel_h2',
      nodeName: 'Hostel B (Indravati)',
      metricType: 'Telemetry Threshold Breach',
      previousValue: '142.0 L/student/day',
      newValue: '188.0 L/student/day (+32.4%)',
      reason: 'Sustained night-flow leak pattern flagged by ML Isolation Forest',
      source: 'Smart Meter API',
      verificationStatus: 'Flagged',
      checksum: 'sha256:49c2d1b8e...'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const simulateHostelBIntervention = () => {
    setIsInterventionSimulated(true);
    setKillerDemoStep(6);
  };

  const verifyInterventionOutcome = () => {
    if (isBackendConnected) {
      api.resolveAnomaly().catch(() => {});
    }

    setIsOutcomeVerified(true);
    setKillerDemoStep(7);

    // Post-repair restored state: 188 -> 149 L/student/day (20.7% saving vs peak)
    setNodes(prev => prev.map(n => {
      if (n.id === 'hostel_h2') {
        return {
          ...n,
          status: 'optimal',
          greenScore: 84,
          metrics: {
            ...n.metrics,
            waterLitres: 1877400,
            waterPerStudentPerDay: 149.0,
          }
        };
      }
      return n;
    }));

    // Add verification audit log
    const verificationLog: AuditRecord = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'Er. Rajesh Panda (Facility Lead)',
      nodeId: 'hostel_h2',
      nodeName: 'Hostel B (Indravati)',
      metricType: 'Closed-Loop Verification',
      previousValue: '188.0 L/student/day',
      newValue: '149.0 L/student/day (-20.7%)',
      reason: 'Underground feeder valve replaced & float valve recalibrated. Physical leak sealed.',
      source: 'Smart Meter API',
      verificationStatus: 'Verified',
      checksum: 'sha256:77f981ca3...'
    };
    setAuditLogs(prev => [verificationLog, ...prev]);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetDemo = () => {
    if (isBackendConnected) {
      api.resetDemo().catch(() => {});
    }

    setIsHostelBAnomalyInjected(false);
    setIsInterventionSimulated(false);
    setIsOutcomeVerified(false);
    setKillerDemoStep(1);
    setNodes(INITIAL_NODES);
  };

  // Manual reading entry
  const addManualEntry = (params: {
    nodeId: string;
    category: 'energy' | 'water' | 'waste' | 'transport';
    value: number;
    unit: string;
    actor: string;
    reason: string;
  }): ValidationResult => {
    const node = nodes.find(n => n.id === params.nodeId);
    const baseline = node 
      ? (params.category === 'energy' 
          ? node.metrics.energyKWh 
          : params.category === 'water' 
            ? node.metrics.waterLitres 
            : node.metrics.wasteKg)
      : 1000;

    const validation = validateSustainabilitySubmission({
      nodeId: params.nodeId,
      category: params.category,
      value: params.value,
      unit: params.unit,
      source: 'Manual Log',
      previousBaseline: baseline
    });

    if (isBackendConnected) {
      api.submitManualEntry(params).catch(() => {});
    }

    // Create Audit Record
    const newLog: AuditRecord = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: params.actor || 'Facility Officer',
      nodeId: params.nodeId,
      nodeName: node ? node.name : params.nodeId,
      metricType: `Manual ${params.category.toUpperCase()} Log`,
      previousValue: `${baseline.toLocaleString()} ${params.unit}`,
      newValue: `${params.value.toLocaleString()} ${params.unit}`,
      reason: params.reason || 'Periodic manual meter logging',
      source: 'Manual Log',
      verificationStatus: validation.status,
      checksum: `sha256:${Math.random().toString(36).substring(2, 12)}...`
    };

    setAuditLogs(prev => [newLog, ...prev]);

    if (validation.isValid && validation.scoreImpactAllowed && node) {
      setNodes(prev => prev.map(n => {
        if (n.id === params.nodeId) {
          const updated = { ...n };
          if (params.category === 'energy') {
            updated.metrics.energyKWh = params.value;
            updated.metrics.energyPerStudent = +(params.value / n.population).toFixed(2);
          } else if (params.category === 'water') {
            updated.metrics.waterLitres = params.value;
            updated.metrics.waterPerStudentPerDay = +((params.value / 30) / n.population).toFixed(1);
          } else if (params.category === 'waste') {
            updated.metrics.wasteKg = params.value;
          }
          return updated;
        }
        return n;
      }));
    }

    return validation;
  };

  return (
    <CampusContext.Provider value={{
      mode,
      setMode,
      nodes,
      selectedNodeId,
      setSelectedNodeId,
      methodology,
      setMethodology,
      scores,
      anomalies,
      simulationOptions,
      toggleSimulationOption,
      auditLogs,
      evidenceItems,
      missions,
      joinMission,
      isBackendConnected,
      killerDemoStep,
      setKillerDemoStep,
      isHostelBAnomalyInjected,
      isInterventionSimulated,
      isOutcomeVerified,
      injectHostelBWaterAnomaly,
      simulateHostelBIntervention,
      verifyInterventionOutcome,
      resetDemo,
      addManualEntry
    }}>
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
