import { Router, Request, Response } from 'express';
import { 
  INITIAL_NODES, 
  DEFAULT_METHODOLOGY, 
  HISTORICAL_12_MONTHS, 
  ACTION_SIMULATION_CATALOG, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_EVIDENCE_ITEMS, 
  INITIAL_GREEN_MISSIONS, 
  INJECTED_HOSTEL_B_ANOMALY 
} from '../data/mockCampusData.js';
import { calculateCampusScores } from '../engine/scoringEngine.js';
import { validateSustainabilitySubmission } from '../engine/dataQualityEngine.js';
import { processAIQuery } from '../engine/aiDiagnosticEngine.js';
import { CampusNode, CampusMode, AuditRecord, ActionSimulationOption, GreenMission, MethodologyConfig } from '../types/index.js';

const router = Router();

// In-memory state for the active campus twin
let currentMode: CampusMode = 'hybrid';
let campusNodes: CampusNode[] = JSON.parse(JSON.stringify(INITIAL_NODES));
let campusMethodology: MethodologyConfig = JSON.parse(JSON.stringify(DEFAULT_METHODOLOGY));
let isHostelBAnomalyInjected: boolean = false;
let isOutcomeVerified: boolean = false;
let simulationOptions: ActionSimulationOption[] = JSON.parse(JSON.stringify(ACTION_SIMULATION_CATALOG));
let auditLogs: AuditRecord[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
let missions: GreenMission[] = JSON.parse(JSON.stringify(INITIAL_GREEN_MISSIONS));

// Helper: Calculate live scores
const getLiveScores = (mode: CampusMode = currentMode) => {
  return calculateCampusScores(campusNodes, campusMethodology, isHostelBAnomalyInjected && !isOutcomeVerified, mode);
};

// Mode Switcher: POST /api/campus/mode
router.post('/mode', (req: Request, res: Response) => {
  const { mode } = req.body as { mode: CampusMode };
  if (mode && ['manual', 'hybrid', 'iot'].includes(mode)) {
    currentMode = mode;
  }
  res.json({
    success: true,
    mode: currentMode,
    scores: getLiveScores(currentMode)
  });
});

// 1. GET /api/campus/overview
router.get('/overview', (req: Request, res: Response) => {
  const modeQuery = (req.query.mode as CampusMode) || currentMode;
  const scores = getLiveScores(modeQuery);
  const anomalies = isHostelBAnomalyInjected && !isOutcomeVerified ? [INJECTED_HOSTEL_B_ANOMALY] : [];
  res.json({
    success: true,
    campus: 'Govt. College of Engineering Kalahandi (GCEK)',
    period: 'September 2026',
    mode: currentMode,
    scores,
    anomalies,
    isHostelBAnomalyInjected,
    isOutcomeVerified,
    totalNodes: campusNodes.length,
    population: campusNodes.reduce((s, n) => s + n.population, 0),
  });
});

// 2. GET /api/campus/nodes
router.get('/nodes', (req: Request, res: Response) => {
  res.json({ success: true, nodes: campusNodes });
});

// 3. GET /api/campus/nodes/:id
router.get('/nodes/:id', (req: Request, res: Response) => {
  const node = campusNodes.find(n => n.id === req.params.id);
  if (!node) {
    return res.status(404).json({ success: false, message: 'Campus node not found' });
  }
  res.json({ success: true, node });
});

// 4. GET /api/campus/scores
router.get('/scores', (req: Request, res: Response) => {
  res.json({ success: true, scores: getLiveScores() });
});

// 5. GET /api/campus/history
router.get('/history', (req: Request, res: Response) => {
  res.json({ success: true, history: HISTORICAL_12_MONTHS });
});

// 6. POST /api/campus/manual-entry
router.post('/manual-entry', (req: Request, res: Response) => {
  const { nodeId, category, value, unit, actor, reason } = req.body;
  const node = campusNodes.find(n => n.id === nodeId);
  if (!node) {
    return res.status(404).json({ success: false, message: 'Invalid target node' });
  }

  const baseline = category === 'energy' 
    ? node.metrics.energyKWh 
    : category === 'water' 
      ? node.metrics.waterLitres 
      : node.metrics.wasteKg;

  const validation = validateSustainabilitySubmission({
    nodeId,
    category,
    value: Number(value),
    unit,
    source: 'Manual Log',
    previousBaseline: baseline
  });

  const newLog: AuditRecord = {
    id: `AUD-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actor: actor || 'Facility Staff',
    nodeId,
    nodeName: node.name,
    metricType: `Manual ${category.toUpperCase()} Log`,
    previousValue: `${baseline.toLocaleString()} ${unit}`,
    newValue: `${Number(value).toLocaleString()} ${unit}`,
    reason: reason || 'Manual sub-meter entry',
    source: 'Manual Log',
    verificationStatus: validation.status,
    checksum: `sha256:${Math.random().toString(36).substring(2, 12)}...`
  };

  auditLogs.unshift(newLog);

  if (validation.isValid && validation.scoreImpactAllowed) {
    campusNodes = campusNodes.map(n => {
      if (n.id === nodeId) {
        const updated = { ...n };
        const numVal = Number(value);
        if (category === 'energy') {
          updated.metrics.energyKWh = numVal;
          updated.metrics.energyPerStudent = +(numVal / n.population).toFixed(2);
        } else if (category === 'water') {
          updated.metrics.waterLitres = numVal;
          updated.metrics.waterPerStudentPerDay = +((numVal / 30) / n.population).toFixed(1);
        } else if (category === 'waste') {
          updated.metrics.wasteKg = numVal;
        }
        return updated;
      }
      return n;
    });
  }

  res.json({
    success: true,
    validation,
    auditRecord: newLog,
    updatedScores: getLiveScores()
  });
});

// 7. Killer Demo: Inject Hostel B Anomaly
router.post('/anomaly/inject', (req: Request, res: Response) => {
  isHostelBAnomalyInjected = true;
  isOutcomeVerified = false;

  campusNodes = campusNodes.map(n => {
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
  });

  const anomalyLog: AuditRecord = {
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
  auditLogs.unshift(anomalyLog);

  res.json({
    success: true,
    message: 'Hostel B Water Anomaly Injected',
    anomaly: INJECTED_HOSTEL_B_ANOMALY,
    scores: getLiveScores()
  });
});

// 8. Killer Demo: Resolve Anomaly (Verify Outcome)
router.post('/anomaly/resolve', (req: Request, res: Response) => {
  isOutcomeVerified = true;

  campusNodes = campusNodes.map(n => {
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
  });

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
  auditLogs.unshift(verificationLog);

  res.json({
    success: true,
    message: 'Hostel B Repair Verified and Sealed',
    scores: getLiveScores()
  });
});

// 9. Reset Demo
router.post('/anomaly/reset', (req: Request, res: Response) => {
  isHostelBAnomalyInjected = false;
  isOutcomeVerified = false;
  campusNodes = JSON.parse(JSON.stringify(INITIAL_NODES));
  res.json({ success: true, message: 'Campus state reset to optimal baseline' });
});

// 10. GET /api/campus/simulation-options
router.get('/simulation-options', (req: Request, res: Response) => {
  res.json({ success: true, options: simulationOptions });
});

// 11. POST /api/campus/simulate
router.post('/simulate', (req: Request, res: Response) => {
  const { selectedIds } = req.body as { selectedIds: string[] };
  const selected = simulationOptions.filter(o => selectedIds.includes(o.id));

  const totalCapitalINR = selected.reduce((s, o) => s + o.capitalCostINR, 0);
  const totalAnnualSavingsINR = selected.reduce((s, o) => s + o.annualSavingsINR, 0);
  const totalCO2Tons = selected.reduce((s, o) => s + o.co2ReductionTonsPerYear, 0);
  const paybackMonths = totalAnnualSavingsINR > 0 ? +((totalCapitalINR / totalAnnualSavingsINR) * 12).toFixed(1) : 0;

  const currentScores = getLiveScores();
  const simulatedEnergy = Math.min(100, Math.round(currentScores.energyScore + selected.reduce((s, o) => s + o.energyImprovementDelta, 0)));
  const simulatedWater = Math.min(100, Math.round(currentScores.waterScore + selected.reduce((s, o) => s + o.waterImprovementDelta, 0)));
  const simulatedWaste = Math.min(100, Math.round(currentScores.wasteScore + selected.reduce((s, o) => s + o.wasteImprovementDelta, 0)));
  const simulatedTransport = Math.min(100, Math.round(currentScores.transportScore + selected.reduce((s, o) => s + o.transportImprovementDelta, 0)));

  const simulatedOverall = Math.min(100, Math.round(
    simulatedEnergy * campusMethodology.weights.energy +
    simulatedWater * campusMethodology.weights.water +
    simulatedWaste * campusMethodology.weights.waste +
    simulatedTransport * campusMethodology.weights.transport
  ));

  res.json({
    success: true,
    financials: {
      capitalOutlayINR: totalCapitalINR,
      annualSavingsINR: totalAnnualSavingsINR,
      paybackMonths,
      annualCO2ReductionTons: totalCO2Tons,
    },
    scores: {
      before: currentScores.compositeScore,
      after: simulatedOverall,
      delta: simulatedOverall - currentScores.compositeScore,
      pillars: {
        energy: { before: currentScores.energyScore, after: simulatedEnergy },
        water: { before: currentScores.waterScore, after: simulatedWater },
        waste: { before: currentScores.wasteScore, after: simulatedWaste },
        transport: { before: currentScores.transportScore, after: simulatedTransport },
      }
    }
  });
});

// 12. GET & POST /api/campus/missions
router.get('/missions', (req: Request, res: Response) => {
  res.json({ success: true, missions });
});

router.post('/missions/:id/join', (req: Request, res: Response) => {
  missions = missions.map(m => {
    if (m.id === req.params.id) {
      return {
        ...m,
        participantsCount: m.participantsCount + 1,
        progressPercent: Math.min(100, m.progressPercent + 2)
      };
    }
    return m;
  });
  res.json({ success: true, mission: missions.find(m => m.id === req.params.id) });
});

// 13. GET /api/campus/audit-logs
router.get('/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, logs: auditLogs });
});

// 14. GET /api/campus/evidence
router.get('/evidence', (req: Request, res: Response) => {
  res.json({ success: true, evidence: INITIAL_EVIDENCE_ITEMS });
});

// 15. POST /api/campus/ai/query
router.post('/ai/query', (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query string required' });
  }
  const result = processAIQuery(query, isHostelBAnomalyInjected && !isOutcomeVerified);
  res.json({ success: true, query, result });
});

export default router;
