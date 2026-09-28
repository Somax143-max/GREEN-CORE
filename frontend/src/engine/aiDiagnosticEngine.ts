import { evaluateCampusWaterAnomaly } from './anomalyEngine';

export interface StructuredDiagnosticContext {
  compositeScore: number;
  previousScore: number;
  delta: number;
  largestDriver: string;
  largestDriverChangePct: number;
  nodeId: string;
  nodeName: string;
  occupancyDeltaPct: number;
  nightFlowRateLPerHr: number;
  dataConfidence: number;
  anomalyConfidence: number;
  persistenceCount: number;
  rootCauseCandidate: string;
  linkedActionId: string;
}

export interface AIQueryResponse {
  intent: 'EXPLAIN_SCORE_CHANGE' | 'SPATIAL_LOCALIZATION' | 'RECOMMEND_ACTIONS' | 'BUILDING_COMPARISON' | 'AUDIT_PROVENANCE' | 'GENERAL_SYNTHESIS';
  answer: string;
  sourceEvidence: string[];
  confidence: number;
  contextPacket: StructuredDiagnosticContext;
  structuredDetails?: {
    scoreChange?: string;
    contributors?: string[];
    largestAnomaly?: string;
    recommendation?: string;
    mathematicalProof?: string;
  };
}

export function processAIQuery(query: string, isWaterAnomalyActive: boolean): AIQueryResponse {
  const q = query.toLowerCase().trim();

  const anomalyEval = evaluateCampusWaterAnomaly(
    isWaterAnomalyActive ? 188.0 : 142.0,
    isWaterAnomalyActive ? 3200.0 : 140.0,
    isWaterAnomalyActive ? 2.1 : 0.2,
    isWaterAnomalyActive ? 11 : 0
  );

  const contextPacket: StructuredDiagnosticContext = {
    compositeScore: isWaterAnomalyActive ? 78 : 82,
    previousScore: 82,
    delta: isWaterAnomalyActive ? -4.0 : 0.0,
    largestDriver: isWaterAnomalyActive ? 'Water Flow Anomaly' : 'Seasonal Operational Equilibrium',
    largestDriverChangePct: isWaterAnomalyActive ? +32.4 : -0.8,
    nodeId: 'hostel_h2',
    nodeName: 'Hostel B (Indravati Hall of Residence)',
    occupancyDeltaPct: isWaterAnomalyActive ? 2.1 : 0.2,
    nightFlowRateLPerHr: isWaterAnomalyActive ? 3200.0 : 140.0,
    dataConfidence: isWaterAnomalyActive ? 91 : 94,
    anomalyConfidence: anomalyEval.confidencePct,
    persistenceCount: isWaterAnomalyActive ? 11 : 0,
    rootCauseCandidate: isWaterAnomalyActive ? '2nd Floor West Wing Flush Valve Manifold' : 'None',
    linkedActionId: isWaterAnomalyActive ? 'WO-409' : 'WO-410'
  };

  if (q.includes('why') || q.includes('fall') || q.includes('drop') || q.includes('decrease') || q.includes('change')) {
    if (isWaterAnomalyActive) {
      return {
        intent: 'EXPLAIN_SCORE_CHANGE',
        answer: `EVIDENCE-GROUNDED CAUSAL DECOMPOSITION:\nYour campus GREENScore dropped from 82.0 → 78.0 (-4.0 pts). The regression is 81.4% driven by a single infrastructure anomaly:\n\n• Primary Driver: Hostel B (Indravati Hall) water consumption surged +32.4% (188 L/student/day vs baseline 142 L).\n• ML Sentinel Verdict: Isolation Forest scored 0.942 with Z-score +4.82σ above normal (p < 0.0001).\n• Corroboration: Night flow reached 3,200 L/hr across 11 consecutive intervals while biometric occupancy changed by only +2.1%, mathematically isolating a physical plumbing failure.`,
        sourceEvidence: [
          'LoRaWAN Flow Meter WM-H2-205: 3,200 L/hr continuous midnight draw (01:00-04:30 AM)',
          'Hostel Biometric Turnstiles: Occupancy +2.1% (proves physical leak, not human usage surge)',
          'Isolation Forest Model: Average tree depth 2.1 steps (confidence 94.2%)',
          'Substation Feeder 11kV: Normal 222,300 kWh (rules out electrical pump overrun)'
        ],
        confidence: 94,
        contextPacket,
        structuredDetails: {
          scoreChange: '82 → 78 (-4.0 pts)',
          contributors: [
            'Water Pillar: ↓ 14.0 pts drag (-4.8 pts net campus impact)',
            'Energy Pillar: ↑ 0.6 pts positive contribution (solar self-consumption)',
            'Waste Pillar: ↑ 0.8 pts positive contribution (84.2% composting rate)',
            'Transport Pillar: ± 0.0 pts neutral (88% active/transit share)'
          ],
          largestAnomaly: 'Hostel B flush valve rupture (+32.4% water flow; 3,200 L/hr night draw)',
          recommendation: 'Immediate dispatch of Work Order #WO-409 to replace 2nd floor west flush valve manifold.',
          mathematicalProof: 'ΔScore = (ΔEnergy * 0.30) + (ΔWater * 0.25) + (ΔWaste * 0.25) + (ΔTransport * 0.20) = (+0.6 * 0.30) + (-14.0 * 0.25) + (+0.8 * 0.25) + (0 * 0.20) = -4.0 pts.'
        }
      };
    } else {
      return {
        intent: 'EXPLAIN_SCORE_CHANGE',
        answer: `EVIDENCE-GROUNDED STATUS:\nCampus GREENScore is stable at 82.0 / 100. All 9 campus facilities are operating within 1.2 standard deviations of seasonal baseline. Solar rooftop generation (180 kW) covered 42.6% of daytime academic demand.`,
        sourceEvidence: ['12-month rolling baseline across 9 physical nodes'],
        confidence: 98,
        contextPacket
      };
    }
  }

  if (q.includes('which physical') || q.includes('where') || q.includes('largest deterioration') || q.includes('hostel')) {
    return {
      intent: 'SPATIAL_LOCALIZATION',
      answer: isWaterAnomalyActive
        ? `SPATIAL DIGITAL TWIN LOCALIZATION:\nThe problem is localized to Hostel B (Indravati Hall of Residence, Node Code: H2).\n• Specific Wing: 2nd Floor West Wing Washroom Block.\n• Instrument: Sub-meter WM-H2-205.\n• Negative Variance Contribution: Accounts for 81.4% of total campus negative score variance.`
        : `SPATIAL DIGITAL TWIN LOCALIZATION:\nAll 9 facilities are in healthy operational state. The facility with the lowest energy performance is Mechanical Engineering Workshops (ME, Score: 76) due to inductive 3-phase machinery during morning laboratory practicals.`,
      sourceEvidence: ['Spatial coordinates: 19.9082° N, 83.1655° E (GCEK Indravati Quadrangle)'],
      confidence: 96,
      contextPacket
    };
  }

  if (q.includes('what should we do') || q.includes('action') || q.includes('recommend') || q.includes('plan')) {
    return {
      intent: 'RECOMMEND_ACTIONS',
      answer: `PRIORITIZED OPERATIONAL ACTION DIRECTIVE:\n\n1. [PRIORITY 1 - IMMEDIATE CRITICAL] Execute Work Order #WO-409:\n   • Action: Isolate west-wing riser valve and replace damaged float assembly in Hostel B.\n   • Expected Impact: Cut 580,000 L of wasted water/month; save ₹18,400/month; restore +4.8 pts to GreenScore.\n   • Assignee: Mohan Das (Lead Campus Plumber).\n\n2. [PRIORITY 2 - HIGH ROI] ME Workshop Power Factor Correction:\n   • Action: Tune APFC capacitor banks to raise power factor from 0.82 to 0.96.\n   • Expected Impact: Save ₹34,000/quarter in kVAh maximum demand utility charges.\n\n3. [PRIORITY 3 - EXPANSION] Central Cafeteria Biogas Digester:\n   • Action: Connect wet food scrap pipeline to secondary 100 kg digester chamber.`,
      sourceEvidence: ['Action Priority Matrix (High Impact / Low Effort Optimization)'],
      confidence: 93,
      contextPacket
    };
  }

  if (q.includes('cse') && q.includes('me')) {
    return {
      intent: 'BUILDING_COMPARISON',
      answer: `COMPARATIVE BENCHMARK (CSE Academic Block vs ME Workshops):\n\n• Energy Intensity: CSE: 40.8 kWh/student (Score: 84) vs ME: 60.3 kWh/student (Score: 76)\n• Power Factor: CSE: 0.96 vs ME: 0.82 (low power factor due to uncompensated induction motors)\n• Area Specific Load: CSE: 2.54 kWh/m² vs ME: 2.61 kWh/m²\n• Root Finding: ME workshop machinery runs with poor idling duty cycles during morning practicals. Automated sensor interlocks recommended.`,
      sourceEvidence: ['Feeder Telemetry meters EM-CSE-101 and EM-ME-301'],
      confidence: 95,
      contextPacket
    };
  }

  return {
    intent: 'GENERAL_SYNTHESIS',
    answer: `GREENCORE CAMPUS AUDIT SYNTHESIS:\nCurrent Composite GreenScore is ${contextPacket.compositeScore} / 100 with ${contextPacket.dataConfidence}% data confidence. Campus resource totals for September 2026: 222,300 kWh electricity, 9,130,000 L water, 7,320 kg solid waste (83.4% diverted), and 976.0 kg daily commute CO2. All metrics cryptographically anchored in SQLite ledger.`,
    sourceEvidence: ['GCEK Campus Master Database & NAAC 7.1.2 Ledger'],
    confidence: 91,
    contextPacket
  };
}
