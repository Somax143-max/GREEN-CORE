import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../greencore.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Real SHA-256 helper
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS campus_nodes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      type TEXT NOT NULL,
      area_sqm REAL NOT NULL,
      population INTEGER NOT NULL,
      floor_count INTEGER NOT NULL,
      energy_kwh REAL NOT NULL,
      water_litres REAL NOT NULL,
      waste_kg REAL NOT NULL,
      waste_diversion_rate REAL NOT NULL,
      transport_co2_kg REAL NOT NULL,
      health TEXT NOT NULL DEFAULT 'optimal',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS monthly_records (
      month TEXT PRIMARY KEY,
      energy_kwh REAL NOT NULL,
      water_litres REAL NOT NULL,
      waste_kg REAL NOT NULL,
      transport_co2_kg REAL NOT NULL,
      green_score REAL NOT NULL,
      energy_score REAL NOT NULL,
      water_score REAL NOT NULL,
      waste_score REAL NOT NULL,
      transport_score REAL NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS meters (
      id TEXT PRIMARY KEY,
      node_id TEXT NOT NULL,
      meter_type TEXT NOT NULL,
      meter_code TEXT NOT NULL,
      location TEXT NOT NULL,
      protocol TEXT NOT NULL,
      sampling_interval_min INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      last_reading REAL NOT NULL,
      last_timestamp TEXT NOT NULL,
      FOREIGN KEY(node_id) REFERENCES campus_nodes(id)
    );

    CREATE TABLE IF NOT EXISTS anomalies (
      id TEXT PRIMARY KEY,
      node_id TEXT NOT NULL,
      metric TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      detected_at TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL,
      anomaly_score REAL NOT NULL,
      deviation_pct REAL NOT NULL,
      night_flow_rate REAL,
      persistence_readings INTEGER NOT NULL,
      root_cause_wing TEXT,
      evidence_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS actions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL,
      impact TEXT NOT NULL,
      effort TEXT NOT NULL,
      urgency TEXT NOT NULL,
      status TEXT NOT NULL,
      assigned_to TEXT NOT NULL,
      due_date TEXT NOT NULL,
      node_id TEXT NOT NULL,
      linked_anomaly_id TEXT,
      expected_impact TEXT NOT NULL,
      before_value REAL,
      after_value REAL,
      verified_at TEXT,
      verified_by TEXT,
      outcome_notes TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_ledger (
      block_height INTEGER PRIMARY KEY AUTOINCREMENT,
      previous_hash TEXT NOT NULL,
      block_hash TEXT NOT NULL,
      record_type TEXT NOT NULL,
      record_id TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      author TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campus_memory (
      id TEXT PRIMARY KEY,
      event_date TEXT NOT NULL,
      month_year TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      impact_summary TEXT NOT NULL,
      evidence_id TEXT NOT NULL,
      metric_change TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS commute_survey (
      id TEXT PRIMARY KEY,
      year INTEGER NOT NULL,
      month TEXT NOT NULL,
      total_respondents INTEGER NOT NULL,
      walking_pct REAL NOT NULL,
      cycling_pct REAL NOT NULL,
      bus_pct REAL NOT NULL,
      two_wheeler_pct REAL NOT NULL,
      car_pct REAL NOT NULL,
      avg_commute_km REAL NOT NULL,
      co2_per_capita_kg REAL NOT NULL
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  const nodeCount = db.prepare('SELECT count(*) as count FROM campus_nodes').get() as { count: number };
  if (nodeCount.count > 0) {
    return; // Already seeded
  }

  // 1. Seed Campus Nodes
  const insertNode = db.prepare(`
    INSERT INTO campus_nodes (id, name, code, type, area_sqm, population, floor_count, energy_kwh, water_litres, waste_kg, waste_diversion_rate, transport_co2_kg, health, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const nodes = [
    ['cse_block', 'Computer Science & Engineering Block', 'CSE', 'academic', 7200, 840, 4, 38400, 680000, 780, 84, 185.0, 'optimal', new Date().toISOString()],
    ['ece_block', 'Electronics & Comm. Engineering Block', 'ECE', 'academic', 6800, 720, 4, 32100, 590000, 640, 82, 160.0, 'optimal', new Date().toISOString()],
    ['me_block', 'Mechanical Eng. & Central Workshops', 'ME', 'academic', 8900, 610, 2, 44800, 520000, 1120, 76, 210.0, 'warning', new Date().toISOString()],
    ['hostel_h1', 'Mahanadi Hall of Residence (Hostel A)', 'H1', 'hostel', 9400, 460, 4, 21600, 1840000, 920, 79, 45.0, 'optimal', new Date().toISOString()],
    ['hostel_h2', 'Indravati Hall of Residence (Hostel B)', 'H2', 'hostel', 9400, 480, 4, 22100, 2460000, 960, 78, 48.0, 'warning', new Date().toISOString()],
    ['hostel_h3', 'Tel Hall of Residence (Hostel C)', 'H3', 'hostel', 7800, 390, 3, 18400, 1510000, 780, 81, 38.0, 'optimal', new Date().toISOString()],
    ['central_library', 'Biju Patnaik Central Library', 'LIB', 'facility', 4500, 410, 3, 14200, 280000, 290, 90, 75.0, 'optimal', new Date().toISOString()],
    ['central_cafeteria', 'Central Dining & Activity Centre', 'SAC', 'facility', 3200, 1200, 2, 18900, 940000, 1450, 78, 120.0, 'optimal', new Date().toISOString()],
    ['admin_block', 'Administrative Complex & Senate', 'ADMIN', 'facility', 3800, 180, 3, 11800, 310000, 380, 85, 95.0, 'optimal', new Date().toISOString()]
  ];

  for (const n of nodes) {
    insertNode.run(...n);
  }

  // 2. Seed 12 Months of Historical Records (Oct 2025 - Sep 2026) for Real MoM & YoY Calculations
  const insertMonthly = db.prepare(`
    INSERT INTO monthly_records (month, energy_kwh, water_litres, waste_kg, transport_co2_kg, green_score, energy_score, water_score, waste_score, transport_score, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const months = [
    ['2025-10', 234000, 8950000, 7120, 984.0, 74.2, 73.1, 74.5, 75.2, 74.0, 'Post-monsoon regular semester operations'],
    ['2025-11', 228000, 8740000, 7050, 962.0, 75.1, 74.2, 75.3, 76.0, 74.5, 'Winter mid-semester examination period'],
    ['2025-12', 178000, 5210000, 4800, 620.0, 81.4, 82.5, 83.2, 79.0, 80.5, 'Winter break recess (reduced occupancy)'],
    ['2026-01', 222000, 8620000, 6950, 950.0, 76.0, 75.8, 76.2, 77.1, 74.8, 'Even semester commencement'],
    ['2026-02', 218000, 8430000, 6800, 935.0, 76.8, 77.0, 77.1, 78.4, 75.0, 'Phase 1 LED retrofit in Central Library'],
    ['2026-03', 229000, 8820000, 7150, 970.0, 76.4, 76.2, 76.0, 78.6, 75.0, 'Annual Techno-Cultural Fest'],
    ['2026-04', 242000, 9150000, 7320, 995.0, 75.2, 74.0, 74.8, 78.0, 74.5, 'Summer temperature rise; peak AC and cooler load'],
    ['2026-05', 189000, 5600000, 4950, 640.0, 80.6, 81.2, 82.0, 79.5, 80.0, 'End-semester exams & summer transition'],
    ['2026-06', 152000, 4350000, 3900, 510.0, 83.5, 85.0, 86.4, 80.2, 82.0, 'Summer vacation recess; maintenance shut-down'],
    ['2026-07', 224000, 8720000, 7100, 960.0, 77.5, 77.2, 77.0, 80.5, 75.5, 'Monsoon semester registration & freshers arrival'],
    ['2026-08', 226000, 8840000, 7250, 975.0, 78.1, 78.0, 77.8, 81.2, 75.5, 'Composting program expanded to all 3 hostels'],
    ['2026-09', 222300, 9130000, 7320, 976.0, 78.4, 78.6, 74.8, 83.4, 76.2, 'Current audit period with active water anomaly']
  ];

  for (const m of months) {
    insertMonthly.run(...m);
  }

  // 3. Seed Meters
  const insertMeter = db.prepare(`
    INSERT INTO meters (id, node_id, meter_type, meter_code, location, protocol, sampling_interval_min, status, last_reading, last_timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const meters = [
    ['EM-CSE-101', 'cse_block', 'energy', 'EM-CSE-MAIN', 'Ground Floor Main Switchboard', 'MODBUS-TCP', 15, 'ACTIVE', 38400.0, new Date().toISOString()],
    ['WM-CSE-102', 'cse_block', 'water', 'WM-CSE-FLOW', 'Inlet Header Manifold', 'LORAWAN', 15, 'ACTIVE', 680000.0, new Date().toISOString()],
    ['EM-H2-201', 'hostel_h2', 'energy', 'EM-H2-MAIN', 'Hostel B Electrical Room', 'MODBUS-TCP', 15, 'ACTIVE', 22100.0, new Date().toISOString()],
    ['WM-H2-205', 'hostel_h2', 'water', 'WM-H2-SUB', 'Hostel B Overhead Supply Riser', 'LORAWAN', 15, 'ALERT', 2460000.0, new Date().toISOString()],
    ['EM-LIB-301', 'central_library', 'energy', 'EM-LIB-MAIN', 'Library Basement Panel', 'MODBUS-TCP', 15, 'ACTIVE', 14200.0, new Date().toISOString()],
    ['SM-SAC-401', 'central_cafeteria', 'waste', 'SM-SAC-SCALE', 'Cafeteria Kitchen Waste Area', 'MANUAL-SYNC', 60, 'ACTIVE', 1450.0, new Date().toISOString()]
  ];

  for (const meter of meters) {
    insertMeter.run(...meter);
  }

  // 4. Seed Real Anomaly (Hostel B Water Rupture)
  const insertAnomaly = db.prepare(`
    INSERT INTO anomalies (id, node_id, metric, title, description, detected_at, severity, status, anomaly_score, deviation_pct, night_flow_rate, persistence_readings, root_cause_wing, evidence_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const anomalyEvidence = JSON.stringify({
    expectedFlowRateLPerStudentDay: 142.0,
    observedFlowRateLPerStudentDay: 188.0,
    deviationPct: 32.4,
    nightBaselineFlowLPerHr: 140.0,
    nightObservedFlowLPerHr: 3200.0,
    occupancyDeltaPct: 2.1,
    persistenceIntervals: 11,
    statisticalZScore: 4.82,
    isolationForestTreeDepth: 2.1,
    anomalyProbability: 0.942,
    meterId: 'WM-H2-205',
    subWing: '2nd Floor West Wing Flush Valve Manifold'
  });

  insertAnomaly.run(
    'ANOM-H2-WTR-2026',
    'hostel_h2',
    'water_litres',
    'Sustained Night-Flow Leak in Hostel B (Indravati)',
    'Ultrasonic flow meter WM-H2-205 logged persistent off-hours water consumption of 3,200 L/hr between 01:00 AM - 04:30 AM. Cross-referenced with hostel biometric logs (occupancy +2.1%), confirming physical plumbing failure.',
    '2026-09-27T03:15:00.000Z',
    'critical',
    'active',
    0.942,
    32.4,
    3200.0,
    11,
    '2nd Floor West Wing Flush Valve Manifold',
    anomalyEvidence
  );

  // 5. Seed Actions & Operational Work Orders
  const insertAction = db.prepare(`
    INSERT INTO actions (id, title, description, category, priority, impact, effort, urgency, status, assigned_to, due_date, node_id, linked_anomaly_id, expected_impact, before_value, after_value, verified_at, verified_by, outcome_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAction.run(
    'WO-409',
    'Emergency Flush Valve Replacement in Hostel B',
    'Dispatch plumbing maintenance team to isolate and replace sheared float valve manifold in 2nd floor west washroom block.',
    'water',
    'P1',
    'HIGH',
    'LOW',
    'CRITICAL',
    'DISPATCHED',
    'Mohan Das (Campus Plumber Lead)',
    '2026-09-28',
    'hostel_h2',
    'ANOM-H2-WTR-2026',
    'Expected water consumption reduction: ~20-25% (~580,000 L/month saved; ₹18,400/mo)',
    188.0,
    null,
    null,
    null,
    null
  );

  insertAction.run(
    'WO-410',
    'CSE Server Room HVAC Temperature Setpoint Optimization',
    'Reconfigure precision air conditioning setpoint from 19°C to 24°C in accordance with BEE Data Center energy guidelines.',
    'energy',
    'P2',
    'MEDIUM',
    'LOW',
    'MEDIUM',
    'COMPLETED',
    'Er. Rajesh Patra (Electrical Maintenance)',
    '2026-09-25',
    'cse_block',
    null,
    'Expected 4.2% reduction in CSE base energy consumption (~1,600 kWh/mo saved)',
    38400.0,
    36800.0,
    '2026-09-26T14:30:00.000Z',
    'Dr. S. K. Mahapatra (Energy Auditor)',
    'Verified via 48-hour Modbus EM-CSE-101 telemetry: 4.16% real drop confirmed.'
  );

  // 6. Seed Cryptographic Merkle / Chained Audit Ledger with REAL SHA-256
  const insertLedger = db.prepare(`
    INSERT INTO audit_ledger (previous_hash, block_hash, record_type, record_id, payload_json, timestamp, author)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000'; // Genesis

  const ledgerSeed = [
    { type: 'GENESIS', id: 'GEN-0001', payload: { event: 'GreenCore Audit Chain Genesis', college: 'GCEK Kalahandi', standard: 'NAAC 7.1.2' }, author: 'SYSTEM_ROOT' },
    { type: 'BASELINE_SET', id: 'BASE-2025', payload: { energy_kwh_capita: 42.0, water_l_capita_day: 45.0, waste_kg_capita: 1.8 }, author: 'Dr. S. K. Mahapatra' },
    { type: 'METER_REGISTRATION', id: 'EM-CSE-101', payload: { meter: 'EM-CSE-101', type: 'energy', protocol: 'MODBUS-TCP' }, author: 'Er. Rajesh Patra' },
    { type: 'METER_REGISTRATION', id: 'WM-H2-205', payload: { meter: 'WM-H2-205', type: 'water', protocol: 'LORAWAN' }, author: 'Er. Rajesh Patra' },
    { type: 'ANOMALY_TRIGGERED', id: 'ANOM-H2-WTR-2026', payload: { node: 'hostel_h2', surge_pct: 32.4, flow: 3200 }, author: 'AI_SENTINEL_ENGINE' },
    { type: 'WORK_ORDER_DISPATCH', id: 'WO-409', payload: { assignee: 'Mohan Das', target: '2nd Floor Valve' }, author: 'CAMPUS_ACTION_ENGINE' },
  ];

  for (const item of ledgerSeed) {
    const payloadStr = JSON.stringify(item.payload);
    const timestamp = new Date().toISOString();
    const blockContent = `${prevHash}|${item.type}|${item.id}|${payloadStr}|${timestamp}|${item.author}`;
    const blockHash = sha256(blockContent);
    insertLedger.run(prevHash, blockHash, item.type, item.id, payloadStr, timestamp, item.author);
    prevHash = blockHash;
  }

  // 7. Seed Signature Feature: 🌱 GREENCORE "CAMPUS MEMORY"
  const insertMemory = db.prepare(`
    INSERT INTO campus_memory (id, event_date, month_year, title, category, description, impact_summary, evidence_id, metric_change)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const memoryEvents = [
    ['MEM-01', '2026-01-15', 'JAN 2026', 'Campus Sustainability Baseline Established', 'baseline', 'Comprehensive multi-vector audit conducted across 9 buildings to establish IGBC/BEE benchmarks.', 'Baseline score fixed at 76.0/100 across 3,730 occupants.', 'EV-BASE-2026', 'Baseline: 76.0'],
    ['MEM-02', '2026-03-10', 'MAR 2026', '100% LED Retrofit Completed in Library & CSE', 'energy', 'Replaced 480 fluorescent tubes with 18W high-efficacy LED fittings and occupancy PIR sensors.', 'Annual energy reduction of 18,400 kWh (saved ₹1,51,000/yr).', 'EV-LED-2026', 'Energy +4.2 pts'],
    ['MEM-03', '2026-05-20', 'MAY 2026', 'Hostel Composting & Kitchen Bio-Digester Commissioned', 'waste', 'Installed 250 kg/day anaerobic bio-methanation unit in Central Dining complex for organic wet waste.', 'Waste diversion increased from 61% to 78%; 14 m³ biogas/day generated.', 'EV-BIO-2026', 'Waste +6.8 pts'],
    ['MEM-04', '2026-07-08', 'JUL 2026', 'Bicycle Sharing Racks & EV Charging Station', 'transport', 'Deployed 40 GPS-enabled campus bicycles and 2 dual-gun AC Level 2 electric vehicle chargers.', 'Cut private motorized commute by 8.4%; avoided 3.2 tCO₂/month.', 'EV-MOB-2026', 'Transport +2.5 pts'],
    ['MEM-05', '2026-09-27', 'SEP 2026', 'Hostel B Pipe Rupture Detected by ML Sentinel', 'water', 'At 03:15 AM, LoRaWAN flow meter WM-H2-205 recorded a 32.4% midnight surge (3,200 L/hr).', 'Instant anomaly alert triggered, isolating leak to 2nd Floor West Wing flush manifold.', 'EV-ANOM-2026', 'Water -4.8 pts'],
    ['MEM-06', '2026-09-27', 'SEP 2026', 'Work Order WO-409 Dispatched & Valve Replaced', 'action', 'Campus maintenance replaced sheared valve within 90 minutes of autonomous system dispatch.', 'Overnight flow normalized back to 140 L/hr. Outcome verified via 60-min telemetry.', 'EV-WO-409', 'Water +5.1 pts restored']
  ];

  for (const ev of memoryEvents) {
    insertMemory.run(...ev);
  }

  // 8. Seed Commute Survey Data
  const insertSurvey = db.prepare(`
    INSERT INTO commute_survey (id, year, month, total_respondents, walking_pct, cycling_pct, bus_pct, two_wheeler_pct, car_pct, avg_commute_km, co2_per_capita_kg)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertSurvey.run(
    'SRV-2026-SEP',
    2026,
    '2026-09',
    1842,
    48.0, // Walking %
    26.0, // Cycling %
    14.0, // Public Bus %
    8.0,  // Two Wheeler %
    4.0,  // Car %
    4.2,  // Avg km
    0.1102 // kg CO2 / capita / day
  );
}
