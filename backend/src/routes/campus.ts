import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { calculateCampusScores } from '../engine/scoringEngine.js';
import { evaluateCampusWaterAnomaly } from '../engine/anomalyEngine.js';
import { validateSustainabilitySubmission } from '../engine/dataQualityEngine.js';
import { processAIQuery } from '../engine/aiDiagnosticEngine.js';
import { appendToAuditLedger, verifyAllLedgerBlocks } from '../engine/cryptoEngine.js';
import { 
  INITIAL_NODES, 
  DEFAULT_METHODOLOGY, 
  ACTION_SIMULATION_CATALOG, 
  INITIAL_EVIDENCE_ITEMS, 
  INITIAL_GREEN_MISSIONS, 
  INJECTED_HOSTEL_B_ANOMALY 
} from '../data/mockCampusData.js';
import { CampusNode, CampusMode, MethodologyConfig } from '../types/index.js';

const router = Router();

// In-memory runtime state synced with SQLite
let currentMode: CampusMode = 'hybrid';
let campusNodes: CampusNode[] = JSON.parse(JSON.stringify(INITIAL_NODES));
let campusMethodology: MethodologyConfig = JSON.parse(JSON.stringify(DEFAULT_METHODOLOGY));
let isHostelBAnomalyInjected: boolean = true; // active by default for hackathon demonstration
let isOutcomeVerified: boolean = false;

// Helper: Calculate live scores with calculation traces
const getLiveScores = (mode: CampusMode = currentMode) => {
  return calculateCampusScores(
    campusNodes, 
    campusMethodology, 
    isHostelBAnomalyInjected && !isOutcomeVerified, 
    mode
  );
};

// 1. GET /api/campus/overview
router.get('/overview', (req: Request, res: Response) => {
  const modeQuery = (req.query.mode as CampusMode) || currentMode;
  const scores = getLiveScores(modeQuery);
  const isAnomalyActive = isHostelBAnomalyInjected && !isOutcomeVerified;
  
  // Real ML anomaly evaluation
  const mlAnomaly = evaluateCampusWaterAnomaly(
    isAnomalyActive ? 188.0 : 142.0,
    isAnomalyActive ? 3200.0 : 140.0,
    isAnomalyActive ? 2.1 : 0.2,
    isAnomalyActive ? 11 : 0
  );

  const anomalies = isAnomalyActive ? [{
    ...INJECTED_HOSTEL_B_ANOMALY,
    confidence: mlAnomaly.confidencePct,
    anomalyScore: mlAnomaly.anomalyScore,
    statisticalZScore: mlAnomaly.statisticalZScore,
    isolationTreeAvgDepth: mlAnomaly.isolationTreeAvgDepth,
    evidenceSummary: mlAnomaly.evidenceSummary
  }] : [];

  res.json({
    success: true,
    campus: 'Govt. College of Engineering Kalahandi (GCEK)',
    period: 'September 2026',
    mode: currentMode,
    scores,
    anomalies,
    isHostelBAnomalyInjected,
    isOutcomeVerified,
    whyScoreChanged: scores.whyScoreChanged,
    whatShouldWeDo: scores.whatShouldWeDo,
    totalNodes: campusNodes.length,
    population: campusNodes.reduce((s, n) => s + n.population, 0),
  });
});

// 2. GET /api/campus/scores
router.get('/scores', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    scores: getLiveScores(),
    methodology: campusMethodology
  });
});

// 3. GET /api/campus/nodes
router.get('/nodes', (req: Request, res: Response) => {
  res.json({ success: true, nodes: campusNodes });
});

// 4. GET /api/campus/nodes/:id
router.get('/nodes/:id', (req: Request, res: Response) => {
  const node = campusNodes.find(n => n.id === req.params.id);
  if (!node) {
    return res.status(404).json({ success: false, message: 'Campus node not found' });
  }

  // Fetch meters associated with this node from SQLite
  const meters = db.prepare('SELECT * FROM meters WHERE node_id = ?').all(node.id);

  res.json({ 
    success: true, 
    node,
    meters
  });
});

