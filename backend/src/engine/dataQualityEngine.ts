// Anti-Gaming and Data Quality Validation Engine for Backend

export interface ValidationResult {
  isValid: boolean;
  status: 'Verified' | 'Pending Review' | 'Flagged';
  scoreImpactAllowed: boolean;
  flags: string[];
  suggestedAction: string;
}

export interface NewEntryPayload {
  nodeId: string;
  category: 'energy' | 'water' | 'waste' | 'transport';
  value: number;
  unit: string;
  meterId?: string;
  source: 'Smart Meter API' | 'Manual Log' | 'Student Survey' | 'Correction';
  previousBaseline: number;
}

export function validateSustainabilitySubmission(entry: NewEntryPayload): ValidationResult {
  const flags: string[] = [];
  let status: 'Verified' | 'Pending Review' | 'Flagged' = 'Verified';
  let scoreImpactAllowed = true;
  let suggestedAction = 'Record accepted and synchronized to campus ledger.';

  // 1. Impossible / negative bounds
  if (entry.value <= 0) {
    flags.push('Negative or zero reading reported. Physical impossibility.');
    status = 'Flagged';
    scoreImpactAllowed = false;
    suggestedAction = 'Reject submission. Check meter register for inverted current transformers or data entry typo.';
    return { isValid: false, status, scoreImpactAllowed, flags, suggestedAction };
  }

  // 2. Anti-Gaming: Artificially deflated readings
  if (entry.category === 'energy' && entry.value < 100) {
    flags.push('Suspiciously low energy reading (<100 kWh) for a campus facility. Possible anti-gaming attempt.');
    status = 'Flagged';
    scoreImpactAllowed = false;
    suggestedAction = 'Marked as Unverified. Require facility manager co-signature and photo proof of meter dial.';
  }

  if (entry.category === 'water' && entry.value < 1000) {
    flags.push('Unusually low water usage (<1,000 L) for block. Potential missing sub-meter data.');
    status = 'Pending Review';
    scoreImpactAllowed = false;
    suggestedAction = 'Place in quarantine buffer. Dispatch eco-representative to verify water meter reading.';
  }

  // 3. Continuity check: Extreme sudden jump
  if (entry.previousBaseline > 0) {
    const deviationPercent = ((entry.value - entry.previousBaseline) / entry.previousBaseline) * 100;
    
    if (deviationPercent < -75) {
      flags.push(`Drastic unverified consumption collapse (${deviationPercent.toFixed(1)}%). Possible bypass or faulty logger.`);
      status = 'Flagged';
      scoreImpactAllowed = false;
      suggestedAction = 'Audit log triggered: Requires physical inspection before score calculation inclusion.';
    }

    if (deviationPercent > 100) {
      flags.push(`Extreme consumption surge (+${deviationPercent.toFixed(1)}%). Potential line breach or sensor multiplier glitch.`);
      status = 'Pending Review';
      suggestedAction = 'Flagged as high-priority anomaly. Notifying maintenance cell.';
    }
  }

  const isValid = status !== 'Flagged';

  return {
    isValid,
    status,
    scoreImpactAllowed,
    flags,
    suggestedAction
  };
}
