// AI Diagnostic Engine for GreenCore Backend: Structured Findings & 5 Questions

export interface AIQueryResponse {
  answer: string;
  sourceEvidence: string[];
  confidence: number;
  structuredDetails?: {
    scoreChange?: string;
    contributors?: string[];
    largestAnomaly?: string;
    recommendation?: string;
  };
}

export function processAIQuery(query: string, isWaterAnomalyActive: boolean): AIQueryResponse {
  const q = query.toLowerCase();

  if (q.includes('why') || q.includes('fall') || q.includes('drop') || q.includes('decrease')) {
    if (isWaterAnomalyActive) {
      return {
        answer: 'GREENCORE MULTI-FACTOR ANALYSIS:\nYour campus GreenScore decreased from 82 → 78 (-4.0 points). Here is the audited causal decomposition:\n1. Water score drag: ↓ 12.0 points (Hostel B surge)\n2. Waste performance: ↑ 4.0 points improvement (84.2% diversion)\n3. Energy efficiency: ↑ 1.2 points improvement (solar offset)',
        sourceEvidence: [
          'Ultrasonic flow meter #WM-H2-205 recorded continuous 3,200 L/hr night draw.',
          'Substation 11kV incomer telemetry showed 245,100 kWh (stable).',
          'Cafeteria weighbridge logged 4,910 kg waste (84.2% diverted).'
        ],
        confidence: 94,
        structuredDetails: {
          scoreChange: '82 → 78 (-4.0 pts)',
          contributors: [
            '1. Water score drag: ↓ 12.0 points (Hostel B surge)',
            '2. Waste performance: ↑ 4.0 points improvement (84.2% diversion)',
            '3. Energy efficiency: ↑ 1.2 points improvement (solar offset)'
          ],
          largestAnomaly: 'Hostel B (Indravati Hall) water consumption surged +32.4% (188 L/student/day vs baseline 142 L).',
          recommendation: 'Priority 1 Directive: Inspect Hostel B ground sump feeder and overhead float valve. Night telemetry indicates 3,200 L/hr continuous flow.'
        }
      };
    } else {
      return {
        answer: 'GREENCORE DIAGNOSTIC SUMMARY:\nCampus GreenScore is currently stable at 82 / 100 (+2.5% vs baseline). Energy cooling loads are within seasonal norms, and waste diversion rate reached 84.2% following the cafeteria aerobic composting initiative.',
        sourceEvidence: ['12-month rolling baseline across 9 facilities'],
        confidence: 98
      };
    }
  }

  if (q.includes('which physical') || q.includes('largest deterioration') || q.includes('part') || q.includes('hostel')) {
    return {
      answer: isWaterAnomalyActive
        ? 'SPATIAL DIGITAL TWIN LOCALIZATION:\nHostel B (Indravati Hall of Residence, Code: Hostel B) is responsible for 81.4% of total campus negative score variance. While academic blocks (CSE, ECE) remain optimal, Hostel B water usage has increased to 188 L/capita/day.'
        : 'SPATIAL DIGITAL TWIN LOCALIZATION:\nAll 9 campus nodes are operating within normal baseline limits. The lowest relative efficiency score is currently Mechanical Eng. Workshops (ME) at 76 due to heavy three-phase motor loads.',
      sourceEvidence: ['Physical node coordinates & sub-meter registers #WM-H2-205, #EM-ME-103'],
      confidence: 96
    };
  }

  if (q.includes('what should we do') || q.includes('action') || q.includes('recommend')) {
    return {
      answer: 'GREENCORE ACTION RECOMMENDATIONS:\n1. [P1 High Impact / Low Effort] Dispatch maintenance plumber to Hostel B to repair overhead tank float valve.\n2. [P2 High Impact / Low Effort] Execute 500-tube LED replacement in ME Workshops for ₹2,86,000 annual electricity savings.\n3. [P3 Medium Impact] Expand Cafeteria food waste aerobic composter capacity by 200 kg/day.',
      sourceEvidence: ['2x2 Action Priority Matrix & BEE Industrial Benchmarks'],
      confidence: 92
    };
  }

  if (q.includes('cse') && q.includes('me')) {
    return {
      answer: 'COMPARATIVE BENCHMARK (CSE vs ME):\n• CSE Block: 40.77 kWh / student • 2.54 kWh/m² • GreenScore: 84\n• ME Workshops: 60.31 kWh / student • 2.61 kWh/m² • GreenScore: 76\nFinding: ME workshop machine motors run during off-peak lab hours with low power factor (0.82 vs 0.96 in CSE). APFC capacitor bank tuning recommended.',
      sourceEvidence: ['Smart Energy Meters #EM-CSE-101 and #EM-ME-103 telemetry'],
      confidence: 95
    };
  }

  return {
    answer: `GREENCORE SYNTHESIS for "${query}":\nAudited campus telemetry indicates 245,100 kWh electricity, 7,464,000 L water, 4,910 kg waste (84.2% circular), and 184.2 tCO2e carbon footprint. Verified against Methodology v1.2 with 91% data confidence.`,
    sourceEvidence: ['Institutional master ledger (GCE Kalahandi)'],
    confidence: 91
  };
}
