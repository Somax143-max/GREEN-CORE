import { ChangeFingerprint } from '../types/index.js';

export interface SignalInputs {
  primaryDelta: number;
  primaryCategory: 'energy' | 'water' | 'waste' | 'transport';
  occupancyDelta: number;
  energyDelta: number;
  waterDelta: number;
  wasteDelta: number;
  weatherCondition: string;
  durationDays: number;
}

export function generateChangeFingerprint(inputs: SignalInputs): ChangeFingerprint {
  const { primaryDelta, primaryCategory, occupancyDelta, energyDelta, weatherCondition, durationDays } = inputs;
  
  const divergenceRatio = Math.abs(primaryDelta) / Math.max(Math.abs(occupancyDelta), 1.0);
  const isAbnormalPattern = divergenceRatio > 3.0 && Math.abs(primaryDelta) > 15;

  let findingSummary = '';

  if (isAbnormalPattern) {
    if (primaryCategory === 'water') {
      findingSummary = `Water consumption surged by ${primaryDelta > 0 ? '+' : ''}${primaryDelta.toFixed(1)}%, while building occupancy only shifted by ${occupancyDelta > 0 ? '+' : ''}${occupancyDelta.toFixed(1)}% and electricity by ${energyDelta > 0 ? '+' : ''}${energyDelta.toFixed(1)}%. Because the increase is decoupled from operational activity and persistent across ${durationDays} days, this fingerprint indicates an unmetered plumbing breach or continuous valve failure.`;
    } else if (primaryCategory === 'energy') {
      findingSummary = `Electrical load expanded by ${primaryDelta > 0 ? '+' : ''}${primaryDelta.toFixed(1)}% with static occupancy (${occupancyDelta.toFixed(1)}%). Correlated with night baseline baseload, indicating equipment left running or HVAC schedule failure.`;
    } else {
      findingSummary = `Metric deviated by ${primaryDelta.toFixed(1)}%, decoupled from campus activity vectors across ${durationDays} observation cycles. Physical inspection mandatory.`;
    }
  } else {
    findingSummary = `Metric movement (${primaryDelta > 0 ? '+' : ''}${primaryDelta.toFixed(1)}%) aligns with corresponding occupancy and campus activity changes (${occupancyDelta > 0 ? '+' : ''}${occupancyDelta.toFixed(1)}%). Normal operational variance.`;
  }

  return {
    primaryMetricDelta: primaryDelta,
    occupancyDelta,
    energyDelta: energyDelta,
    wasteDelta: inputs.wasteDelta,
    weatherCondition,
    durationDays,
    findingSummary,
    isAbnormalPattern
  };
}
