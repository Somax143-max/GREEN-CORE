import { MethodologyConfig, CampusNode, CampusMode } from '../types';

export interface ScoreBreakdown {
  compositeScore: number;
  previousScore: number;
  delta: number;
  energyScore: number;
  waterScore: number;
  wasteScore: number;
  transportScore: number;
  dataConfidence: number; // 0 - 100%
  categoryConfidence: {
    energy: number;
    water: number;
    waste: number;
    transport: number;
  };
  provenanceSource: {
    energy: string;
    water: string;
    waste: string;
    transport: string;
  };
  explanation: {
    mainDrag: string;
    mainImprovement: string;
    summary: string;
  };
}

export function calculateCampusScores(
  nodes: CampusNode[], 
  config: MethodologyConfig,
  waterAnomalyActive: boolean = false,
  mode: CampusMode = 'hybrid'
): ScoreBreakdown {
  // Aggregate campus values
  const totalPopulation = nodes.reduce((sum, n) => sum + n.population, 0);
  const totalArea = nodes.reduce((sum, n) => sum + n.areaSqM, 0);

  const totalEnergy = nodes.reduce((sum, n) => sum + n.metrics.energyKWh, 0);
  const totalWater = nodes.reduce((sum, n) => sum + n.metrics.waterLitres, 0);
  const totalWaste = nodes.reduce((sum, n) => sum + n.metrics.wasteKg, 0);
  
  // Normalized indicators
  const kwhPerCapita = totalEnergy / totalPopulation; // ~47.1 kWh
  const avgWaterLPerCapitaDay = (totalWater / 30) / totalPopulation; // ~47.8 L/capita/day overall

  // Benchmark baselines for educational campuses (IGBC / BEE Green Campus norms)
  const BENCHMARK_ENERGY_KWH_CAPITA = 42.0; // Target standard
  const BENCHMARK_WATER_L_CAPITA_DAY = 45.0; // Target standard
  
  // 1. Energy Score (0-100)
  const energyRatio = BENCHMARK_ENERGY_KWH_CAPITA / Math.max(kwhPerCapita, 20);
  const energyScore = Math.min(100, Math.max(40, Math.round(75 + (energyRatio - 1) * 60)));

  // 2. Water Score (0-100)
  const waterRatio = BENCHMARK_WATER_L_CAPITA_DAY / Math.max(avgWaterLPerCapitaDay, 25);
  let waterScore = Math.min(100, Math.max(30, Math.round(78 + (waterRatio - 1) * 75)));
  if (waterAnomalyActive) {
    waterScore = Math.max(45, waterScore - 12);
  }

  // 3. Waste Score (0-100)
  const avgDiversionRate = nodes.reduce((sum, n) => sum + n.metrics.wasteDiversionRate * n.metrics.wasteKg, 0) / Math.max(totalWaste, 1);
  const wasteScore = Math.min(100, Math.max(40, Math.round(avgDiversionRate * 0.95 + 10))); // ~84

  // 4. Transport Score (0-100)
  const transportScore = 69;

  // Weighted composite score
  const compositeScore = Math.round(
    energyScore * config.weights.energy +
    waterScore * config.weights.water +
    wasteScore * config.weights.waste +
    transportScore * config.weights.transport
  );

  const previousScore = waterAnomalyActive ? 82 : 80;
  const delta = +(compositeScore - previousScore).toFixed(1);

  // Mode-dependent Provenance & Data Confidence Calculations
  // College A (100% Manual): Paper logbooks, hand entries -> ~65% confidence
  // College B (Hybrid): Smart meters for major feeders + manual survey/waste -> ~91% confidence
  // College C (Full IoT): Edge Gateways, ultrasonic flow telemetry, smart optical bins -> ~98% confidence
  let categoryConfidence = {
    energy: 98,
    water: waterAnomalyActive ? 84 : 92,
    waste: 89,
    transport: 71,
  };

  let provenanceSource = {
    energy: '11kV Feeder Gateway + Delta Solar Telemetry',
    water: 'Zone Ultrasonic Flow Meters (LoRaWAN)',
    waste: 'Cafeteria Weighbridge Scale Registers',
    transport: 'Annual Student Mobility Survey (1,842 responses)'
  };

  if (mode === 'manual') {
    categoryConfidence = {
      energy: 65,
      water: waterAnomalyActive ? 58 : 62,
      waste: 70,
      transport: 54,
    };
    provenanceSource = {
      energy: 'Physical Meter Dial Registers (Signed Monthly)',
      water: 'Sub-meter Hand Logbook (Manual Inspection)',
      waste: 'Eco Club Hand Register Sheets',
      transport: 'Paper Commute Survey Sample (420 responses)'
    };
  } else if (mode === 'iot') {
    categoryConfidence = {
      energy: 99,
      water: waterAnomalyActive ? 94 : 99,
      waste: 96,
      transport: 94,
    };
    provenanceSource = {
      energy: 'Autonomous Modbus TCP RTU Telemetry Mesh',
      water: 'High-frequency Ultrasonic IoT Flow Sensors',
      waste: 'Smart Optical Ultrasonic Fill-Level Bins',
      transport: 'Campus RFID Biometric Gate Vehicle Scanners'
    };
  }

  const dataConfidence = Math.round(
    categoryConfidence.energy * config.weights.energy +
    categoryConfidence.water * config.weights.water +
    categoryConfidence.waste * config.weights.waste +
    categoryConfidence.transport * config.weights.transport
  );

  // Dynamic explanation
  let mainDrag = 'Mobility (private petrol two-wheelers)';
  let mainImprovement = 'Waste Segregation (84% diversion rate)';
  let summary = `[College Mode: ${mode.toUpperCase()}] Sustainability performance verified with ${dataConfidence}% data confidence.`;

  if (mode === 'manual') {
    summary = `[College A: 100% Manual Mode] Zero IoT hardware required. All data captured via digital forms & photo registers with 20% spot-check validation.`;
  } else if (mode === 'iot') {
    summary = `[College C: Autonomous IoT Mode] Real-time sensor synchronization across 9 physical nodes with continuous anomaly sentinel active.`;
  }

  if (waterAnomalyActive) {
    mainDrag = 'Water Consumption (Hostel B surge: +32.4%)';
    summary = 'Campus GreenScore dropped from 82 to 78 primarily due to an unexplained water surge in Hostel B (Indravati Hall).';
  }

  return {
    compositeScore,
    previousScore,
    delta,
    energyScore,
    waterScore,
    wasteScore,
    transportScore,
    dataConfidence,
    categoryConfidence,
    provenanceSource,
    explanation: {
      mainDrag,
      mainImprovement,
      summary
    }
  };
}