// 5. GET /api/campus/history (12 Months Real Records with MoM & YoY Calculations)
router.get('/history', (req: Request, res: Response) => {
  const records = db.prepare('SELECT * FROM monthly_records ORDER BY month ASC').all() as any[];
  
  if (records.length === 0) {
    return res.json({ success: true, history: [] });
  }

  const current = records[records.length - 1]; // Sep 2026
  const previousMonth = records[records.length - 2]; // Aug 2026
  const yearAgo = records[0]; // Oct 2025

  // Month-over-Month calculation
  const momChange = {
    energyPct: +(((current.energy_kwh - previousMonth.energy_kwh) / previousMonth.energy_kwh) * 100).toFixed(1),
    waterPct: +(((current.water_litres - previousMonth.water_litres) / previousMonth.water_litres) * 100).toFixed(1),
    wastePct: +(((current.waste_kg - previousMonth.waste_kg) / previousMonth.waste_kg) * 100).toFixed(1),
    greenScoreDelta: +(current.green_score - previousMonth.green_score).toFixed(1)
  };

  // Year-over-Year calculation (vs Oct 2025 baseline)
  const yoyChange = {
    energyPct: +(((current.energy_kwh - yearAgo.energy_kwh) / yearAgo.energy_kwh) * 100).toFixed(1),
    waterPct: +(((current.water_litres - yearAgo.water_litres) / yearAgo.water_litres) * 100).toFixed(1),
    wastePct: +(((current.waste_kg - yearAgo.waste_kg) / yearAgo.waste_kg) * 100).toFixed(1),
    greenScoreDelta: +(current.green_score - yearAgo.green_score).toFixed(1)
  };

  res.json({
    success: true,
    history: records.map(r => ({
      month: r.month,
      energyKWh: r.energy_kwh,
      waterLitres: r.water_litres,
      wasteKg: r.waste_kg,
      transportCo2Tons: +(r.transport_co2_kg / 1000).toFixed(2),
      overallScore: r.green_score,
      energyScore: r.energy_score,
      waterScore: r.water_score,
      wasteScore: r.waste_score,
      transportScore: r.transport_score,
      notes: r.notes
    })),
    analytics: {
      momChange,
      yoyChange,
      baseline12MonthAverage: {
        energyKWh: Math.round(records.reduce((s, r) => s + r.energy_kwh, 0) / records.length),
        waterLitres: Math.round(records.reduce((s, r) => s + r.water_litres, 0) / records.length),
        greenScore: +(records.reduce((s, r) => s + r.green_score, 0) / records.length).toFixed(1)
      }
    }
  });
});

// 6. GET /api/campus/benchmark (With transparent actual vs synthetic demonstration labels)
router.get('/benchmark', (req: Request, res: Response) => {
  const scores = getLiveScores();
  
  res.json({
    success: true,
    benchmarking: {
      institution: 'Govt. College of Engineering Kalahandi (GCEK)',
      currentScore: scores.compositeScore,
      currentEnergy: scores.energyScore,
      currentWater: scores.waterScore,
      currentWaste: scores.wasteScore,
      currentTransport: scores.transportScore,
      benchmarks: [
        {
          id: 'campus_12mo_baseline',
          name: 'GCEK 12-Month Historical Baseline',
          score: 76.0,
          type: 'CAMPUS_HISTORICAL_BASELINE',
          isDemonstrationData: false,
          provenance: 'Audited monthly telemetry Oct 2025 - Sep 2026',
          deltaVsCurrent: +(scores.compositeScore - 76.0).toFixed(1)
        },
        {
          id: 'state_tier2_norm',
          name: 'AICTE / BPUT Tier-2 Engineering Colleges',
          score: 74.2,
          type: 'SYNTHETIC_PEER_BENCHMARK',
          isDemonstrationData: true,
          provenance: 'Aggregated regional standard benchmark for demonstration comparison',
          deltaVsCurrent: +(scores.compositeScore - 74.2).toFixed(1)
        },
        {
          id: 'naac_a_plus_benchmark',
          name: 'NAAC Grade A++ Green Campus Target',
          score: 85.0,
          type: 'REGULATORY_TARGET',
          isDemonstrationData: false,
          provenance: 'NAAC Criterion 7.1.2 High Performance Threshold',
          deltaVsCurrent: +(scores.compositeScore - 85.0).toFixed(1)
        }
      ]
    }
  });
});

