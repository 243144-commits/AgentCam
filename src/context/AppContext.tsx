import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Camera, Incident, Detection, Track, VehicleRecord, EvidenceItem, 
  AlertNotification, AuditLogItem, EdgeNode, IncidentStatus, FalsePositiveFeedback,
  SimulationScenario, SimulationStep, Severity, SurveillanceZone,
  AbandonedObjectRecord, BehaviourAlert
} from '../types';
import { 
  INITIAL_CAMERAS, INITIAL_INCIDENTS, INITIAL_DETECTIONS, INITIAL_TRACKS, 
  INITIAL_VEHICLES, INITIAL_EVIDENCE, INITIAL_ALERTS, INITIAL_EDGE_NODES, 
  INITIAL_AUDIT_LOGS, SIMULATION_SCENARIOS 
} from '../data/mockData';
import { computeOperationalRisk, calculateReIdContinuity, generateSHA256Hash } from '../services/eventPipeline';
import { playTacticalAlertSound } from '../utils/audioAlert';

export type AppView = 
  | 'overview'
  | 'live-surveillance'
  | 'intelligence'
  | 'incidents'
  | 'incident-detail'
  | 'tactical-map'
  | 'risk-heatmap'
  | 'cameras'
  | 'camera-detail'
  | 'vehicles'
  | 'persons-tracks'
  | 'evidence'
  | 'reports'
  | 'analytics'
  | 'simulation-lab'
  | 'system-health'
  | 'settings'
  | 'phone-camera-lab';

export type UserRole = 'OPERATOR' | 'SUPERVISOR' | 'ADMINISTRATOR';

export interface SimulationState {
  scenarioId: string;
  currentStepIndex: number;
  isRunning: boolean;
  speedMultiplier: number;
  completed: boolean;
}

export interface LiveKPIs {
  activeCamerasCount: number;
  totalCamerasCount: number;
  criticalAlertsCount: number;
  unacknowledgedAlertsCount: number;
  activeIncidentsCount: number;
  bandwidthSavedPct: number;
  systemRiskScore: number;
  totalTracksCount: number;
  edgeNodesOnlineCount: number;
}

