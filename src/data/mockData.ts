import { Camera, Incident, Detection, Track, VehicleRecord, EvidenceItem, AlertNotification, AuditLogItem, EdgeNode, SimulationScenario } from '../types';

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: 'CAM-01',
    name: 'Sector A - Highway Approach',
    sector: 'Sector A - North Riverline',
    ip: '192.168.10.101',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam01/h264',
    status: 'ONLINE',
    fps: 30,
    latencyMs: 14,
    resolution: '3840x2160 (4K)',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: '1 sec ago',
    aiStatus: 'ACTIVE',
    angleDeg: 45,
    fovDeg: 88,
    mapLocation: { x: 18, y: 32, lat: 27.0215, lng: 71.1842 },
    zones: [
      { id: 'z1', name: 'Approach Buffer Zone', type: 'BUFFER', color: '#3b82f6', points: [{x: 10, y: 15}, {x: 85, y: 15}, {x: 85, y: 65}, {x: 10, y: 65}] }
    ],
    activeDetectionsCount: 1,
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-01'
  },
  {
    id: 'CAM-04',
    name: 'Sector A - Perimeter Access Road',
    sector: 'Sector A - North Riverline',
    ip: '192.168.10.104',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam04/h264',
    status: 'ONLINE',
    fps: 30,
    latencyMs: 16,
    resolution: '3840x2160 (4K)',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: '1 sec ago',
    aiStatus: 'ACTIVE',
    angleDeg: 60,
    fovDeg: 92,
    mapLocation: { x: 34, y: 44, lat: 27.0258, lng: 71.1895 },
    zones: [
      { id: 'z2', name: 'Perimeter Boundary Line', type: 'PATROL', color: '#10b981', points: [{x: 5, y: 30}, {x: 95, y: 30}, {x: 95, y: 80}, {x: 5, y: 80}] }
    ],
    activeDetectionsCount: 1,
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-01'
  },
  {
    id: 'CAM-07',
    name: 'Sector B - Ridge Line Overlook',
    sector: 'Sector B - Ridge Line',
    ip: '192.168.10.107',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam07/h264',
    status: 'ONLINE',
    fps: 29,
    latencyMs: 19,
    resolution: '2560x1440 (2K)',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: 'Just now',
    aiStatus: 'ACTIVE',
    angleDeg: 120,
    fovDeg: 75,
    mapLocation: { x: 55, y: 58, lat: 27.0312, lng: 71.1960 },
    zones: [
      { id: 'z3', name: 'Intermediate Barbed Buffer', type: 'BUFFER', color: '#f59e0b', points: [{x: 10, y: 20}, {x: 90, y: 20}, {x: 90, y: 70}, {x: 10, y: 70}] }
    ],
    activeDetectionsCount: 1,
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-02'
  },
  {
    id: 'CAM-09',
    name: 'Sector B - Zero Line Virtual Fence',
    sector: 'Sector B - Ridge Line',
    ip: '192.168.10.109',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam09/h264',
    status: 'ONLINE',
    fps: 30,
    latencyMs: 22,
    resolution: '3840x2160 (Thermal / Optical Dual)',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: 'Just now',
    aiStatus: 'ACTIVE',
    angleDeg: 165,
    fovDeg: 110,
    mapLocation: { x: 74, y: 72, lat: 27.0384, lng: 71.2031 },
    zones: [
      { id: 'z4', name: 'Zero Line International Boundary', type: 'BORDER_LINE', color: '#ef4444', points: [{x: 0, y: 48}, {x: 100, y: 48}, {x: 100, y: 95}, {x: 0, y: 95}] },
      { id: 'z5', name: 'Prohibited Lethal Zone', type: 'RESTRICTED', color: '#dc2626', points: [{x: 15, y: 50}, {x: 85, y: 50}, {x: 85, y: 90}, {x: 15, y: 90}] }
    ],
    activeDetectionsCount: 1,
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-02'
  },
  {
    id: 'CAM-PHONE-LIVE',
    name: 'Mobile Patrol Unit (Live Phone Camera Sensor)',
    sector: 'Sector B - Ridge Line',
    ip: '192.168.10.200 (Local MediaDevice)',
    rtspUrl: 'webrtc://edge-sih26187.border.internal:8554/phone-live',
    status: 'ONLINE',
    fps: 30,
    latencyMs: 8,
    resolution: '1920x1080 (Phone Camera HD)',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: 'Active WebRTC stream',
    aiStatus: 'ACTIVE',
    angleDeg: 175,
    fovDeg: 115,
    mapLocation: { x: 68, y: 65, lat: 27.0365, lng: 71.2005 },
    zones: [
      { id: 'z-phone-01', name: 'Calibrated Zero-Line Virtual Fence', type: 'BORDER_LINE', color: '#ef4444', points: [{x: 15, y: 50}, {x: 85, y: 50}] }
    ],
    activeDetectionsCount: 1,
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-02'
  },
  {
    id: 'CAM-02',
    name: 'Sector A - River Bed Crossing East',
    sector: 'Sector A - North Riverline',
    ip: '192.168.10.102',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam02/h264',
    status: 'ONLINE',
    fps: 30,
    latencyMs: 15,
    resolution: '1920x1080',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: '2 sec ago',
    aiStatus: 'ACTIVE',
    angleDeg: 210,
    fovDeg: 80,
    mapLocation: { x: 26, y: 22, lat: 27.0189, lng: 71.1812 },
    zones: [],
    activeDetectionsCount: 0,
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-01'
  },
  {
    id: 'CAM-03',
    name: 'Sector A - River Silt Observation Post',
    sector: 'Sector A - North Riverline',
    ip: '192.168.10.103',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam03/h264',
    status: 'ONLINE',
    fps: 30,
    latencyMs: 17,
    resolution: '1920x1080 (Thermal IR)',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: '1 sec ago',
    aiStatus: 'ACTIVE',
    angleDeg: 30,
    fovDeg: 65,
    mapLocation: { x: 42, y: 28, lat: 27.0224, lng: 71.1865 },
    zones: [],
    activeDetectionsCount: 1, // Wildlife detection
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-01'
  },
  {
    id: 'CAM-08',
    name: 'Sector B - Ridge South Watchtower',
    sector: 'Sector B - Ridge Line',
    ip: '192.168.10.108',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam08/h264',
    status: 'ONLINE',
    fps: 28,
    latencyMs: 25,
    resolution: '2560x1440',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: 'Just now',
    aiStatus: 'ACTIVE',
    angleDeg: 95,
    fovDeg: 85,
    mapLocation: { x: 62, y: 48, lat: 27.0290, lng: 71.1925 },
    zones: [],
    activeDetectionsCount: 0,
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-02'
  },
  {
    id: 'CAM-11',
    name: 'Sector C - Dune Flat 03',
    sector: 'Sector C - Desert Scrubland',
    ip: '192.168.10.111',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam11/h264',
    status: 'ONLINE',
    fps: 30,
    latencyMs: 28,
    resolution: '1920x1080',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: '3 sec ago',
    aiStatus: 'ACTIVE',
    angleDeg: 310,
    fovDeg: 90,
    mapLocation: { x: 82, y: 38, lat: 27.0410, lng: 71.2110 },
    zones: [],
    activeDetectionsCount: 0,
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-03'
  },
  {
    id: 'CAM-14',
    name: 'Sector C - Dry Nullah Gully',
    sector: 'Sector C - Desert Scrubland',
    ip: '192.168.10.114',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam14/h264',
    status: 'DEGRADED',
    fps: 14,
    latencyMs: 82,
    resolution: '1920x1080',
    healthStatus: 'TAMPER_ALERT',
    tamperStatus: {
      isTampered: true,
      reason: 'Physical optical displacement detected. Camera angle shifted unexpectedly by 42 degrees downward.',
      previousAngle: 180,
      currentAngle: 138,
      detectedAt: '14:28:10'
    },
    lastHeartbeat: '12 sec ago',
    aiStatus: 'EDGE_OFFLINE',
    angleDeg: 138,
    fovDeg: 75,
    mapLocation: { x: 88, y: 62, lat: 27.0450, lng: 71.2185 },
    zones: [],
    activeDetectionsCount: 0,
    isRecording: false,
    edgeNodeId: 'EDGE-NODE-03'
  },
  {
    id: 'CAM-16',
    name: 'Sector D - Forward Outpost Bravo Gate',
    sector: 'Sector D - Border Outpost Bravo',
    ip: '192.168.10.116',
    rtspUrl: 'rtsp://edge-sih26187.border.internal:554/cam16/h264',
    status: 'ONLINE',
    fps: 30,
    latencyMs: 12,
    resolution: '3840x2160 (4K)',
    healthStatus: 'HEALTHY',
    tamperStatus: { isTampered: false },
    lastHeartbeat: 'Just now',
    aiStatus: 'ACTIVE',
    angleDeg: 0,
    fovDeg: 105,
    mapLocation: { x: 30, y: 78, lat: 27.0150, lng: 71.1780 },
    zones: [],
    activeDetectionsCount: 1, // Abandoned bag
    isRecording: true,
    edgeNodeId: 'EDGE-NODE-04'
  }
];

