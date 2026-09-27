// GreenCore AI Domain Types for Backend REST API

export type CampusMode = 'manual' | 'hybrid' | 'iot';
export type NodeType = 'academic' | 'hostel' | 'facility';

export interface CampusNode {
  id: string;
  name: string;
  code: string;
  type: NodeType;
  population: number;
  areaSqM: number;
  buildingType: string;
  meterIds: {
    energy?: string;
    water?: string;
    waste?: string;
  };
  coordinates: { x: number; y: number };
  status: 'optimal' | 'warning' | 'critical';
  greenScore: number;
  previousGreenScore: number;
  metrics: {
    energyKWh: number;
    energyPerStudent: number;
    energyPerSqM: number;
    waterLitres: number;
    waterPerStudentPerDay: number;
    wasteKg: number;
    wasteDiversionRate: number;
    transportCarbonTons: number;
  };
}

export interface MonthlyReading {
  month: string;
  year: number;
  date: string;
  energyKWh: number;
  solarKWh: number;
  waterLitres: number;
  totalWasteKg: number;
  recycledWasteKg: number;
  compostedWasteKg: number;
  landfillWasteKg: number;
  greenScore: number;
  carbonTonsCO2e: number;
}

export interface AnomalyAlert {
  id: string;
  nodeId: string;
  nodeName: string;
  category: 'energy' | 'water' | 'waste' | 'transport';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: string;
  baselineValue: number;
  actualValue: number;
  deviationPercent: number;
  unit: string;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  resolved: boolean;
  fingerprint: ChangeFingerprint;
  recommendations: Recommendation[];
}

export interface ChangeFingerprint {
  primaryMetricDelta: number;
  occupancyDelta: number;
  energyDelta: number;
  wasteDelta: number;
  weatherCondition: string;
  durationDays: number;
  findingSummary: string;
  isAbnormalPattern: boolean;
}

export interface Recommendation {
  id: string;
  priority: 'P1' | 'P2' | 'P3';
  action: string;
  category: 'energy' | 'water' | 'waste' | 'transport';
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  estimatedSavingsINR: number;
  estimatedCO2ReductionKg: number;
  evidence: string;
  expectedOutcome: string;
}

export interface ActionSimulationOption {
  id: string;
  name: string;
  description: string;
  category: 'energy' | 'water' | 'waste' | 'transport' | 'composite';
  capitalCostINR: number;
  annualSavingsINR: number;
  paybackMonths: number;
  co2ReductionTonsPerYear: number;
  energyImprovementDelta: number;
  waterImprovementDelta: number;
  wasteImprovementDelta: number;
  transportImprovementDelta: number;
  overallScoreDelta: number;
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  selected?: boolean;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  nodeId: string;
  nodeName: string;
  metricType: string;
  previousValue: string;
  newValue: string;
  reason: string;
  source: 'Smart Meter API' | 'Manual Log' | 'Student Survey' | 'Correction';
  verificationStatus: 'Verified' | 'Pending Review' | 'Flagged';
  checksum: string;
}

export interface EvidenceMetricItem {
  metricId: string;
  name: string;
  category: 'energy' | 'water' | 'waste' | 'transport';
  value: string;
  source: string;
  period: string;
  collectionMethod: string;
  validationStatus: string;
  transformation: string;
  usedIn: string[];
  confidence: number;
}

export interface GreenMission {
  id: string;
  title: string;
  badge: string;
  description: string;
  category: 'energy' | 'water' | 'waste' | 'transport';
  targetGoal: string;
  progressPercent: number;
  daysRemaining: number;
  participantsCount: number;
  pointsReward: number;
  status: 'active' | 'completed';
}

export interface LeaderboardEntry {
  rank: number;
  nodeId: string;
  name: string;
  code: string;
  type: NodeType;
  rawScore: number;
  normalizedImprovement: number;
  energyScore: number;
  waterScore: number;
  wasteScore: number;
  transportScore: number;
  badge: string;
  trend: 'up' | 'down' | 'same';
}

export interface MethodologyConfig {
  version: string;
  effectiveDate: string;
  weights: {
    energy: number;
    water: number;
    waste: number;
    transport: number;
  };
  carbonFactors: {
    gridElectricityKgCO2PerKWh: number;
    dieselGenKgCO2PerLitre: number;
    waterPumpingKgCO2PerKL: number;
    landfillWasteKgCO2PerKg: number;
    twowheelerPetrolKgCO2PerKm: number;
    carPetrolKgCO2PerKm: number;
    transitBusKgCO2PerPassengerKm: number;
  };
}