interface AppContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  cameras: Camera[];
  selectedCameraId: string | null;
  selectedCamera: Camera | null;
  selectCamera: (id: string) => void;
  incidents: Incident[];
  selectedIncidentId: string | null;
  selectedIncident: Incident | null;
  selectIncident: (id: string) => void;
  detections: Detection[];
  tracks: Track[];
  vehicles: VehicleRecord[];
  evidenceList: EvidenceItem[];
  alerts: AlertNotification[];
  edgeNodes: EdgeNode[];
  auditLogs: AuditLogItem[];
  falsePositiveRecords: FalsePositiveFeedback[];
  
  // Edge Mode State
  isEdgeModeIsolated: boolean;
  offlineBufferedCount: number;
  isSyncingEdge: boolean;
  toggleEdgeMode: () => void;
  triggerEdgeSync: () => void;
  
  // Auth & Session
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loginAsDemo: () => void;

  // User Profile
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  operatorName: string;
  
  // Audio & Tactile
  soundMuted: boolean;
  toggleSoundMuted: () => void;

  // Modals & UI States
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isFalsePositiveModalOpen: boolean;
  setIsFalsePositiveModalOpen: (open: boolean) => void;
  falsePositiveTargetIncident: Incident | null;
  setFalsePositiveTargetIncident: (inc: Incident | null) => void;
  isDifferentiatorsModalOpen: boolean;
  setIsDifferentiatorsModalOpen: (open: boolean) => void;
  isAddCameraModalOpen: boolean;
  setIsAddCameraModalOpen: (open: boolean) => void;
  isCreateZoneModalOpen: boolean;
  setIsCreateZoneModalOpen: (open: boolean) => void;
  
  // Camera & Zone Registration
  addCamera: (camera: Camera) => void;
  addZone: (cameraId: string, zone: SurveillanceZone) => void;
  
  // Incident Operations
  updateIncidentStatus: (id: string, status: IncidentStatus, notes?: string) => void;
  markIncidentFalsePositive: (id: string, category: any, reason: string, notes: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  markAllAlertsRead: () => void;
  addAuditLog: (action: string, objectId: string, details: string, status?: 'SUCCESS' | 'WARNING' | 'ALERT') => void;
  addEvidenceItem: (item: EvidenceItem) => void;
  createLivePhoneIncident: (params: { title: string; severity: Severity; summary: string; evidence?: EvidenceItem }) => void;
  isPhoneStreamAttachedToGrid: boolean;
  setIsPhoneStreamAttachedToGrid: (val: boolean) => void;
  
  // Simulation Lab
  simulationState: SimulationState;
  currentScenario: SimulationScenario;
  startSimulation: (scenarioId?: string) => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  jumpToSimulationStep: (index: number) => void;
  runFlagshipScenario: () => void;

  // Operational Behaviour & Abandoned Objects
  abandonedObjectRecord: AbandonedObjectRecord | null;
  activeBehaviourAlerts: BehaviourAlert[];

  // Live KPIs
  kpis: LiveKPIs;

  // Configurable Weights
  riskWeights: {
    restrictedZone: number;
    towardBorder: number;
    multiCamera: number;
    nightTime: number;
    anomaly: number;
    abandoned: number;
    tamper: number;
  };
  setRiskWeights: React.Dispatch<React.SetStateAction<{
    restrictedZone: number;
    towardBorder: number;
    multiCamera: number;
    nightTime: number;
    anomaly: number;
    abandoned: number;
    tamper: number;
  }>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('overview');
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>('CAM-09');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-26187-01');
  const [detections, setDetections] = useState<Detection[]>(INITIAL_DETECTIONS);
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(INITIAL_VEHICLES);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [edgeNodes, setEdgeNodes] = useState<EdgeNode[]>(INITIAL_EDGE_NODES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [falsePositiveRecords, setFalsePositiveRecords] = useState<FalsePositiveFeedback[]>([]);

  // Sound Mute State
  const [soundMuted, setSoundMuted] = useState(false);
  const toggleSoundMuted = useCallback(() => setSoundMuted(prev => !prev), []);

  // Abandoned Object Record & Behaviours
  const [abandonedObjectRecord, setAbandonedObjectRecord] = useState<AbandonedObjectRecord | null>({
    id: 'ABANDON-16-01',
    cameraId: 'CAM-16',
    initialDetectionTime: '14:23:45',
    dwellSeconds: 94,
    status: 'HIGH_ALERT',
    associatedTrackId: 'BAG-01',
    lastSeenPosition: { x: 420, y: 380 }
  });

  const [activeBehaviourAlerts, setActiveBehaviourAlerts] = useState<BehaviourAlert[]>([
    {
      id: 'BEH-01',
      type: 'RESTRICTED_ZONE_ENTRY',
      trackId: 'P-104',
      cameraId: 'CAM-09',
      confidence: 96,
      severity: 'CRITICAL',
      timestamp: '14:33:02',
      explanation: 'Target penetrated Zero-Line Virtual Fence (Sector B) at 14.2 km/h sprint velocity.',
      durationSec: 88
    },
    {
      id: 'BEH-02',
      type: 'PERSON_VEHICLE_INTERACTION',
      trackId: 'P-104',
      cameraId: 'CAM-07',
      confidence: 94,
      severity: 'HIGH',
      timestamp: '14:32:17',
      explanation: 'Passenger disembarkation from stationary unregistered vehicle V-201 prior to perimeter foot approach.',
      durationSec: 25
    }
  ]);

  // Edge Mode
  const [isEdgeModeIsolated, setIsEdgeModeIsolated] = useState(false);
  const [offlineBufferedCount, setOfflineBufferedCount] = useState(14);
  const [isSyncingEdge, setIsSyncingEdge] = useState(false);

  // User Role & Name
  const [currentRole, setCurrentRole] = useState<UserRole>('OPERATOR');
  const operatorName = currentRole === 'OPERATOR' ? 'Insp. Rajesh Verma' : currentRole === 'SUPERVISOR' ? 'Col. A. Saxena' : 'Maj. G. Sandhu (Admin)';

  // Auth & Session
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Modals
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isFalsePositiveModalOpen, setIsFalsePositiveModalOpen] = useState(false);
  const [falsePositiveTargetIncident, setFalsePositiveTargetIncident] = useState<Incident | null>(null);
  const [isDifferentiatorsModalOpen, setIsDifferentiatorsModalOpen] = useState(false);
  const [isAddCameraModalOpen, setIsAddCameraModalOpen] = useState(false);
  const [isCreateZoneModalOpen, setIsCreateZoneModalOpen] = useState(false);

  // Risk Weights
  const [riskWeights, setRiskWeights] = useState({
    restrictedZone: 30,
    towardBorder: 20,
    multiCamera: 15,
    nightTime: 10,
    anomaly: 16,
    abandoned: 20,
    tamper: 15
  });

  // Simulation Lab State
  const [simulationState, setSimulationState] = useState<SimulationState>({
    scenarioId: 'SCENARIO-WOW',
    currentStepIndex: 7, // starts at step 8 (breach) for instantaneous impact
    isRunning: false,
    speedMultiplier: 1,
    completed: false
  });

  const currentScenario = useMemo(() => {
    return SIMULATION_SCENARIOS.find(s => s.id === simulationState.scenarioId) || SIMULATION_SCENARIOS[0];
  }, [simulationState.scenarioId]);

  const selectedCamera = useMemo(() => {
    return cameras.find(c => c.id === selectedCameraId) || cameras[0];
  }, [cameras, selectedCameraId]);

  const selectedIncident = useMemo(() => {
    return incidents.find(i => i.id === selectedIncidentId) || incidents[0];
  }, [incidents, selectedIncidentId]);

  // Live Computed KPIs
  const kpis: LiveKPIs = useMemo(() => {
    const activeCamerasCount = cameras.filter(c => c.status === 'ONLINE').length;
    const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged).length;
    const unacknowledgedAlertsCount = alerts.filter(a => !a.acknowledged).length;
    const activeIncidentsCount = incidents.filter(i => ['NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'ESCALATED'].includes(i.status)).length;
    const totalBandwidth = edgeNodes.reduce((acc, n) => acc + n.bandwidthSavedPct, 0);
    const bandwidthSavedPct = edgeNodes.length ? parseFloat((totalBandwidth / edgeNodes.length).toFixed(1)) : 93.5;
    const systemRiskScore = Math.max(...incidents.map(i => i.riskScore), 88);
    const edgeNodesOnlineCount = edgeNodes.filter(n => n.status === 'ONLINE').length;

    return {
      activeCamerasCount,
      totalCamerasCount: cameras.length,
      criticalAlertsCount,
      unacknowledgedAlertsCount,
      activeIncidentsCount,
      bandwidthSavedPct,
      systemRiskScore,
      totalTracksCount: tracks.length,
      edgeNodesOnlineCount
    };
  }, [cameras, alerts, incidents, edgeNodes, tracks]);

  const selectCamera = useCallback((id: string) => {
    setSelectedCameraId(id);
    setActiveView('camera-detail');
  }, []);

  const selectIncident = useCallback((id: string) => {
    setSelectedIncidentId(id);
    setActiveView('incident-detail');
  }, []);

  const addAuditLog = useCallback((action: string, objectId: string, details: string, status: 'SUCCESS' | 'WARNING' | 'ALERT' = 'SUCCESS') => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      user: operatorName,
      role: currentRole,
      action,
      objectId,
      details,
      status
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, [operatorName, currentRole]);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    addAuditLog('AUTH_LOGIN', 'CONSOLE', `Authenticated session established as ${currentRole}`, 'SUCCESS');
  }, [currentRole, addAuditLog]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    addAuditLog('AUTH_LOGOUT', 'CONSOLE', 'Operator session closed', 'SUCCESS');
  }, [addAuditLog]);

  const loginAsDemo = useCallback(() => {
    setIsLoggedIn(true);
    setActiveView('overview');
    addAuditLog('AUTH_DEMO_LOGIN', 'DEMO_MODE', 'Instant Demo mode activated (SIH26187)', 'SUCCESS');
  }, [addAuditLog]);

  const addCamera = useCallback((newCam: Camera) => {
    setCameras(prev => [newCam, ...prev]);
    addAuditLog('CAMERA_REGISTERED', newCam.id, `New camera stream ${newCam.name} attached to ${newCam.edgeNodeId}`, 'SUCCESS');
  }, [addAuditLog]);

  const addZone = useCallback((camId: string, newZone: SurveillanceZone) => {
    setCameras(prev => prev.map(cam => {
      if (cam.id === camId) {
        return {
          ...cam,
          zones: [...cam.zones, newZone]
        };
      }
      return cam;
    }));
    addAuditLog('ZONE_CREATED', camId, `Virtual zone ${newZone.name} (${newZone.type}) configured`, 'SUCCESS');
  }, [addAuditLog]);

  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus, notes?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const actionItem = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          operatorName,
          role: currentRole,
          action: status as any,
          notes: notes || `Operational status transitioned to ${status}.`
        };
        return {
          ...inc,
          status,
          operatorActions: [actionItem, ...inc.operatorActions]
        };
      }
      return inc;
    }));

    addAuditLog(`STATUS_${status}`, id, notes || `Status updated to ${status}`, status === 'ESCALATED' ? 'ALERT' : 'SUCCESS');
  }, [operatorName, currentRole, addAuditLog]);

  const markIncidentFalsePositive = useCallback((id: string, category: any, reason: string, notes: string) => {
    const inc = incidents.find(i => i.id === id);
    if (!inc) return;

    const fpRecord: FalsePositiveFeedback = {
      id: `fp-${Date.now()}`,
      incidentId: id,
      category,
      reason,
      modelConfidence: inc.aiExplanation.confidence,
      detectionType: 'person',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      operatorNotes: notes,
      suggestedThresholdAdjustment: 'Recommend increasing min persistence frames by +8 frames for dynamic foliage areas.'
    };

    setFalsePositiveRecords(prev => [fpRecord, ...prev]);
    updateIncidentStatus(id, 'FALSE_POSITIVE', `Marked as False Positive: ${reason}. Categorized under ${category}.`);
  }, [incidents, updateIncidentStatus]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true, read: true } : a));
    addAuditLog('ALERT_ACKNOWLEDGED', alertId, 'Operator acknowledged incoming threat alert', 'SUCCESS');
  }, [addAuditLog]);

  const markAllAlertsRead = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true, acknowledged: true })));
  }, []);

  const toggleEdgeMode = useCallback(() => {
    setIsEdgeModeIsolated(prev => {
      const next = !prev;
      setEdgeNodes(curr => curr.map(n => ({
        ...n,
        status: next ? (n.id === 'EDGE-NODE-03' ? 'ISOLATED' : 'ISOLATED') : (n.id === 'EDGE-NODE-03' ? 'ISOLATED' : 'ONLINE')
      })));

      if (next) {
        addAuditLog('EDGE_ISOLATED', 'NETWORK', 'Switched to isolated edge mode. Local event buffering initiated.', 'WARNING');
      } else {
        addAuditLog('EDGE_RECONNECTED', 'NETWORK', 'Central connectivity re-established.', 'SUCCESS');
      }
      return next;
    });
  }, [addAuditLog]);

  const triggerEdgeSync = useCallback(() => {
    if (offlineBufferedCount === 0) return;
    setIsSyncingEdge(true);
    addAuditLog('EDGE_SYNC_START', 'BUFFER', `Syncing ${offlineBufferedCount} buffered telemetry packets with cryptographic verification...`, 'SUCCESS');

    setTimeout(() => {
      setOfflineBufferedCount(0);
      setIsSyncingEdge(false);
      setEdgeNodes(prev => prev.map(n => ({ ...n, bufferedEventsCount: 0, status: n.id === 'EDGE-NODE-03' ? 'ONLINE' : n.status, lastSyncTime: 'Just now' })));
      
      const syncAlert: AlertNotification = {
        id: `alt-sync-${Date.now()}`,
        title: 'Edge Buffer Synchronized',
        severity: 'LOW',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        read: false,
        acknowledged: false,
        summary: 'All 14 offline events synchronized and cryptographic SHA-256 hashes verified.',
        sourceCameras: ['CAM-11', 'CAM-14'],
        sector: 'Sector C - Desert Scrubland',
        type: 'EDGE_SYNC'
      };
      setAlerts(prev => [syncAlert, ...prev]);
      if (!soundMuted) playTacticalAlertSound('SUCCESS');
      addAuditLog('EDGE_SYNC_COMPLETE', 'BUFFER', '14/14 offline packets synchronized successfully into Central Vault.', 'SUCCESS');
    }, 1800);
  }, [offlineBufferedCount, addAuditLog, soundMuted]);

  // Phone camera integration state & methods
  const [isPhoneStreamAttachedToGrid, setIsPhoneStreamAttachedToGrid] = useState<boolean>(true);

  const addEvidenceItem = useCallback((item: EvidenceItem) => {
    setEvidenceList(prev => [item, ...prev]);
    addAuditLog('EVIDENCE_SEALED', item.id, `New forensic snapshot sealed with SHA-256: ${item.sha256Hash.substring(0, 16)}...`, 'SUCCESS');
  }, [addAuditLog]);

  const createLivePhoneIncident = useCallback((params: { title: string; severity: Severity; summary: string; evidence?: EvidenceItem }) => {
    const newIncId = `INC-PHONE-${Date.now().toString().slice(-4)}`;
    const nowTime = new Date().toLocaleTimeString();
    
    if (params.evidence) {
      setEvidenceList(prev => [params.evidence!, ...prev]);
    }

    const newIncident: Incident = {
      id: newIncId,
      title: params.title,
      severity: params.severity,
      riskScore: params.severity === 'CRITICAL' ? 96 : 82,
      status: 'NEW',
      timestamp: nowTime,
      sector: 'Sector B - Ridge Line',
      cameraList: ['CAM-PHONE-LIVE'],
      trackIds: ['P-PHONE-01'],
      vehicleIds: [],
      evidenceIds: params.evidence ? [params.evidence.id] : [],
      riskBreakdown: [
        { factor: 'Restricted Zone Incursion', score: 38, description: 'Subject crossed Zero-Line Virtual Fence on phone camera' },
        { factor: 'Live Optical Sensor Confirmation', score: 25, description: 'Optical motion flux verified on local media device' },
        { factor: 'Trajectory Toward Border', score: 20, description: 'Vector heading directly aligned with prohibited zone' }
      ],
      timeline: [
        {
          id: `tl-phone-${Date.now()}`,
          timestamp: nowTime,
          cameraId: 'CAM-PHONE-LIVE',
          cameraName: 'Mobile Patrol / Phone Sensor',
          eventType: 'VIRTUAL_FENCE_BREACH',
          description: params.title,
          riskIncrement: 38
        }
      ],
      aiExplanation: {
        summary: params.summary,
        contributingFactors: [
          { factor: 'Restricted Zone Incursion', score: 38, description: 'Subject crossed Zero-Line Virtual Fence on phone camera' },
          { factor: 'Live Optical Sensor Confirmation', score: 25, description: 'Optical motion flux verified on local media device' }
        ],
        confidence: 94,
        humanVerificationRequired: true,
        limitations: 'Single optical device geometry; physical intercept dispatch recommended.',
        crossCameraCorrelationReason: 'Realtime mobile optical sensor telemetry stream from operator device'
      },
      operatorActions: [],
      correlationsCount: 1
    };

    setIncidents(prev => [newIncident, ...prev]);
    
    const newAlert: AlertNotification = {
      id: `ALT-LIVE-${Date.now().toString().slice(-4)}`,
      incidentId: newIncId,
      title: params.title,
      severity: params.severity,
      timestamp: nowTime,
      read: false,
      acknowledged: false,
      summary: params.summary,
      sourceCameras: ['CAM-PHONE-LIVE'],
      sector: 'Sector B - Ridge Line',
      type: 'INTRUSION',
      cameraId: 'CAM-PHONE-LIVE'
    };

    setAlerts(prev => [newAlert, ...prev]);
    addAuditLog('INCIDENT_RAISED', newIncId, `Live Phone Camera triggered ${params.severity} incident: ${params.title}`, 'ALERT');
    
    if (!soundMuted) {
      playTacticalAlertSound(params.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH');
    }
  }, [operatorName, addAuditLog, soundMuted]);

  /**
   * CENTRAL EVENT PIPELINE APPLIER
   * Updates Cameras, Detections, Tracks, Incidents, Alerts, and Evidence synchronously
   */
  const applySimulationStepEffects = useCallback((scenarioId: string, stepIndex: number) => {
    const scenario = SIMULATION_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario || !scenario.steps[stepIndex]) return;

    const step = scenario.steps[stepIndex];
    const nowTime = step.timestamp || new Date().toLocaleTimeString('en-US', { hour12: false });

    // 1. Edge Mode Handling
    if (isEdgeModeIsolated) {
      setOfflineBufferedCount(c => c + 1);
      setEdgeNodes(prev => prev.map(n => ({ ...n, bufferedEventsCount: n.bufferedEventsCount + 1 })));
    }

    // 2. Scenario specific operational dispatches
    if (scenarioId === 'SCENARIO-WOW') {
      const activeCamId = step.cameraId.startsWith('CAM') ? step.cameraId : 'CAM-09';

      // Update Cameras
      setCameras(prev => prev.map(cam => {
        if (cam.id === activeCamId) {
          return {
            ...cam,
            lastEventTime: nowTime,
            activeDetectionsCount: step.isBreach ? 2 : 1
          };
        }
        return cam;
      }));

      // Update Tracks
      setTracks(prev => prev.map(t => {
        if (t.id === 'P-104') {
          const path = stepIndex >= 7 
            ? ['CAM-01', 'CAM-04', 'CAM-07', 'CAM-09'] 
            : stepIndex >= 5 
              ? ['CAM-01', 'CAM-04', 'CAM-07'] 
              : ['CAM-01', 'CAM-04'];
          return {
            ...t,
            currentCameraId: activeCamId,
            cameraPath: path,
            cameraList: path,
            speedKmh: stepIndex >= 7 ? 14.2 : 11.5,
            riskScore: step.riskScore,
            status: 'ACTIVE',
            lastSeen: nowTime
          };
        }
        if (t.id === 'V-201') {
          return {
            ...t,
            lastSeen: nowTime,
            status: stepIndex >= 5 ? 'ACTIVE' : 'ACTIVE'
          };
        }
        return t;
      }));

      // Update Incidents
      setIncidents(prev => prev.map(inc => {
        if (inc.id === 'INC-26187-01') {
          let newStatus: IncidentStatus = inc.status;
          if (stepIndex >= 12) newStatus = 'INVESTIGATING';
          else if (stepIndex >= 11) newStatus = 'ACKNOWLEDGED';
          else if (stepIndex >= 8) newStatus = 'NEW';

          const newSeverity: Severity = step.riskScore >= 80 ? 'CRITICAL' : step.riskScore >= 60 ? 'HIGH' : 'MEDIUM';

          return {
            ...inc,
            riskScore: step.riskScore,
            severity: newSeverity,
            status: newStatus,
            correlationsCount: Math.min(4, Math.max(1, Math.floor(stepIndex / 2) + 1))
          };
        }
        return inc;
      }));

      // Audio & Alert triggers
      if (step.riskScore >= 85 && !soundMuted) {
        playTacticalAlertSound('CRITICAL');
      } else if (step.riskScore >= 60 && !soundMuted) {
        playTacticalAlertSound('HIGH');
      }
    } else if (scenarioId === 'SCENARIO-ABANDONED') {
      const dwellSeconds = stepIndex === 0 ? 0 : stepIndex === 1 ? 30 : stepIndex === 2 ? 60 : stepIndex === 3 ? 90 : 120;
      const status = dwellSeconds >= 90 ? 'HIGH_ALERT' : dwellSeconds >= 60 ? 'MEDIUM_ALERT' : 'WARNING';
      
      setAbandonedObjectRecord({
        id: 'ABANDON-16-01',
        cameraId: 'CAM-16',
        initialDetectionTime: '14:23:45',
        dwellSeconds,
        status,
        associatedTrackId: 'BAG-01',
        lastSeenPosition: { x: 420, y: 380 }
      });

      if (dwellSeconds >= 60 && !soundMuted) {
        playTacticalAlertSound(dwellSeconds >= 90 ? 'CRITICAL' : 'HIGH');
      }
    } else if (scenarioId === 'SCENARIO-TAMPER') {
      setCameras(prev => prev.map(c => {
        if (c.id === 'CAM-14') {
          return {
            ...c,
            status: stepIndex >= 1 ? 'TAMPERED' : 'ONLINE'
          };
        }
        return c;
      }));
      if (!soundMuted) playTacticalAlertSound('HIGH');
    }

    addAuditLog('SIM_STEP_EXEC', step.cameraId, `Step ${stepIndex + 1}/${scenario.steps.length}: ${step.title} (Risk: ${step.riskScore})`, step.riskScore >= 80 ? 'ALERT' : 'SUCCESS');
  }, [isEdgeModeIsolated, soundMuted, addAuditLog]);

  // Simulation controls
  const startSimulation = useCallback((scenarioId?: string) => {
    setSimulationState(prev => {
      const nextScenarioId = scenarioId || prev.scenarioId;
      return {
        ...prev,
        scenarioId: nextScenarioId,
        isRunning: true,
        completed: false
      };
    });
  }, []);

  const pauseSimulation = useCallback(() => {
    setSimulationState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetSimulation = useCallback(() => {
    setSimulationState(prev => ({
      ...prev,
      currentStepIndex: 0,
      isRunning: false,
      completed: false
    }));
    applySimulationStepEffects(simulationState.scenarioId, 0);
  }, [applySimulationStepEffects, simulationState.scenarioId]);

  const stepSimulation = useCallback(() => {
    setSimulationState(prev => {
      const scenario = SIMULATION_SCENARIOS.find(s => s.id === prev.scenarioId) || SIMULATION_SCENARIOS[0];
      const nextIndex = prev.currentStepIndex + 1;
      if (nextIndex >= scenario.steps.length) {
        return { ...prev, isRunning: false, completed: true };
      }
      applySimulationStepEffects(prev.scenarioId, nextIndex);
      return { ...prev, currentStepIndex: nextIndex };
    });
  }, [applySimulationStepEffects]);

  const setSimulationSpeed = useCallback((speed: number) => {
    setSimulationState(prev => ({ ...prev, speedMultiplier: speed }));
  }, []);

  const jumpToSimulationStep = useCallback((index: number) => {
    setSimulationState(prev => {
      const scenario = SIMULATION_SCENARIOS.find(s => s.id === prev.scenarioId) || SIMULATION_SCENARIOS[0];
      const targetIndex = Math.min(Math.max(0, index), scenario.steps.length - 1);
      applySimulationStepEffects(prev.scenarioId, targetIndex);
      return {
        ...prev,
        currentStepIndex: targetIndex,
        completed: targetIndex >= scenario.steps.length - 1
      };
    });
  }, [applySimulationStepEffects]);

  /**
   * FLAGSHIP ONE-CLICK DEMO (Requirement #20)
   * Launches the 14-step Flagship Scenario smoothly from step 0
   */
  const runFlagshipScenario = useCallback(() => {
    setSimulationState({
      scenarioId: 'SCENARIO-WOW',
      currentStepIndex: 0,
      isRunning: true,
      speedMultiplier: 1.2,
      completed: false
    });
    applySimulationStepEffects('SCENARIO-WOW', 0);
    setActiveView('live-surveillance');
    addAuditLog('FLAGSHIP_DEMO_LAUNCHED', 'SCENARIO-WOW', '14-step Smart India Hackathon Flagship Demo started.', 'ALERT');
  }, [applySimulationStepEffects, addAuditLog]);

  // Simulation tick loop
  useEffect(() => {
    if (!simulationState.isRunning) return;

    const interval = setInterval(() => {
      setSimulationState(prev => {
        const scenario = SIMULATION_SCENARIOS.find(s => s.id === prev.scenarioId) || SIMULATION_SCENARIOS[0];
        const nextIndex = prev.currentStepIndex + 1;
        if (nextIndex >= scenario.steps.length) {
          return { ...prev, isRunning: false, completed: true };
        }
        applySimulationStepEffects(prev.scenarioId, nextIndex);
        return { ...prev, currentStepIndex: nextIndex };
      });
    }, 3200 / simulationState.speedMultiplier);

    return () => clearInterval(interval);
  }, [simulationState.isRunning, simulationState.speedMultiplier, simulationState.scenarioId, applySimulationStepEffects]);

  // Recalculate explainable risk whenever custom weights change
  useEffect(() => {
    const calc = computeOperationalRisk({
      inRestrictedZone: true,
      headingToBorder: true,
      cameraPathLength: 4,
      isNightTime: true,
      isRapidMovement: true,
      hasVehiclePersonInteraction: true
    });

    setIncidents(prev => prev.map(inc => {
      if (inc.id === 'INC-26187-01') {
        return {
          ...inc,
          riskBreakdown: calc.factors
        };
      }
      return inc;
    }));
  }, [riskWeights]);

  return (
    <AppContext.Provider value={{
      activeView,
      setActiveView,
      cameras,
      selectedCameraId,
      selectedCamera,
      selectCamera,
      incidents,
      selectedIncidentId,
      selectedIncident,
      selectIncident,
      detections,
      tracks,
      vehicles,
      evidenceList,
      alerts,
      edgeNodes,
      auditLogs,
      falsePositiveRecords,
      isEdgeModeIsolated,
      offlineBufferedCount,
      isSyncingEdge,
      toggleEdgeMode,
      triggerEdgeSync,
      isLoggedIn,
      login,
      logout,
      loginAsDemo,
      currentRole,
      setCurrentRole,
      operatorName,
      soundMuted,
      toggleSoundMuted,
      isSearchModalOpen,
      setIsSearchModalOpen,
      isNotificationDrawerOpen,
      setIsNotificationDrawerOpen,
      isFalsePositiveModalOpen,
      setIsFalsePositiveModalOpen,
      falsePositiveTargetIncident,
      setFalsePositiveTargetIncident,
      isDifferentiatorsModalOpen,
      setIsDifferentiatorsModalOpen,
      isAddCameraModalOpen,
      setIsAddCameraModalOpen,
      isCreateZoneModalOpen,
      setIsCreateZoneModalOpen,
      addCamera,
      addZone,
      updateIncidentStatus,
      markIncidentFalsePositive,
      acknowledgeAlert,
      markAllAlertsRead,
      addAuditLog,
      addEvidenceItem,
      createLivePhoneIncident,
      isPhoneStreamAttachedToGrid,
      setIsPhoneStreamAttachedToGrid,
      simulationState,
      currentScenario,
      startSimulation,
      pauseSimulation,
      resetSimulation,
      stepSimulation,
      setSimulationSpeed,
      jumpToSimulationStep,
      runFlagshipScenario,
      abandonedObjectRecord,
      activeBehaviourAlerts,
      kpis,
      riskWeights,
      setRiskWeights
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