export const INITIAL_DETECTIONS: Detection[] = [
  {
    id: 'DET-901',
    objectId: 'OBJ-P104',
    class: 'person',
    confidence: 94,
    cameraId: 'CAM-09',
    timestamp: '14:33:02',
    trackId: 'P-104',
    direction: 'TOWARD_BORDER',
    speedKmh: 14.2,
    boundingBox: { x: 58, y: 42, w: 12, h: 28 },
    riskLevel: 'CRITICAL',
    sector: 'Sector B - Ridge Line',
    notes: 'Sprint trajectory toward zero line virtual tripwire.'
  },
  {
    id: 'DET-882',
    objectId: 'OBJ-V201',
    class: 'car',
    confidence: 96,
    cameraId: 'CAM-07',
    timestamp: '14:32:17',
    trackId: 'V-201',
    direction: 'STATIONARY',
    speedKmh: 0,
    boundingBox: { x: 22, y: 55, w: 26, h: 18 },
    riskLevel: 'HIGH',
    sector: 'Sector B - Ridge Line',
    notes: 'Vehicle stopped in unlit shoulder zone; occupant disembarked.'
  },
  {
    id: 'DET-870',
    objectId: 'OBJ-BAG01',
    class: 'abandoned_object',
    confidence: 89,
    cameraId: 'CAM-16',
    timestamp: '14:24:00',
    trackId: 'BAG-01',
    direction: 'STATIONARY',
    speedKmh: 0,
    boundingBox: { x: 44, y: 68, w: 10, h: 12 },
    riskLevel: 'MEDIUM',
    sector: 'Sector D - Border Outpost Bravo',
    notes: 'Static rucksack stationary for >180 seconds without guardian in 15m radius.'
  },
  {
    id: 'DET-845',
    objectId: 'OBJ-ANI02',
    class: 'animal',
    confidence: 93,
    cameraId: 'CAM-03',
    timestamp: '14:20:15',
    trackId: 'AN-02',
    direction: 'PARALLEL',
    speedKmh: 4.5,
    boundingBox: { x: 62, y: 50, w: 18, h: 16 },
    riskLevel: 'LOW',
    sector: 'Sector A - North Riverline',
    notes: 'Four-legged quadruped (desert antelope / nilgai) near river silt. Excluded from intrusion alert.'
  }
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'P-104',
    class: 'person',
    firstSeen: '14:32:17',
    lastSeen: '14:33:45',
    currentCameraId: 'CAM-09',
    cameraPath: ['CAM-01', 'CAM-04', 'CAM-07', 'CAM-09'],
    cameraList: ['CAM-01', 'CAM-04', 'CAM-07', 'CAM-09'],
    direction: 'TOWARD_BORDER',
    durationSec: 88,
    durationFormatted: '02:21',
    associatedVehicleId: 'V-201',
    associatedIncidentIds: ['INC-26187-01'],
    status: 'ACTIVE',
    confidence: 92,
    reIdConfidence: 94,
    riskScore: 91,
    speedAvgKmh: 12.8,
    speedKmh: 14.2,
    isAnonymous: true,
    features: {
      upperClothing: 'Dark Hooded Jacket',
      lowerClothing: 'Tactical Cargo Khaki',
      hasBackpack: true,
      gaitPace: 'Rapid Sprint',
      aspectRatio: 0.42
    },
    detections: [
      { cameraId: 'CAM-01', timestamp: '14:31:40', direction: 'TOWARD_BORDER', confidence: 91 },
      { cameraId: 'CAM-04', timestamp: '14:32:01', direction: 'TOWARD_BORDER', confidence: 94 },
      { cameraId: 'CAM-07', timestamp: '14:32:17', direction: 'TOWARD_BORDER', confidence: 95 },
      { cameraId: 'CAM-09', timestamp: '14:33:02', direction: 'TOWARD_BORDER', confidence: 97 }
    ]
  },
  {
    id: 'V-201',
    class: 'car',
    firstSeen: '14:31:40',
    lastSeen: '14:32:45',
    currentCameraId: 'CAM-07',
    cameraPath: ['CAM-01', 'CAM-04', 'CAM-07'],
    cameraList: ['CAM-01', 'CAM-04', 'CAM-07'],
    direction: 'STATIONARY',
    durationSec: 65,
    durationFormatted: '01:05',
    associatedPersonIds: ['P-104'],
    associatedVehicleId: 'V-201',
    associatedIncidentIds: ['INC-26187-01'],
    status: 'ACTIVE',
    confidence: 96,
    reIdConfidence: 96,
    riskScore: 78,
    speedAvgKmh: 46.2,
    speedKmh: 48.0,
    isAnonymous: true,
    features: {
      upperClothing: 'Dark Metallic Grey Body',
      lowerClothing: 'Alloy Wheels Tinted',
      hasBackpack: false,
      gaitPace: 'High Speed Ingress',
      aspectRatio: 1.85
    },
    detections: [
      { cameraId: 'CAM-01', timestamp: '14:31:40', direction: 'TOWARD_BORDER', confidence: 96 },
      { cameraId: 'CAM-04', timestamp: '14:32:01', direction: 'TOWARD_BORDER', confidence: 95 },
      { cameraId: 'CAM-07', timestamp: '14:32:17', direction: 'STATIONARY', confidence: 98 }
    ]
  },
  {
    id: 'P-109',
    class: 'person',
    firstSeen: '14:10:00',
    lastSeen: '14:30:12',
    currentCameraId: 'CAM-04',
    cameraPath: ['CAM-02', 'CAM-04'],
    cameraList: ['CAM-02', 'CAM-04'],
    direction: 'PARALLEL',
    durationSec: 1212,
    durationFormatted: '20:12',
    associatedIncidentIds: [],
    status: 'RESOLVED',
    confidence: 98,
    reIdConfidence: 89,
    riskScore: 24,
    speedAvgKmh: 4.8,
    speedKmh: 4.5,
    isAnonymous: true,
    features: {
      upperClothing: 'Olive Drab Utility Shirt',
      lowerClothing: 'Standard Denim',
      hasBackpack: false,
      gaitPace: 'Casual Stride',
      aspectRatio: 0.44
    },
    detections: [
      { cameraId: 'CAM-02', timestamp: '14:10:00', direction: 'PARALLEL', confidence: 97 },
      { cameraId: 'CAM-04', timestamp: '14:25:30', direction: 'PARALLEL', confidence: 98 }
    ]
  },
  {
    id: 'AN-02',
    class: 'animal',
    firstSeen: '14:15:20',
    lastSeen: '14:26:00',
    currentCameraId: 'CAM-03',
    cameraPath: ['CAM-03'],
    cameraList: ['CAM-03'],
    direction: 'PARALLEL',
    durationSec: 640,
    durationFormatted: '10:40',
    associatedIncidentIds: [],
    status: 'RESOLVED',
    confidence: 93,
    reIdConfidence: 75,
    riskScore: 12,
    speedAvgKmh: 4.1,
    speedKmh: 3.8,
    isAnonymous: true,
    features: {
      upperClothing: 'Quadruped Fur Nilgai Antelope',
      lowerClothing: 'Four Hooves',
      hasBackpack: false,
      gaitPace: 'Grazing Trot',
      aspectRatio: 1.1
    },
    detections: [
      { cameraId: 'CAM-03', timestamp: '14:15:20', direction: 'PARALLEL', confidence: 93 }
    ]
  }
];