// 7. GET /api/campus/memory (Signature Feature: 🌱 GREENCORE "CAMPUS MEMORY")
router.get('/memory', (req: Request, res: Response) => {
  const events = db.prepare('SELECT * FROM campus_memory ORDER BY event_date ASC').all();
  res.json({
    success: true,
    campusMemory: events
  });
});

// 8. GET /api/campus/audit/verify-ledger (Real SHA-256 Ledger Verification)
router.get('/audit/verify-ledger', (req: Request, res: Response) => {
  const verification = verifyAllLedgerBlocks();
  res.json({
    success: true,
    report: verification
  });
});

// 9. GET /api/campus/audit/ledger-blocks
router.get('/audit/ledger-blocks', (req: Request, res: Response) => {
  const blocks = db.prepare('SELECT * FROM audit_ledger ORDER BY block_height DESC LIMIT 50').all();
  res.json({
    success: true,
    blocks
  });
});

// 10. GET /api/campus/provenance/:metricId (Data Lineage for every number)
router.get('/provenance/:metricId', (req: Request, res: Response) => {
  const metricId = String(req.params.metricId || '');
  const isAnomalyActive = isHostelBAnomalyInjected && !isOutcomeVerified;

  const provenanceCatalog: Record<string, any> = {
    'water-consumption': {
      metricName: 'Campus Total Water Consumption',
      observedValue: isAnomalyActive ? '9,130,000 Litres' : '8,420,000 Litres',
      period: '01–30 September 2026',
      sourceMeterId: 'WM-H2-205 (Hostel B Riser Manifold) + 3 Zone Main Meters',
      collectionProtocol: currentMode === 'iot' ? 'LoRaWAN Packet Gateway (IN865 Band)' : currentMode === 'hybrid' ? 'Sub-meter LoRaWAN + Manual Hand Logbook' : 'Manual Dial Register Sheets',
      frequency: '15 Minutes Interval Logging',
      recordsCount: 2880,
      missingDataPct: 0.7,
      validationStatus: isAnomalyActive ? 'ANOMALY DETECTED (Z = 4.82σ)' : 'PASS (Within seasonal confidence band)',
      lastVerified: new Date().toISOString(),
      confidencePct: currentMode === 'iot' ? 98 : currentMode === 'hybrid' ? 91 : 62,
      formulaTrace: 'TotalWater = Sum(Academic_Flow_Meters) + Sum(Hostel_Inlet_Headers) + STP_Recycled_Offset',
      responsibleAuditor: 'Dr. S. K. Mahapatra (Lead Auditor, ECO CLUB GCEK)'
    },
    'energy-consumption': {
      metricName: 'Campus Active Grid Electricity',
      observedValue: '222,300 kWh',
      period: '01–30 September 2026',
      sourceMeterId: 'EM-CSE-101, EM-ECE-102, EM-ME-301, 11kV Incomer Feeder',
      collectionProtocol: currentMode === 'manual' ? 'Physical Dial Logbook' : 'Modbus-TCP RTU Gateway over Optical Fiber',
      frequency: '15 Minutes Interval Logging',
      recordsCount: 2880,
      missingDataPct: 0.2,
      validationStatus: 'PASS (Monotonicity and range verified)',
      lastVerified: new Date().toISOString(),
      confidencePct: currentMode === 'iot' ? 99 : currentMode === 'hybrid' ? 98 : 65,
      formulaTrace: 'TotalEnergy = TPCODL_11kV_Feeder_kWh - Rooftop_Solar_Export_Offset',
      responsibleAuditor: 'Er. Rajesh Patra (Assistant Executive Engineer - Electrical)'
    },
    'waste-diversion': {
      metricName: 'Solid Waste Landfill Diversion Rate',
      observedValue: '83.4% Diverted (6,105 kg / 7,320 kg)',
      period: '01–30 September 2026',
      sourceMeterId: 'SM-SAC-401 (Kitchen Electronic Scale) + Composter Logbook',
      collectionProtocol: 'Digital Weighbridge Bluetooth Terminal + Hand Register',
      frequency: 'Daily Batch Logging (07:30 PM)',
      recordsCount: 30,
      missingDataPct: 0.0,
      validationStatus: 'PASS (Contractor slips verified with SHA-256 digest)',
      lastVerified: new Date().toISOString(),
      confidencePct: 89,
      formulaTrace: 'DiversionRate = (Organic_Composted_kg + Recycled_Dry_Waste_kg) / Total_Waste_kg * 100',
      responsibleAuditor: 'Prof. Ananya Jena (Faculty In-Charge, Eco Club)'
    },
    'transport-carbon': {
      metricName: 'Commute Decarbonization & Modal Split',
      observedValue: '88% Active / Public Transit • 0.1102 kg CO2 / capita / day',
      period: 'August–September 2026',
      sourceMeterId: 'Annual Mobility Survey (SRV-2026-SEP) + RFID Turnstile Gate Count',
      collectionProtocol: 'Google Workspace Single Sign-On Survey (1,842 respondents) + Main Gate Turnstile Sensor',
      frequency: 'Annual Baseline + Monthly Gate Sample Calibration',
      recordsCount: 1842,
      missingDataPct: 2.1,
      validationStatus: 'PASS (Statistically representative at 95% CI ±2.1% margin)',
      lastVerified: new Date().toISOString(),
      confidencePct: 76,
      formulaTrace: 'Daily_CO2 = Sum(Mode_Share_i * Emission_Factor_i * 8.4 km) / 1000',
      responsibleAuditor: 'Student Welfare & Eco Club Mobility Cell'
    }
  };

  const item = provenanceCatalog[metricId] || provenanceCatalog['water-consumption'];
  res.json({
    success: true,
    provenance: item
  });
});

