export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 
  | 'NEW' 
  | 'ACKNOWLEDGED' 
  | 'INVESTIGATING' 
  | 'ESCALATED' 
  | 'RESOLVED' 
  | 'FALSE_POSITIVE';

export type ObjectClass = 
  | 'person'
  | 'group'
  | 'car'
  | 'motorcycle'
  | 'truck'
  | 'bus'
  | 'unknown_vehicle'
  | 'bag'
  | 'abandoned_object'
  | 'animal'
  | 'drone';

export type MovementDirection = 
  | 'TOWARD_BORDER' 
  | 'AWAY_BORDER' 
  | 'PARALLEL' 
  | 'LATERAL_EAST' 
  | 'LATERAL_WEST' 
  | 'STATIONARY';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  w: number; // percentage 0-100
  h: number; // percentage 0-100
}

export interface Detection {
  id: string;
  objectId: string;
  class: ObjectClass;
  confidence: number; // 0 - 100
  cameraId: string;
  timestamp: string;
  trackId: string;
  direction: MovementDirection;
  vectorHeading?: string; // e.g. "S-SE 175° (Approaching)" or "East 090° (Lateral Right)"
  speedKmh: number;
  boundingBox: BoundingBox;
  riskLevel: Severity;
  sector: string;
  notes?: string;
  aiVerified?: boolean;
}

export interface ZoneCoordinate {
  x: number;
  y: number;
}

export interface SurveillanceZone {
  id: string;
  name: string;
  type: 'RESTRICTED' | 'BORDER_LINE' | 'BUFFER' | 'PATROL' | 'NO_VEHICLE' | 'OBSERVATION';
  color: string;
  points: ZoneCoordinate[]; // coordinates in percentage or map points
}

export interface Camera {
  id: string;
  name: string;
  sector: string; // e.g., 'Sector A - North Riverline', 'Sector B - Ridge Line'
  ip: string;
  rtspUrl: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  fps: number;
  latencyMs: number;
  resolution: string;
  healthStatus: 'HEALTHY' | 'TAMPER_ALERT' | 'FPS_DROP' | 'LENS_OBSTRUCTED' | 'FROZEN';
  tamperStatus: {
    isTampered: boolean;
    reason?: string;
    previousAngle?: number;
    currentAngle?: number;
    detectedAt?: string;
  };
  lastHeartbeat: string;
  aiStatus: 'ACTIVE' | 'EDGE_OFFLINE' | 'STANDBY';
  angleDeg: number;
  fovDeg: number;
  mapLocation: {
    x: number; // 0-100 relative on tactical map
    y: number;
    lat: number;
    lng: number;
  };
  zones: SurveillanceZone[];
  activeDetectionsCount: number;
  isRecording: boolean;
  edgeNodeId: string;
}

export interface Track {
  id: string; // e.g. 'P-104', 'V-201'
  class: ObjectClass;
  firstSeen: string;
  lastSeen: string;
  currentCameraId: string;
  cameraPath: string[]; // ['CAM-01', 'CAM-04', 'CAM-07', 'CAM-09']
  cameraList?: string[]; // compatibility alias
  direction: MovementDirection;
  durationSec: number;
  durationFormatted?: string;
  associatedVehicleId?: string;
  associatedPersonIds?: string[];
  associatedIncidentIds: string[];
  status: 'ACTIVE' | 'LOST' | 'INTERCEPTED' | 'RESOLVED';
  confidence: number;
  reIdConfidence?: number;
  riskScore?: number;
  speedAvgKmh: number;
  speedKmh?: number;
  isAnonymous: boolean; // privacy compliance
  features?: {
    upperClothing: string;
    lowerClothing: string;
    hasBackpack: boolean;
    gaitPace: string;
    aspectRatio?: number;
  };
  detections?: Array<{
    cameraId: string;
    timestamp: string;
    direction: MovementDirection;
    confidence: number;
  }>;
}

export interface RiskFactor {
  factor: string;
  score: number;
  description: string;
}

export interface AIExplanation {
  summary: string;
  contributingFactors: RiskFactor[];
  confidence: number; // 0-100
  humanVerificationRequired: boolean;
  limitations: string;
  crossCameraCorrelationReason: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  eventType: 'VEHICLE_DETECTED' | 'VEHICLE_STOPPED' | 'PERSON_EXIT' | 'PERSON_TRACKED' | 'APPROACH_BORDER' | 'VIRTUAL_FENCE_BREACH' | 'ZONE_BREACH' | 'OBJECT_ABANDONED' | 'TAMPER_EVENT' | 'ANIMAL_EXCLUDED';
  description: string;
  evidenceThumbnail?: string;
  trackId?: string;
  riskIncrement?: number;
}

export interface OperatorAction {
  id: string;
  timestamp: string;
  operatorName: string;
  role: string;
  action: 'ACKNOWLEDGED' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED' | 'FALSE_POSITIVE' | 'DISPATCH_PATROL' | 'REPORT_GENERATED';
  notes?: string;
}