export const INITIAL_VEHICLES: VehicleRecord[] = [
  {
    id: 'V-201',
    type: 'car',
    color: 'Dark Metallic Grey',
    plateNumber: 'MH12AB1234',
    licensePlate: 'MH12AB1234',
    makeModel: 'Mahindra Scorpio SUV (Dark Grey)',
    plateConfidence: 94,
    consensusFrames: [
      { frameNumber: 104, timestamp: '14:31:42', readText: 'MH12AB1234', confidence: 91 },
      { frameNumber: 108, timestamp: '14:31:43', readText: 'MH12AB1234', confidence: 95 },
      { frameNumber: 112, timestamp: '14:31:44', readText: 'MH12AB1234', confidence: 97 }
    ],
    cameraAppearances: ['CAM-01', 'CAM-04', 'CAM-07'],
    firstSeen: '14:31:40',
    lastSeen: '14:32:45',
    associatedIncidents: ['INC-26187-01'],
    associatedPersons: ['P-104'],
    direction: 'TOWARD_BORDER',
    speedKmh: 48,
    status: 'ACTIVE_SEARCH'
  },
  {
    id: 'V-108',
    type: 'truck',
    color: 'Sand Tan',
    plateNumber: 'RJ19GA9921',
    licensePlate: 'RJ19GA9921',
    makeModel: 'Tata 407 Supply Truck (Sand Tan)',
    plateConfidence: 96,
    consensusFrames: [
      { frameNumber: 42, timestamp: '13:50:10', readText: 'RJ19GA9921', confidence: 96 },
      { frameNumber: 46, timestamp: '13:50:11', readText: 'RJ19GA9921', confidence: 97 }
    ],
    cameraAppearances: ['CAM-01', 'CAM-16'],
    firstSeen: '13:50:00',
    lastSeen: '14:05:10',
    associatedIncidents: [],
    associatedPersons: [],
    direction: 'AWAY_BORDER',
    speedKmh: 34,
    status: 'CLEARED'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-26187-01',
    title: 'Possible Coordinated Border Intrusion',
    severity: 'CRITICAL',
    riskScore: 91,
    status: 'INVESTIGATING',
    timestamp: '14:33:05',
    sector: 'Sector B - Ridge Line',
    cameraList: ['CAM-01', 'CAM-04', 'CAM-07', 'CAM-09'],
    trackIds: ['P-104', 'V-201'],
    vehicleIds: ['V-201'],
    evidenceIds: ['EVD-01', 'EVD-02', 'EVD-03', 'EVD-04'],
    isFlagshipScenario: true,
    riskBreakdown: [
      { factor: 'Restricted-Zone Entry', score: 30, description: 'Track P-104 penetrated virtual zero-line buffer.' },
      { factor: 'Movement Toward Border', score: 20, description: 'Vector heading directly 165° toward international boundary.' },
      { factor: 'Multi-Camera Correlation', score: 15, description: 'Corroborated across 4 surveillance nodes within 2 minutes.' },
      { factor: 'Night/Tactical Hour Activity', score: 10, description: 'High-risk operational window protocol.' },
      { factor: 'Behaviour Anomaly & Rapid Sprint', score: 16, description: 'Unscheduled vehicle drop-off followed by sudden running.' }
    ],
    timeline: [
      {
        id: 'tl-1',
        timestamp: '14:31:40',
        cameraId: 'CAM-01',
        cameraName: 'Sector A - Highway Approach',
        eventType: 'VEHICLE_DETECTED',
        description: 'Unregistered dark SUV (V-201, ANPR: MH12AB1234) detected entering tactical border feeder road.',
        trackId: 'V-201',
        riskIncrement: 10
      },
      {
        id: 'tl-2',
        timestamp: '14:32:01',
        cameraId: 'CAM-04',
        cameraName: 'Sector A - Perimeter Access Road',
        eventType: 'VEHICLE_DETECTED',
        description: 'Same vehicle track V-201 confirmed passing Perimeter Road checkpoint at 52 km/h.',
        trackId: 'V-201',
        riskIncrement: 15
      },
      {
        id: 'tl-3',
        timestamp: '14:32:17',
        cameraId: 'CAM-07',
        cameraName: 'Sector B - Ridge Line Overlook',
        eventType: 'PERSON_EXIT',
        description: 'Vehicle V-201 abruptly halts in dark shoulder. Anonymous subject P-104 exits passenger door.',
        trackId: 'P-104',
        riskIncrement: 20
      },
      {
        id: 'tl-4',
        timestamp: '14:32:44',
        cameraId: 'CAM-07',
        cameraName: 'Sector B - Ridge Line Overlook',
        eventType: 'APPROACH_BORDER',
        description: 'Track P-104 accelerates on foot heading south-southeast into unpatrolled ravine.',
        trackId: 'P-104',
        riskIncrement: 15
      },
      {
        id: 'tl-5',
        timestamp: '14:33:02',
        cameraId: 'CAM-09',
        cameraName: 'Sector B - Zero Line Virtual Fence',
        eventType: 'VIRTUAL_FENCE_BREACH',
        description: 'Track P-104 crosses calibrated virtual fence boundary at 14.2 km/h. Spatial correlation matches CAM-07 trajectory.',
        trackId: 'P-104',
        riskIncrement: 31
      },
      {
        id: 'tl-6',
        timestamp: '14:33:05',
        cameraId: 'CAM-09',
        cameraName: 'Sector B - Zero Line Virtual Fence',
        eventType: 'ZONE_BREACH',
        description: 'Correlation Engine consolidates 4 camera feeds into unified alert: CRITICAL RISK 91/100.',
        trackId: 'P-104',
        riskIncrement: 0
      }
    ],
    aiExplanation: {
      summary: 'High-confidence coordinated penetration pattern detected across Sectors A & B. An unknown vehicle dropped an individual who immediately commenced a sprint across the zero-line restricted barrier.',
      contributingFactors: [
        { factor: 'Restricted-Zone Entry', score: 30, description: 'Subject penetrated lethal prohibited border perimeter.' },
        { factor: 'Movement Toward Border', score: 20, description: 'Directional heading: 165° SSE (Direct Border Trajectory).' },
        { factor: 'Multi-Camera Confirmation', score: 15, description: 'Corroborated across CAM-01, CAM-04, CAM-07, CAM-09 within 88 seconds.' },
        { factor: 'Unusual Stopping Pattern', score: 16, description: 'Abrupt vehicle deceleration on unlit shoulder followed by person disembarking.' },
        { factor: 'Tactical Watch Window', score: 10, description: 'Operation executed during low-light patrol shift change.' }
      ],
      confidence: 92,
      humanVerificationRequired: true,
      limitations: 'Subject facial biometrics intentionally obfuscated by anonymous tracking policy; identity unverified.',
      crossCameraCorrelationReason: 'Temporal separation of 88s and continuous velocity vector (12-14 km/h) between CAM-07 and CAM-09 confirms identical individual.'
    },
    operatorActions: [
      {
        id: 'act-1',
        timestamp: '14:33:20',
        operatorName: 'Inspector R. Verma',
        role: 'Border Console Operator',
        action: 'ACKNOWLEDGED',
        notes: 'Reviewing cross-camera telemetry and thermal footage from CAM-09.'
      },
      {
        id: 'act-2',
        timestamp: '14:34:02',
        operatorName: 'Inspector R. Verma',
        role: 'Border Console Operator',
        action: 'INVESTIGATING',
        notes: 'Dispatched Quick Reaction Team (QRT Sector B Bravo Unit).'
      }
    ]
  },
  {
    id: 'INC-26187-02',
    title: 'Unattended Pack on Forward Perimeter Gate',
    severity: 'MEDIUM',
    riskScore: 54,
    status: 'NEW',
    timestamp: '14:26:15',
    sector: 'Sector D - Border Outpost Bravo',
    cameraList: ['CAM-16'],
    trackIds: ['BAG-01'],
    vehicleIds: [],
    evidenceIds: ['EVD-05'],
    riskBreakdown: [
      { factor: 'Static Object Dwell Time > 180s', score: 30, description: 'Object stationary for 3m 40s.' },
      { factor: 'Owner Separation Distance', score: 15, description: 'Associated depositor departed scene at 14:24:10.' },
      { factor: 'Sensitive Outpost Gate Proximity', score: 9, description: 'Object placed within 12 meters of Outpost Bravo vehicle barrier.' }
    ],
    timeline: [
      {
        id: 'tl-21',
        timestamp: '14:23:45',
        cameraId: 'CAM-16',
        cameraName: 'Sector D - Forward Outpost Bravo Gate',
        eventType: 'PERSON_TRACKED',
        description: 'Subject carrying dark rucksack pauses near barrier.',
        trackId: 'P-112'
      },
      {
        id: 'tl-22',
        timestamp: '14:24:10',
        cameraId: 'CAM-16',
        cameraName: 'Sector D - Forward Outpost Bravo Gate',
        eventType: 'OBJECT_ABANDONED',
        description: 'Object placed on tarmac; subject departs rapidly towards civilian market road.',
        trackId: 'BAG-01'
      },
      {
        id: 'tl-23',
        timestamp: '14:26:15',
        cameraId: 'CAM-16',
        cameraName: 'Sector D - Forward Outpost Bravo Gate',
        eventType: 'OBJECT_ABANDONED',
        description: 'Abandoned object dwell threshold (180s) reached. Medium priority alert dispatched.',
        trackId: 'BAG-01'
      }
    ],
    aiExplanation: {
      summary: 'Stationary rucksack detected at sensitive gate entrance with owner departure confirmed. No heat or explosive signature verifiable via CCTV alone.',
      contributingFactors: [
        { factor: 'Unattended Duration', score: 30, description: 'Dwell time 220 seconds with zero guardian contact.' },
        { factor: 'Sensitive Sector', score: 15, description: 'Directly adjacent to primary operational gate barrier.' },
        { factor: 'Rapid Departure', score: 9, description: 'Subject exited frame at brisk gait without looking back.' }
      ],
      confidence: 88,
      humanVerificationRequired: true,
      limitations: 'Visual model cannot verify chemical/explosive contents; standard EOD protocol recommended.',
      crossCameraCorrelationReason: 'Single camera detection with confirmed owner detachment.'
    },
    operatorActions: []
  },
  {
    id: 'INC-26187-03',
    title: 'Camera Tamper Alarm — Physical Deflection',
    severity: 'HIGH',
    riskScore: 72,
    status: 'ACKNOWLEDGED',
    timestamp: '14:28:10',
    sector: 'Sector C - Desert Scrubland',
    cameraList: ['CAM-14'],
    trackIds: [],
    vehicleIds: [],
    evidenceIds: ['EVD-06'],
    riskBreakdown: [
      { factor: 'Optical Horizon Displacement (42°)', score: 35, description: 'Sudden abrupt shift in video keypoint geometry.' },
      { factor: 'Pre-tamper Shadows / Blindspot', score: 22, description: 'Blindspot created along critical dry nullah infiltration route.' },
      { factor: 'FPS Drop & Signal Fluctuation', score: 15, description: 'Frame rate dropped to 14 FPS, latency spiked to 82ms.' }
    ],
    timeline: [
      {
        id: 'tl-31',
        timestamp: '14:27:58',
        cameraId: 'CAM-14',
        cameraName: 'Sector C - Dry Nullah Gully',
        eventType: 'TAMPER_EVENT',
        description: 'High vibration and horizon tilt recorded on inertial telemetry.',
        riskIncrement: 20
      },
      {
        id: 'tl-32',
        timestamp: '14:28:10',
        cameraId: 'CAM-14',
        cameraName: 'Sector C - Dry Nullah Gully',
        eventType: 'TAMPER_EVENT',
        description: 'Optical displacement verified: Angle altered from 180° to 138°. Lens pointed toward ground.',
        riskIncrement: 52
      }
    ],
    aiExplanation: {
      summary: 'Surveillance node CAM-14 was forcefully misaligned, blinding Sector C Nullah route. Possible intentional blindspot creation prior to illegal crossing.',
      contributingFactors: [
        { factor: '42° Angle Deflection', score: 35, description: 'Optical optical-flow vectors indicate physical impact or pole tilt.' },
        { factor: 'Critical Infiltration Route Blinded', score: 22, description: 'Dry nullah is a known historical infiltration point during low wind.' },
        { factor: 'Edge Communication Degradation', score: 15, description: 'Edge node reported stream packet drops coincident with impact.' }
      ],
      confidence: 96,
      humanVerificationRequired: true,
      limitations: 'Current camera view shows soil texture; no suspect visible in current blinded frame.',
      crossCameraCorrelationReason: 'Tamper notification raised autonomously by Edge Node 03 embedded health watchdog.'
    },
    operatorActions: [
      {
        id: 'act-31',
        timestamp: '14:29:05',
        operatorName: 'Supervisor Col. A. Saxena',
        role: 'Border Operations Commander',
        action: 'ACKNOWLEDGED',
        notes: 'Tasked Patrol Rover Sector C to verify pole integrity and inspect Nullah.'
      }
    ]
  }
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-01',
    incidentId: 'INC-26187-01',
    cameraId: 'CAM-01',
    cameraName: 'Sector A - Highway Approach',
    timestamp: '14:31:40',
    type: 'ANPR_CROP',
    title: 'ANPR High-Res License Plate & Vehicle Ingress Crop',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    integrityStatus: 'VERIFIED',
    fileSizeKb: 842,
    metadataPayload: {
      plateText: 'MH12AB1234',
      consensusConfidence: '94%',
      vehicleClass: 'SUV / 4WD',
      speedEstimate: '48 km/h'
    },
    previewUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'EVD-02',
    incidentId: 'INC-26187-01',
    cameraId: 'CAM-07',
    cameraName: 'Sector B - Ridge Line Overlook',
    timestamp: '14:32:17',
    type: 'VIDEO_CLIP',
    title: 'Passenger Disembarkation & Vehicle Departure (10s Clip)',
    sha256Hash: '8f2c94d1b8243e8d7593c2992ef1572c8311a37c9a921d2837bc901a89454121',
    integrityStatus: 'VERIFIED',
    fileSizeKb: 4120,
    durationSec: 10,
    metadataPayload: {
      fps: 30,
      codec: 'H.265 / HEVC',
      trackAssociated: 'P-104',
      vehicleAssociated: 'V-201'
    },
    previewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'EVD-03',
    incidentId: 'INC-26187-01',
    cameraId: 'CAM-09',
    cameraName: 'Sector B - Zero Line Virtual Fence',
    timestamp: '14:33:02',
    type: 'SNAPSHOT',
    title: 'Thermal IR Virtual Zero-Line Fence Breach Snapshot',
    sha256Hash: '7d4a138c2053f18b31a3962ec54284d6ec5a62f92f9d651a084ef7f0e69d7249',
    integrityStatus: 'VERIFIED',
    fileSizeKb: 1280,
    metadataPayload: {
      sensorType: 'Long-Wave Infrared (LWIR)',
      virtualLineId: 'Z-ZERO-01',
      crossingVelocity: '14.2 km/h'
    },
    previewUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'EVD-04',
    incidentId: 'INC-26187-01',
    cameraId: 'CAM-09',
    cameraName: 'Sector B - Zero Line Virtual Fence',
    timestamp: '14:33:05',
    type: 'METADATA_STREAM',
    title: 'Correlated Spatio-Temporal Trajectory & Confidence Vectors',
    sha256Hash: 'a12bc9038d1726a45ef901239845bcde76a543ef890123a456bc78de90123456',
    integrityStatus: 'VERIFIED',
    fileSizeKb: 156,
    metadataPayload: {
      trackHops: ['CAM-01', 'CAM-04', 'CAM-07', 'CAM-09'],
      cumulativeTimeSec: 88,
      riskScoreFinal: 91
    },
    previewUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'EVD-05',
    incidentId: 'INC-26187-02',
    cameraId: 'CAM-16',
    cameraName: 'Sector D - Forward Outpost Bravo Gate',
    timestamp: '14:26:15',
    type: 'SNAPSHOT',
    title: 'Abandoned Rucksack Stationary Dwell Analysis Snapshot',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    integrityStatus: 'VERIFIED',
    fileSizeKb: 920,
    metadataPayload: {
      dwellTimeSeconds: 220,
      boundingCoords: '[44%, 68%, 10%, 12%]'
    },
    previewUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'EVD-06',
    incidentId: 'INC-26187-03',
    cameraId: 'CAM-14',
    cameraName: 'Sector C - Dry Nullah Gully',
    timestamp: '14:28:10',
    type: 'SNAPSHOT',
    title: 'Optical Tamper Calibration & Misalignment Keypoint Shift',
    sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    integrityStatus: 'VERIFIED',
    fileSizeKb: 740,
    metadataPayload: {
      deflectionAngle: '42 degrees',
      axis: 'Pitch Downward'
    },
    previewUrl: 'https://images.unsplash.com/photo-1508873696983-2df570364425?w=800&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'ALT-101',
    incidentId: 'INC-26187-01',
    title: 'CRITICAL: Possible Coordinated Border Intrusion',
    severity: 'CRITICAL',
    timestamp: '14:33:05',
    read: false,
    acknowledged: false,
    summary: 'Correlated 4-camera breach: Vehicle V-201 drop-off, Track P-104 sprint across Zero Line Virtual Fence.',
    sourceCameras: ['CAM-01', 'CAM-04', 'CAM-07', 'CAM-09'],
    sector: 'Sector B - Ridge Line',
    type: 'CORRELATED_BREACH'
  },
  {
    id: 'ALT-102',
    incidentId: 'INC-26187-03',
    title: 'TAMPER ALERT: Camera 14 Physical Angle Shift',
    severity: 'HIGH',
    timestamp: '14:28:10',
    read: false,
    acknowledged: true,
    summary: 'Optical horizon shift of 42° detected in Sector C Dry Nullah Gully.',
    sourceCameras: ['CAM-14'],
    sector: 'Sector C - Desert Scrubland',
    type: 'TAMPER'
  },
  {
    id: 'ALT-103',
    incidentId: 'INC-26187-02',
    title: 'Unattended Object Dwell > 180s',
    severity: 'MEDIUM',
    timestamp: '14:26:15',
    read: true,
    acknowledged: false,
    summary: 'Stationary rucksack detected at Outpost Bravo Gate with depositor separated.',
    sourceCameras: ['CAM-16'],
    sector: 'Sector D - Border Outpost Bravo',
    type: 'ABANDONED_OBJECT'
  },
  {
    id: 'ALT-104',
    title: 'Edge Node 02 Sync Completed',
    severity: 'LOW',
    timestamp: '14:15:00',
    read: true,
    acknowledged: true,
    summary: '28 buffered telemetry frames and 2 clip manifests synced with central storage.',
    sourceCameras: ['CAM-07', 'CAM-08', 'CAM-09'],
    sector: 'Sector B - Ridge Line',
    type: 'EDGE_SYNC'
  }
];