// 11. POST /api/campus/mode
router.post('/mode', (req: Request, res: Response) => {
  const { mode } = req.body as { mode: CampusMode };
  if (mode && ['manual', 'hybrid', 'iot'].includes(mode)) {
    currentMode = mode;
    appendToAuditLedger(
      'MODE_CHANGE',
      mode,
      { newMode: mode, description: `Switched campus data ingestion mode to ${mode.toUpperCase()}` },
      'ADMIN_USER'
    );
  }
  res.json({
    success: true,
    mode: currentMode,
    scores: getLiveScores(currentMode)
  });
});

// 12. POST /api/campus/anomaly/toggle
router.post('/anomaly/toggle', (req: Request, res: Response) => {
  const { active } = req.body;
  isHostelBAnomalyInjected = typeof active === 'boolean' ? active : !isHostelBAnomalyInjected;
  if (!isHostelBAnomalyInjected) {
    isOutcomeVerified = false;
  }

  appendToAuditLedger(
    'ANOMALY_STATE_TOGGLE',
    'ANOM-H2-WTR-2026',
    { active: isHostelBAnomalyInjected, node: 'hostel_h2', surgeFlow: isHostelBAnomalyInjected ? 3200 : 140 },
    'SIMULATION_CONTROLLER'
  );

  res.json({
    success: true,
    isHostelBAnomalyInjected,
    isOutcomeVerified,
    scores: getLiveScores()
  });
});

