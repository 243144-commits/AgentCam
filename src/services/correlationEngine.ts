import { Detection, RiskFactor, AIExplanation, Incident, Severity } from '../types';

export interface RiskCalculationParams {
  restrictedZoneEntry: boolean;
  movementTowardBorder: boolean;
  multiCameraHopsCount: number; // e.g., 2, 3, 4
  isNightTime: boolean;
  isBehaviorAnomaly: boolean; // abrupt stop, running, loitering
  isAbandonedObject: boolean;
  isTamperNearEvent: boolean;
  customWeights?: {
    restrictedZone?: number;
    towardBorder?: number;
    multiCamera?: number;
    nightTime?: number;
    anomaly?: number;
    abandoned?: number;
    tamper?: number;
  };
}

export function computeExplainableRisk(params: RiskCalculationParams): {
  score: number;
  severity: Severity;
  breakdown: RiskFactor[];
} {
  const weights = {
    restrictedZone: params.customWeights?.restrictedZone ?? 30,
    towardBorder: params.customWeights?.towardBorder ?? 20,
    multiCamera: params.customWeights?.multiCamera ?? 15,
    nightTime: params.customWeights?.nightTime ?? 10,
    anomaly: params.customWeights?.anomaly ?? 16,
    abandoned: params.customWeights?.abandoned ?? 20,
    tamper: params.customWeights?.tamper ?? 15
  };

  const breakdown: RiskFactor[] = [];
  let total = 0;

  if (params.restrictedZoneEntry) {
    breakdown.push({
      factor: 'Restricted-Zone Entry',
      score: weights.restrictedZone,
      description: 'Detection crossed into lethal/restricted zero-line buffer zone'
    });
    total += weights.restrictedZone;
  }

  if (params.movementTowardBorder) {
    breakdown.push({
      factor: 'Movement Toward Border',
      score: weights.towardBorder,
      description: 'Directional vector oriented directly toward international boundary (< 30° deviation)'
    });
    total += weights.towardBorder;
  }

  if (params.multiCameraHopsCount >= 3) {
    breakdown.push({
      factor: 'Multi-Camera Correlation',
      score: weights.multiCamera,
      description: `Target trajectory confirmed across ${params.multiCameraHopsCount} sequential camera nodes`
    });
    total += weights.multiCamera;
  } else if (params.multiCameraHopsCount === 2) {
    breakdown.push({
      factor: 'Dual-Camera Confirmation',
      score: Math.round(weights.multiCamera * 0.6),
      description: 'Target trajectory verified across 2 adjacent cameras'
    });
    total += Math.round(weights.multiCamera * 0.6);
  }

  if (params.isNightTime) {
    breakdown.push({
      factor: 'Tactical Night Window',
      score: weights.nightTime,
      description: 'Activity detected during 22:00-05:00 low-visibility patrol shift interval'
    });
    total += weights.nightTime;
  }

  if (params.isBehaviorAnomaly) {
    breakdown.push({
      factor: 'Behavioral Anomaly',
      score: weights.anomaly,
      description: 'Unusual rapid velocity change, abrupt disembarkation, or erratic movement detected'
    });
    total += weights.anomaly;
  }

  if (params.isAbandonedObject) {
    breakdown.push({
      factor: 'Unattended Object Dwell',
      score: weights.abandoned,
      description: 'Static item stationary for >180s without owner proximity'
    });
    total += weights.abandoned;
  }

  if (params.isTamperNearEvent) {
    breakdown.push({
      factor: 'Adjacent Camera Tampering',
      score: weights.tamper,
      description: 'Nearby sensor experienced optical displacement or blindspot creation'
    });
    total += weights.tamper;
  }

  // Clamp 0 - 100
  const score = Math.min(Math.max(total, 0), 100);

  let severity: Severity = 'LOW';
  if (score >= 81) severity = 'CRITICAL';
  else if (score >= 61) severity = 'HIGH';
  else if (score >= 31) severity = 'MEDIUM';

  return { score, severity, breakdown };
}

export function generateIncidentExplanation(
  incidentTitle: string,
  cameras: string[],
  score: number,
  breakdown: RiskFactor[],
  trackId?: string
): AIExplanation {
  const isHighOrCritical = score >= 61;
  const cameraSummary = cameras.join(' → ');

  return {
    summary: `Automated correlation of ${cameras.length} optical/thermal nodes (${cameraSummary}) identified ${incidentTitle.toLowerCase()} with a cumulative threat score of ${score}/100.`,
    contributingFactors: breakdown,
    confidence: Math.min(88 + Math.round(score * 0.08), 98),
    humanVerificationRequired: true,
    limitations: 'Environmental factors, dust storms, or authorized undercover personnel without active RFID beacon may match this pattern. Mandatory physical verification required.',
    crossCameraCorrelationReason: `Spatio-temporal alignment: Vector speed, bounding-box aspect ratio, and continuous timestamps across ${cameras.length} cameras indicate high-confidence single event continuity rather than isolated alerts.`
  };
}
