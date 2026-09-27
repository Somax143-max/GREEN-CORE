// Types for GREENCORE — Campus Sustainability Digital Twin & Action Engine

export type CampusMode = 'manual' | 'hybrid' | 'iot';

export type NodeType = 'academic' | 'hostel' | 'facility';

export interface CampusNode {
  id: string;
  name: string;
  code: string;
  type: NodeType;
  population: number; // Students / staff / residents
  areaSqM: number;
  buildingType: string;
  meterIds: {
    energy?: string;
    water?: string;
    waste?: string;
  };
  coordinates: { x: number; y: number }; // For 2D/3D campus twin visualization
  status: 'optimal' | 'warning' | 'critical';
  greenScore: number;
  previousGreenScore: number;
  metrics: {
    energyKWh: number;
    energyPerStudent: number; // kWh/person
    energyPerSqM: number; // kWh/m²
    waterLitres: number;
    waterPerStudentPerDay: number; // L/person/day
    wasteKg: number;
    wasteDiversionRate: number; // %
    transportCarbonTons: number;
  };
}

export interface MonthlyReading {
  month: string; // "Jan", "Feb", ...
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

export interface NodeMonthlyData {
  nodeId: string;
  month: string;
  energyKWh: number;
  waterLitres: number;
  wasteKg: number;
  occupancy: number;
  notes?: string;
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
  confidenceScore: number; // 0 - 100
  resolved: boolean;
  fingerprint: ChangeFingerprint;
  recommendations: Recommendation[];
}

export interface ChangeFingerprint {
  primaryMetricDelta: number; // e.g. +31.7%
  occupancyDelta: number; // e.g. +2.1%
  energyDelta: number; // e.g. +3.4%
  wasteDelta: number; // e.g. +4.0%
  weatherCondition: string; // "Normal, 28°C"
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
  energyImprovementDelta: number; // Points on score
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
  normalizedImprovement: number; // % improvement over baseline
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
    energy: number; // 0.30
    water: number; // 0.25
    waste: number; // 0.25
    transport: number; // 0.20
  };
  carbonFactors: {
    gridElectricityKgCO2PerKWh: number; // 0.716 (CEA India)
    dieselGenKgCO2PerLitre: number; // 2.68
    waterPumpingKgCO2PerKL: number; // 0.42
    landfillWasteKgCO2PerKg: number; // 1.25
    twowheelerPetrolKgCO2PerKm: number; // 0.045
    carPetrolKgCO2PerKm: number; // 0.14
    transitBusKgCO2PerPassengerKm: number; // 0.03
  };
}