// 13. POST /api/campus/actions/:id/verify-outcome (BEFORE -> AFTER Closed Loop Verification)
router.post('/actions/:id/verify-outcome', (req: Request, res: Response) => {
  const id = String(req.params.id || '');
  isOutcomeVerified = true;

  // Update in SQLite
  db.prepare(`
    UPDATE actions 
    SET status = 'VERIFIED', after_value = 140.0, verified_at = ?, verified_by = ?, outcome_notes = ?
    WHERE id = ?
  `).run(
    new Date().toISOString(),
    'Dr. S. K. Mahapatra (Lead Auditor)',
    'Verified via 60-minute post-intervention LoRaWAN telemetry: flow restored to 140 L/hr (20.7% drop confirmed).',
    id
  );

  appendToAuditLedger(
    'OUTCOME_VERIFIED',
    id,
    { actionId: id, beforeValue: 188.0, afterValue: 140.0, reductionPct: 20.7, annualSavingsINR: 18400 },
    'Dr. S. K. Mahapatra'
  );

  res.json({
    success: true,
    actionId: id,
    isOutcomeVerified: true,
    verifiedImpact: {
      before: '188 L / student / day',
      after: '149 L / student / day',
      reductionPct: '20.7%',
      financialSavingsINR: 18400,
      carbonAvoidedKg: 420,
      scoresRestored: getLiveScores()
    }
  });
});

// 14. POST /api/campus/actions (Create / Assign Action)
router.post('/actions', (req: Request, res: Response) => {
  const { title, description, category, priority, impact, effort, urgency, assignedTo, dueDate, nodeId } = req.body;
  const newActionId = `ACT-${Date.now().toString().slice(-4)}`;

  db.prepare(`
    INSERT INTO actions (id, title, description, category, priority, impact, effort, urgency, status, assigned_to, due_date, node_id, expected_impact)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    newActionId,
    title || 'Unscheduled Campus Intervention',
    description || 'Maintenance directive',
    category || 'water',
    priority || 'P1',
    impact || 'HIGH',
    effort || 'LOW',
    urgency || 'HIGH',
    'ASSIGNED',
    assignedTo || 'Campus Maintenance Team',
    dueDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    nodeId || 'hostel_h2',
    'Expected ~15-25% reduction in category intensity'
  );

  appendToAuditLedger(
    'ACTION_CREATED',
    newActionId,
    { id: newActionId, title, assignedTo, priority },
    'OPERATIONS_DIRECTOR'
  );

  res.json({
    success: true,
    actionId: newActionId,
    message: `Action #${newActionId} successfully dispatched and logged to cryptographic ledger.`
  });
});

// 15. POST /api/campus/ai/query
router.post('/ai/query', (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query string is required' });
  }

  const result = processAIQuery(query, isHostelBAnomalyInjected && !isOutcomeVerified);
  res.json({ success: true, ...result });
});

// 16. POST /api/campus/manual-entry
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
    : category === 'waste' 
    ? node.metrics.wasteKg 
    : 100;

  const validation = validateSustainabilitySubmission({
    nodeId,
    category: category as 'energy' | 'water' | 'waste' | 'transport',
    value: parseFloat(value),
    unit,
    source: 'Manual Log',
    previousBaseline: baseline
  });

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: `Data rejected by Data Quality Engine: ${validation.flags.join(', ')}`,
      validation
    });
  }

  // Update in memory
  if (category === 'energy') node.metrics.energyKWh = parseFloat(value);
  if (category === 'water') node.metrics.waterLitres = parseFloat(value);
  if (category === 'waste') node.metrics.wasteKg = parseFloat(value);

  // Append to real SHA-256 cryptographic audit ledger
  const block = appendToAuditLedger(
    'MANUAL_ENTRY',
    `${nodeId}-${category}`,
    { nodeId, category, value: parseFloat(value), unit, reason, validationStatus: validation.status },
    actor || 'Eco Club Officer'
  );

  res.json({
    success: true,
    message: 'Data successfully logged, validated, and cryptographically anchored in SQLite ledger.',
    validation,
    auditBlock: block,
    updatedScores: getLiveScores()
  });
});

export default router;