export const INITIAL_EDGE_NODES: EdgeNode[] = [
  {
    id: 'EDGE-NODE-01',
    name: 'North Sutlej River Outpost (Sector A)',
    sector: 'Sector A - North Riverline',
    status: 'ONLINE',
    ip: '192.168.10.1',
    cpu: 42,
    gpu: 68,
    ram: 58,
    fps: 30.1,
    latency: '12ms',
    cameras: ['CAM-01', 'CAM-02', 'CAM-03'],
    nvmeStorage: '38% (1.2TB / 4TB)',
    aiEngine: 'YOLOv10-TensorRT FP16',
    inferenceLatency: '13.8ms',
    localModelVersion: 'YOLOv10x-BorderEdge-v2.4',
    bufferedEventsCount: 0,
    bandwidthSavedPct: 94.2,
    localInferenceFps: 30.1,
    lastSyncTime: '30 sec ago'
  },
  {
    id: 'EDGE-NODE-02',
    name: 'Ridge Forward Tactical Post (Sector B)',
    sector: 'Sector B - Ridge Line',
    status: 'ONLINE',
    ip: '192.168.10.2',
    cpu: 64,
    gpu: 88,
    ram: 74,
    fps: 29.8,
    latency: '18ms',
    cameras: ['CAM-04', 'CAM-05', 'CAM-07', 'CAM-09'],
    nvmeStorage: '54% (2.1TB / 4TB)',
    aiEngine: 'YOLOv10-TensorRT FP16',
    inferenceLatency: '14.2ms',
    localModelVersion: 'YOLOv10x-BorderEdge-v2.4',
    bufferedEventsCount: 0,
    bandwidthSavedPct: 92.8,
    localInferenceFps: 29.8,
    lastSyncTime: '15 sec ago'
  },
  {
    id: 'EDGE-NODE-03',
    name: 'National Highway Overpass (Sector C)',
    sector: 'Sector C - Desert Scrubland',
    status: 'ISOLATED',
    ip: '192.168.10.3',
    cpu: 38,
    gpu: 54,
    ram: 51,
    fps: 30.0,
    latency: '9ms',
    cameras: ['CAM-11', 'CAM-12'],
    nvmeStorage: '29% (0.9TB / 4TB)',
    aiEngine: 'YOLOv10-TensorRT FP16',
    inferenceLatency: '11.5ms',
    localModelVersion: 'YOLOv10x-BorderEdge-v2.4',
    bufferedEventsCount: 14,
    bandwidthSavedPct: 89.1,
    localInferenceFps: 15.2,
    lastSyncTime: '12 min ago'
  },
  {
    id: 'EDGE-NODE-04',
    name: 'Desert Salt Marsh Tower (Sector D)',
    sector: 'Sector D - Border Outpost Bravo',
    status: 'DEGRADED',
    ip: '192.168.10.4',
    cpu: 49,
    gpu: 62,
    ram: 60,
    fps: 26.4,
    latency: '34ms',
    cameras: ['CAM-14', 'CAM-16'],
    nvmeStorage: '41% (1.6TB / 4TB)',
    aiEngine: 'YOLOv10-TensorRT FP16',
    inferenceLatency: '17.9ms',
    localModelVersion: 'YOLOv10x-BorderEdge-v2.4',
    bufferedEventsCount: 0,
    bandwidthSavedPct: 96.0,
    localInferenceFps: 26.4,
    lastSyncTime: '1 min ago'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-10',
    timestamp: '14:34:02',
    user: 'Insp. R. Verma',
    role: 'Operator',
    action: 'STATUS_UPDATE',
    objectId: 'INC-26187-01',
    details: 'Status shifted from ACKNOWLEDGED to INVESTIGATING. QRT Unit Sector B dispatched.',
    status: 'ALERT'
  },
  {
    id: 'aud-09',
    timestamp: '14:33:20',
    user: 'Insp. R. Verma',
    role: 'Operator',
    action: 'ACKNOWLEDGE',
    objectId: 'INC-26187-01',
    details: 'Operator opened Incident Investigation Dossier. Reviewing multi-camera correlation.',
    status: 'SUCCESS'
  },
  {
    id: 'aud-08',
    timestamp: '14:33:05',
    user: 'System Core Engine',
    role: 'CorrelationEngine',
    action: 'INCIDENT_CREATED',
    objectId: 'INC-26187-01',
    details: 'Autonomous correlation triggered across CAM-01, 04, 07, 09. Risk score: 91/100.',
    status: 'ALERT'
  },
  {
    id: 'aud-07',
    timestamp: '14:29:05',
    user: 'Col. A. Saxena',
    role: 'Supervisor',
    action: 'ACKNOWLEDGE',
    objectId: 'INC-26187-03',
    details: 'Camera 14 tamper alert confirmed. Maintenance dispatched.',
    status: 'WARNING'
  },
  {
    id: 'aud-06',
    timestamp: '14:20:18',
    user: 'AI Wildlife Classifier',
    role: 'ML_Filter',
    action: 'FILTER_EXCLUSION',
    objectId: 'DET-845',
    details: 'Suppressed false intrusion alarm for nilgai antelope in Sector A riverbed.',
    status: 'SUCCESS'
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'SCENARIO-WOW',
    name: 'Coordinated Border Intrusion (Flagship WOW Demo)',
    tag: 'FLAGSHIP SIH26187',
    description: '14-step realistic end-to-end multi-camera correlation: unknown vehicle entry, road transit, disembarkation, rapid sprint to zero-line, automated risk escalation to 91/100, evidence gathering, human confirmation, and report generation.',
    stepsCount: 14,
    expectedSeverity: 'CRITICAL',
    targetCameras: ['CAM-01', 'CAM-04', 'CAM-07', 'CAM-09'],
    steps: [
      { stepNumber: 1, timestamp: '14:31:40', cameraId: 'CAM-01', title: 'Vehicle Detected at Ingress', description: 'CAM-01 detects unregistered dark metallic SUV entering perimeter access road.', detectionClass: 'car', trackId: 'V-201', riskScore: 28 },
      { stepNumber: 2, timestamp: '14:31:52', cameraId: 'CAM-01', title: 'ANPR Consensus Captured', description: 'Multi-frame OCR achieves 94% consensus on license plate MH12AB1234.', detectionClass: 'car', trackId: 'V-201', riskScore: 35 },
      { stepNumber: 3, timestamp: '14:32:01', cameraId: 'CAM-04', title: 'Cross-Camera Vehicle Handoff', description: 'CAM-04 confirms identical vehicle signature moving along ridge feeder route at 52 km/h.', detectionClass: 'car', trackId: 'V-201', riskScore: 42 },
      { stepNumber: 4, timestamp: '14:32:17', cameraId: 'CAM-07', title: 'Abrupt Halt & Passenger Exit', description: 'Vehicle halts on unlit shoulder; occupant exits passenger side wearing dark fatigues.', detectionClass: 'person', trackId: 'P-104', riskScore: 58 },
      { stepNumber: 5, timestamp: '14:32:25', cameraId: 'CAM-07', title: 'Vehicle Departs Scene', description: 'Vehicle V-201 executes rapid U-turn returning north; person remains on foot.', detectionClass: 'car', trackId: 'V-201', riskScore: 65 },
      { stepNumber: 6, timestamp: '14:32:44', cameraId: 'CAM-07', title: 'Heading Directly Toward Border', description: 'Directional intelligence: Track P-104 heading 165° SSE directly toward restricted zero-line.', detectionClass: 'person', trackId: 'P-104', riskScore: 74 },
      { stepNumber: 7, timestamp: '14:32:55', cameraId: 'CAM-09', title: 'Subject Enters Thermal Dual-Sensor FOV', description: 'CAM-09 optical/thermal camera locks onto incoming subject at 14.2 km/h sprint.', detectionClass: 'person', trackId: 'P-104', riskScore: 82 },
      { stepNumber: 8, timestamp: '14:33:02', cameraId: 'CAM-09', title: 'Virtual Fence Line Breach', description: 'Calibrated virtual tripwire crossed. Multi-camera correlation engine connects all 4 hops.', detectionClass: 'person', trackId: 'P-104', riskScore: 91, isBreach: true },
      { stepNumber: 9, timestamp: '14:33:05', cameraId: 'SYSTEM', title: 'Critical Correlated Incident Generated', description: 'Single unified incident created instead of 4 fragmented alerts. Risk: 91/100 (CRITICAL).', detectionClass: 'person', trackId: 'P-104', riskScore: 91 },
      { stepNumber: 10, timestamp: '14:33:10', cameraId: 'SYSTEM', title: 'Autonomous Cryptographic Evidence Vaulting', description: 'SHA-256 evidence package created (ANPR crop, 10s video clip, thermal snapshot, metadata).', detectionClass: 'person', trackId: 'P-104', riskScore: 91 },
      { stepNumber: 11, timestamp: '14:33:15', cameraId: 'OPERATOR', title: 'Explainable AI Dossier Presented', description: 'Operator receives transparent "Why this alert?" breakdown with 92% confidence score.', detectionClass: 'person', trackId: 'P-104', riskScore: 91 },
      { stepNumber: 12, timestamp: '14:33:25', cameraId: 'OPERATOR', title: 'Human-in-the-Loop Confirmation', description: 'Border operator acknowledges incident and tasks QRT Sector B Bravo unit.', detectionClass: 'person', trackId: 'P-104', riskScore: 91 },
      { stepNumber: 13, timestamp: '14:33:40', cameraId: 'OPERATOR', title: 'Interception Vector Updated', description: 'Live tactical map calculates target interception coordinates for ground patrol.', detectionClass: 'person', trackId: 'P-104', riskScore: 91 },
      { stepNumber: 14, timestamp: '14:33:55', cameraId: 'SYSTEM', title: 'Defense Incident Report Auto-Compiled', description: 'Official Smart India Hackathon Border Incident Report generated and ready for export.', detectionClass: 'person', trackId: 'P-104', riskScore: 91 }
    ]
  },
  {
    id: 'SCENARIO-NIGHT',
    name: 'Night Thermal Intrusion Detection',
    tag: 'THERMAL / IR',
    description: 'Low-light thermal cameras detect body heat crossing river sandbanks during zero-illumination moonless night.',
    stepsCount: 6,
    expectedSeverity: 'HIGH',
    targetCameras: ['CAM-02', 'CAM-03'],
    steps: [
      { stepNumber: 1, timestamp: '02:14:10', cameraId: 'CAM-02', title: 'Thermal Signature Detected', description: 'CAM-02 detects high-contrast heat signature emerging from water channel.', detectionClass: 'person', trackId: 'P-301', riskScore: 45 },
      { stepNumber: 2, timestamp: '02:14:35', cameraId: 'CAM-03', title: 'Corroborated by Thermal Silt Post', description: 'CAM-03 LWIR sensor verifies crawling posture heading south.', detectionClass: 'person', trackId: 'P-301', riskScore: 78 }
    ]
  },
  {
    id: 'SCENARIO-TAMPER',
    name: 'Camera Tampering & Blindspot Attack',
    tag: 'TAMPER WATCHDOG',
    description: 'Physical displacement on CAM-14 triggers inertial and optical horizon alarms; automated blindspot alert.',
    stepsCount: 4,
    expectedSeverity: 'HIGH',
    targetCameras: ['CAM-14'],
    steps: [
      { stepNumber: 1, timestamp: '14:27:58', cameraId: 'CAM-14', title: 'Vibration & Optical Flux Alert', description: 'Camera detects sudden angular torque and spray occlusion.', detectionClass: 'unknown_vehicle', trackId: 'TMP-01', riskScore: 55 },
      { stepNumber: 2, timestamp: '14:28:10', cameraId: 'CAM-14', title: 'Horizon Angle Shift 42°', description: 'Horizon tilted 42° downward creating blindspot in Sector C dry nullah.', detectionClass: 'unknown_vehicle', trackId: 'TMP-01', riskScore: 72 },
      { stepNumber: 3, timestamp: '14:28:30', cameraId: 'SYSTEM', title: 'Autonomous Blindspot Handover', description: 'Adjacent camera CAM-12 pan-tilt commanded to cover blindspot corridor.', detectionClass: 'unknown_vehicle', trackId: 'TMP-01', riskScore: 68 },
      { stepNumber: 4, timestamp: '14:29:05', cameraId: 'OPERATOR', title: 'Tamper Alarm Verified & Patrol Sent', description: 'Supervisor logs physical tamper incident and dispatches engineering patrol unit.', detectionClass: 'unknown_vehicle', trackId: 'TMP-01', riskScore: 40 }
    ]
  },
  {
    id: 'SCENARIO-ABANDONED',
    name: 'Unattended Object & Dwell Logic (30s/60s/90s)',
    tag: 'BEHAVIOR INTELLIGENCE',
    description: 'Temporal dwell tracking: luggage deposited, owner walks away, timer triggers 30s Warning, 60s Medium, and 90s High Alert.',
    stepsCount: 5,
    expectedSeverity: 'HIGH',
    targetCameras: ['CAM-16'],
    steps: [
      { stepNumber: 1, timestamp: '14:23:45', cameraId: 'CAM-16', title: 'Object Dropped on Tarmac (00:00)', description: 'Subject sets down heavy rucksack and departs rapidly. Dwell timer initiated.', detectionClass: 'abandoned_object', trackId: 'BAG-01', riskScore: 30 },
      { stepNumber: 2, timestamp: '14:24:15', cameraId: 'CAM-16', title: 'Timer 30s Warning (00:30)', description: 'Luggage stationary without owner within 15m radius. Dwell Status: WARNING.', detectionClass: 'abandoned_object', trackId: 'BAG-01', riskScore: 45 },
      { stepNumber: 3, timestamp: '14:24:45', cameraId: 'CAM-16', title: 'Timer 60s Medium Alert (01:00)', description: 'Stationary dwell exceeded 60 seconds. Perimeter guard dispatched for verification.', detectionClass: 'abandoned_object', trackId: 'BAG-01', riskScore: 62 },
      { stepNumber: 4, timestamp: '14:25:15', cameraId: 'CAM-16', title: 'Timer 90s High Alert: Abandoned Object (01:30)', description: 'Potential abandoned object confirmed. Dwell time: 01:30. Perimeter cordon recommended.', detectionClass: 'abandoned_object', trackId: 'BAG-01', riskScore: 78 },
      { stepNumber: 5, timestamp: '14:26:15', cameraId: 'SYSTEM', title: 'Bomb Disposal / QRT Dispatched', description: 'SHA-256 evidence packet sealed. Bomb squad alerted; isolation zone established.', detectionClass: 'abandoned_object', trackId: 'BAG-01', riskScore: 82 }
    ]
  },
  {
    id: 'SCENARIO-WILDLIFE',
    name: 'Wildlife False Positive Filter',
    tag: 'RESPONSIBLE AI',
    description: 'Desert nilgai antelope approaches boundary; AI suppresses intrusion alarm while recording telemetry.',
    stepsCount: 3,
    expectedSeverity: 'LOW',
    targetCameras: ['CAM-03'],
    steps: [
      { stepNumber: 1, timestamp: '14:20:15', cameraId: 'CAM-03', title: 'Quadruped Detected', description: 'AI identifies animal gait with 93% confidence; categorizes as non-threatening wildlife.', detectionClass: 'animal', trackId: 'AN-02', riskScore: 12 },
      { stepNumber: 2, timestamp: '14:20:18', cameraId: 'SYSTEM', title: 'Alarm Suppressed with Log', description: 'Intrusion alarm suppressed; false positive avoided for tactical operator.', detectionClass: 'animal', trackId: 'AN-02', riskScore: 12 }
    ]
  },
  {
    id: 'SCENARIO-EDGE-SYNC',
    name: 'Edge Mode Offline Buffering & Sync',
    tag: 'EDGE SURVIVABILITY',
    description: 'Network line severed; Edge Node continues local YOLO detection, buffers 14 events, and syncs upon reconnection.',
    stepsCount: 5,
    expectedSeverity: 'MEDIUM',
    targetCameras: ['CAM-11', 'CAM-14'],
    steps: [
      { stepNumber: 1, timestamp: '14:10:00', cameraId: 'SYSTEM', title: 'Upstream Backhaul Severed', description: 'Edge Node 03 enters isolated autonomous operation.', detectionClass: 'person', trackId: 'EDGE-SIM', riskScore: 40 },
      { stepNumber: 2, timestamp: '14:14:00', cameraId: 'SYSTEM', title: 'Backhaul Restored & Sync', description: 'All 14 buffered events verified with SHA-256 and synchronized into central vault.', detectionClass: 'person', trackId: 'EDGE-SIM', riskScore: 25 }
    ]
  },
  {
    id: 'SCENARIO-MULTI-SIMULTANEOUS',
    name: 'Simultaneous Multi-Sector Diversion',
    tag: 'DIVERSION ATTACK',
    description: 'Coordinated events occurring simultaneously in Sector A riverbed and Sector C ridge to test operator prioritization.',
    stepsCount: 6,
    expectedSeverity: 'CRITICAL',
    targetCameras: ['CAM-01', 'CAM-11'],
    steps: [
      { stepNumber: 1, timestamp: '15:00:10', cameraId: 'CAM-01', title: 'Sector A Diversion Flare', description: 'Sudden light artifact in Sector A designed to pull QRT units.', detectionClass: 'group', trackId: 'DIV-01', riskScore: 60 },
      { stepNumber: 2, timestamp: '15:00:15', cameraId: 'CAM-11', title: 'Sector C Actual Infiltration', description: 'Primary penetration attempt in blinded sector. Smart Alert Prioritization detects correlation.', detectionClass: 'person', trackId: 'DIV-02', riskScore: 88 }
    ]
  }
];