export interface Incident {
  id: string; // e.g. 'INC-26187-01'
  title: string;
  severity: Severity;
  riskScore: number; // 0 - 100
  status: IncidentStatus;
  timestamp: string;
  sector: string;
  cameraList: string[];
  trackIds: string[];
  vehicleIds: string[];
  evidenceIds: string[];
  riskBreakdown: RiskFactor[];
  timeline: TimelineEvent[];
  aiExplanation: AIExplanation;
  operatorActions: OperatorAction[];
  isFlagshipScenario?: boolean;
  correlationsCount?: number;
  falsePositiveReason?: string;
  resolutionNotes?: string;
}

export interface OCRConsensusFrame {
  frameNumber: number;
  timestamp: string;
  readText: string;
  confidence: number;
}

export interface VehicleRecord {
  id: string; // 'V-201'
  type: 'car' | 'truck' | 'motorcycle' | 'bus' | 'unknown_vehicle';
  color: string;
  plateNumber: string;
  licensePlate?: string; // alias
  makeModel?: string; // e.g. 'Mahindra Scorpio White'
  plateConfidence: number;
  consensusFrames: OCRConsensusFrame[];
  cameraAppearances: string[];
  firstSeen: string;
  lastSeen: string;
  associatedIncidents: string[];
  associatedPersons: string[];
  direction: MovementDirection;
  speedKmh: number;
  status: 'ACTIVE_SEARCH' | 'FLAGGED' | 'CLEARED';
}

export interface EvidenceItem {
  id: string;
  incidentId: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  type: 'VIDEO_CLIP' | 'SNAPSHOT' | 'METADATA_STREAM' | 'ANPR_CROP';
  title: string;
  sha256Hash: string;
  integrityStatus: 'VERIFIED' | 'COMPROMISED';
  fileSizeKb: number;
  durationSec?: number;
  metadataPayload: Record<string, any>;
  previewUrl: string;
}

export interface AlertNotification {
  id: string;
  incidentId?: string;
  title: string;
  severity: Severity;
  timestamp: string;
  read: boolean;
  acknowledged: boolean;
  summary: string;
  sourceCameras: string[];
  sector: string;
  type: 'INTRUSION' | 'CORRELATED_BREACH' | 'TAMPER' | 'ABANDONED_OBJECT' | 'EDGE_SYNC' | 'WILDLIFE';
  cameraId?: string;
  message?: string;
}

export type AlertItem = AlertNotification;

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  objectId: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export interface FalsePositiveFeedback {
  id: string;
  incidentId: string;
  reason: string;
  category: 'WILDLIFE' | 'AUTHORIZED_PATROL' | 'WEATHER_ARTIFACT' | 'FALSE_TRACK_ASSOCIATION' | 'SHADOW_REFLECTION' | 'OTHER';
  modelConfidence: number;
  detectionType: ObjectClass;
  timestamp: string;
  operatorNotes: string;
  suggestedThresholdAdjustment?: string;
}

export interface EdgeNode {
  id: string;
  name: string;
  sector: string;
  status: 'ONLINE' | 'ISOLATED' | 'SYNCING' | 'DEGRADED';
  ip?: string;
  cpu?: number;
  gpu?: number;
  ram?: number;
  fps?: number;
  latency?: string;
  cameras?: string[];
  nvmeStorage?: string;
  aiEngine?: string;
  inferenceLatency?: string;
  localModelVersion: string;
  bufferedEventsCount: number;
  bandwidthSavedPct: number;
  localInferenceFps: number;
  lastSyncTime: string;
}

export type BehaviourType =
  | 'LOITERING'
  | 'RAPID_MOVEMENT'
  | 'REPEATED_APPROACH'
  | 'WRONG_DIRECTION'
  | 'RESTRICTED_ZONE_ENTRY'
  | 'GROUP_MOVEMENT'
  | 'ABANDONED_OBJECT'
  | 'UNUSUAL_VEHICLE_STOP'
  | 'PERSON_VEHICLE_INTERACTION';

export interface BehaviourAlert {
  id: string;
  type: BehaviourType;
  trackId: string;
  cameraId: string;
  confidence: number;
  severity: Severity;
  timestamp: string;
  explanation: string;
  durationSec?: number;
  coordinates?: { x: number; y: number };
}

export interface AbandonedObjectRecord {
  id: string;
  cameraId: string;
  initialDetectionTime: string;
  dwellSeconds: number;
  status: 'WARNING' | 'MEDIUM_ALERT' | 'HIGH_ALERT' | 'CLEARED';
  associatedTrackId?: string;
  lastSeenPosition: { x: number; y: number };
}

export interface SimulationStep {
  stepNumber: number;
  timestamp: string;
  cameraId: string;
  title: string;
  description: string;
  detectionClass: ObjectClass;
  trackId: string;
  riskScore: number;
  isBreach?: boolean;
}

export interface SimulationScenario {
  id: string;
  name: string;
  tag: string;
  description: string;
  stepsCount: number;
  expectedSeverity: Severity;
  targetCameras: string[];
  steps: SimulationStep[];
}
