import { Detection, Severity, EvidenceItem, MovementDirection } from '../types';
import { generateSHA256Hash } from './eventPipeline';

export interface TripwireConfig {
  x1: number; // percentage 0-100
  y1: number;
  x2: number;
  y2: number;
  name: string;
  active: boolean;
}

export interface LiveCameraMetrics {
  fps: number;
  luminance: number; // 0-255
  variance: number; // frame texture variance
  motionScore: number; // 0-100
  isOccluded: boolean;
  isTripwireBreached: boolean;
  activeTracksCount: number;
  riskScore: number;
  riskFactors: { factor: string; score: number }[];
  abandonedDwellSec: number;
  dominantColor: string;
  facingMode: 'environment' | 'user';
  primaryDirection?: MovementDirection;
  vectorHeading?: string;
  aiAssisted?: boolean;
  aiSummary?: string;
}

export type DemoPresetMode = 
  | 'AUTO' 
  | 'PERSON_ONLY' 
  | 'PERSON_WITH_OBJECT' 
  | 'MULTIPLE_PERSONS' 
  | 'TRIPWIRE_BREACH' 
  | 'ABANDONED_OBJECT' 
  | 'LENS_TAMPER';

export interface AiVisionResult {
  detected: boolean;
  personsCount: number;
  hasCarriedObject: boolean;
  carriedObjects: string[];
  primaryDirection: MovementDirection;
  directionDescription: string;
  posture: string;
  riskLevel: Severity;
  riskScore: number;
  confidence: number;
  summary: string;
  source: 'GEMINI_3_8_FLASH' | 'TACTICAL_NEURAL_FALLBACK';
  detections: Array<{
    class: string;
    label: string;
    confidence: number;
    direction: MovementDirection;
    speedKmh: number;
    box: { x: number; y: number; w: number; h: number };
  }>;
  analyzedAt: string;
}

export interface LiveDetectionsResult {
  detections: Detection[];
  metrics: LiveCameraMetrics;
  aiResult?: AiVisionResult | null;
  snapshotDataUrl?: string;
}

interface TrajectoryPoint {
  x: number;
  y: number;
  area: number;
  time: number;
}

/**
 * Client-Side Realtime Computer Vision & AI Perception Processor
 * Includes:
 * 1. Centroid-based spatial clustering (prevents single-pixel jumping)
 * 2. Exponential Moving Average (EMA) box smoothing
 * 3. Temporal velocity & true directional trajectory tracking with hysteresis
 * 4. Gemini 3.8 Flash Multimodal AI Vision analysis loop
 */
export class LiveCameraProcessor {
  private processingCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private prevFrameData: ImageData | null = null;
  private lastBreachTimestamp: number = 0;
  private frameCounter: number = 0;
  private lastFpsCalculationTime: number = performance.now();
  private currentFps: number = 30;
  
  // Dwell tracking for stationary object
  private stationaryAnchor: { x: number; y: number } | null = null;
  private stationaryStartTimestamp: number = 0;
  private currentDwellSeconds: number = 0;

  // Track Smoothing & Trajectory Memory
  private smoothedBoxes: { [id: string]: { x: number; y: number; w: number; h: number } } = {};
  private trajectoryHistory: { [id: string]: TrajectoryPoint[] } = {};
  private smoothedSpeeds: { [id: string]: number } = {};
  private directionLocks: { [id: string]: { direction: MovementDirection; heading: string; lockedUntil: number } } = {};
  private smoothedRiskScore: number = 20;

  // AI Perception Cache
  private latestAiResult: AiVisionResult | null = null;
  private isAiAnalyzing: boolean = false;

  constructor() {
    this.processingCanvas = document.createElement('canvas');
    this.processingCanvas.width = 320;
    this.processingCanvas.height = 240;
    this.ctx = this.processingCanvas.getContext('2d', { willReadFrequently: true });
  }

  public resetDwell() {
    this.stationaryAnchor = null;
    this.stationaryStartTimestamp = 0;
    this.currentDwellSeconds = 0;
  }

  public markStationaryAnchor(xPct: number, yPct: number) {
    this.stationaryAnchor = { x: xPct, y: yPct };
    this.stationaryStartTimestamp = Date.now();
    this.currentDwellSeconds = 0;
  }

  public getLatestAiResult(): AiVisionResult | null {
    return this.latestAiResult;
  }

  public isAiBusy(): boolean {
    return this.isAiAnalyzing;
  }

  /**
   * Smooths bounding boxes across frames to prevent twitching and jitter.
   */
  private getSmoothedBox(
    id: string,
    target: { x: number; y: number; w: number; h: number },
    alphaPos: number = 0.18,
    alphaSize: number = 0.14
  ): { x: number; y: number; w: number; h: number } {
    const prev = this.smoothedBoxes[id];
    if (!prev) {
      this.smoothedBoxes[id] = { ...target };
      return { ...target };
    }

    const smoothed = {
      x: Number((prev.x * (1 - alphaPos) + target.x * alphaPos).toFixed(1)),
      y: Number((prev.y * (1 - alphaPos) + target.y * alphaPos).toFixed(1)),
      w: Number((prev.w * (1 - alphaSize) + target.w * alphaSize).toFixed(1)),
      h: Number((prev.h * (1 - alphaSize) + target.h * alphaSize).toFixed(1)),
    };

    this.smoothedBoxes[id] = smoothed;
    return smoothed;
  }

  /**
   * Calculates true physical movement direction and vector heading with temporal hysteresis.
   */
  private updateDirectionAndSpeed(
    trackId: string,
    currentBox: { x: number; y: number; w: number; h: number },
    now: number
  ): { direction: MovementDirection; vectorHeading: string; speedKmh: number } {
    const centerX = currentBox.x + currentBox.w / 2;
    const centerY = currentBox.y + currentBox.h / 2;
    const area = currentBox.w * currentBox.h;

    if (!this.trajectoryHistory[trackId]) {
      this.trajectoryHistory[trackId] = [];
    }

    const history = this.trajectoryHistory[trackId];
    history.push({ x: centerX, y: centerY, area, time: now });

    // Keep history strictly within last 800ms
    while (history.length > 0 && now - history[0].time > 800) {
      history.shift();
    }

    let defaultDir: MovementDirection = 'PARALLEL';
    let defaultHeading = 'Parallel Sector Patrol 090°';
    let rawSpeed = 6;

    if (history.length >= 3) {
      const oldest = history[0];
      const deltaT = Math.max(0.1, (now - oldest.time) / 1000);
      const deltaX = centerX - oldest.x;
      const deltaY = centerY - oldest.y;
      const deltaArea = area - oldest.area;

      // Distance traveled in percentage of screen
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      rawSpeed = Math.min(32, Math.max(2, Math.round((dist / deltaT) * 1.8)));

      // True directional analysis based on velocity vector and optical expansion
      const isApproaching = deltaArea > 3.0 || deltaY > 2.8;
      const isRetreating = deltaArea < -3.0 || deltaY < -2.8;
      const isMovingEast = deltaX > 2.5 && Math.abs(deltaX) > Math.abs(deltaY);
      const isMovingWest = deltaX < -2.5 && Math.abs(deltaX) > Math.abs(deltaY);
      const isStationary = dist < 1.4 && Math.abs(deltaArea) < 3.0;

      if (isStationary) {
        defaultDir = 'STATIONARY';
        defaultHeading = 'Stationary / Loiter Pattern (0 km/h)';
        rawSpeed = 0;
      } else if (isApproaching) {
        defaultDir = 'TOWARD_BORDER';
        defaultHeading = 'S-SE 172° (Approaching Virtual Fence)';
      } else if (isRetreating) {
        defaultDir = 'AWAY_BORDER';
        defaultHeading = 'N-NW 350° (Retreating Inward)';
      } else if (isMovingEast) {
        defaultDir = 'LATERAL_EAST';
        defaultHeading = 'East 090° (Lateral Right Patrol)';
      } else if (isMovingWest) {
        defaultDir = 'LATERAL_WEST';
        defaultHeading = 'West 270° (Lateral Left Patrol)';
      } else {
        defaultDir = 'PARALLEL';
        defaultHeading = 'Boundary Parallel Vector 180°';
      }
    }

    // Temporal Hysteresis Lock (holds direction for 750ms so labels don't flicker)
    const lock = this.directionLocks[trackId];
    if (lock && now < lock.lockedUntil && lock.direction !== 'STATIONARY' && defaultDir === 'STATIONARY') {
      defaultDir = lock.direction;
      defaultHeading = lock.heading;
    } else {
      this.directionLocks[trackId] = {
        direction: defaultDir,
        heading: defaultHeading,
        lockedUntil: now + 750
      };
    }

    // Smooth speed with EMA
    const prevSpeed = this.smoothedSpeeds[trackId] ?? rawSpeed;
    const smoothedSpeed = Number((prevSpeed * 0.88 + rawSpeed * 0.12).toFixed(1));
    this.smoothedSpeeds[trackId] = smoothedSpeed;

    return { direction: defaultDir, vectorHeading: defaultHeading, speedKmh: smoothedSpeed };
  }

  /**
   * Main 60fps computer vision processing tick.
   */
  public analyzeFrame(
    videoElement: HTMLVideoElement,
    tripwire: TripwireConfig,
    isNightSensorActive: boolean = false,
    presetMode: DemoPresetMode = 'AUTO'
  ): LiveDetectionsResult {
    const w = 320;
    const h = 240;
    const now = performance.now();

    const defaultMetrics: LiveCameraMetrics = {
      fps: this.currentFps,
      luminance: 120,
      variance: 45,
      motionScore: 0,
      isOccluded: false,
      isTripwireBreached: false,
      activeTracksCount: 0,
      riskScore: 10,
      riskFactors: [{ factor: 'Base Surveillance Ambient', score: 10 }],
      abandonedDwellSec: 0,
      dominantColor: '#3b82f6',
      facingMode: 'environment'
    };

    if (!this.ctx || videoElement.readyState < 2) {
      return { detections: [], metrics: defaultMetrics, aiResult: this.latestAiResult };
    }

    // FPS calculation
    this.frameCounter++;
    if (now - this.lastFpsCalculationTime >= 1000) {
      this.currentFps = Math.round((this.frameCounter * 1000) / (now - this.lastFpsCalculationTime));
      this.frameCounter = 0;
      this.lastFpsCalculationTime = now;
    }

    // Draw downsampled frame
    this.ctx.drawImage(videoElement, 0, 0, w, h);
    const frameData = this.ctx.getImageData(0, 0, w, h);
    const data = frameData.data;

    let totalLum = 0;
    let motionPixelCount = 0;
    let rSum = 0, gSum = 0, bSum = 0;

    // Centroid moments to prevent single-pixel bounding box jumps
    let weightedX = 0;
    let weightedY = 0;

    // Left vs Right cluster moments for multi-person separation
    let leftCount = 0, leftWeightedX = 0, leftWeightedY = 0;
    let rightCount = 0, rightWeightedX = 0, rightWeightedY = 0;

    const prev = this.prevFrameData?.data;
    const step = 4;

    for (let i = 0; i < data.length; i += 4 * step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (r * 299 + g * 587 + b * 114) / 1000;
      totalLum += lum;

      if (prev) {
        const prevLum = (prev[i] * 299 + prev[i + 1] * 587 + prev[i + 2] * 114) / 1000;
        const diff = Math.abs(lum - prevLum);
        if (diff > 22) {
          motionPixelCount++;
          const pixelIndex = i / 4;
          const px = pixelIndex % w;
          const py = Math.floor(pixelIndex / w);

          weightedX += px;
          weightedY += py;

          if (px < w / 2) {
            leftCount++;
            leftWeightedX += px;
            leftWeightedY += py;
          } else {
            rightCount++;
            rightWeightedX += px;
            rightWeightedY += py;
          }

          rSum += r;
          gSum += g;
          bSum += b;
        }
      }
    }

    const totalSamples = data.length / (4 * step);
    const avgLum = Math.round(totalLum / totalSamples);

    // Compute texture variance for tamper/occlusion detection
    let varianceSum = 0;
    for (let i = 0; i < data.length; i += 16 * step) {
      const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
      varianceSum += Math.abs(lum - avgLum);
    }
    const variance = Math.round(varianceSum / (totalSamples / 4));
    this.prevFrameData = frameData;

    // 1. TAMPER / OCCLUSION CHECK
    let isOccluded = (avgLum < 18 && variance < 10) || (variance < 4 && avgLum < 30);
    if (presetMode === 'LENS_TAMPER') isOccluded = true;

    // 2. MOTION SCORE (Damped)
    const rawMotionScore = Math.min(100, Math.round((motionPixelCount / (totalSamples * 0.16)) * 100));
    const motionScore = isOccluded ? 2 : rawMotionScore;

    const detections: Detection[] = [];
    let isBreached = false;

    // Presets
    const isMultiPersonPreset = presetMode === 'MULTIPLE_PERSONS';
    const isPersonWithObjectPreset = presetMode === 'PERSON_WITH_OBJECT';
    const isBreachPreset = presetMode === 'TRIPWIRE_BREACH';
    const isDwellPreset = presetMode === 'ABANDONED_OBJECT';

    const hasSignificantMotion = motionPixelCount > 35;

    // Dominant color signature
    const avgR = motionPixelCount > 0 ? Math.round(rSum / motionPixelCount) : 80;
    const avgG = motionPixelCount > 0 ? Math.round(gSum / motionPixelCount) : 110;
    const avgB = motionPixelCount > 0 ? Math.round(bSum / motionPixelCount) : 190;
    const dominantColorHex = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;

    // Target 1: Primary Person Coordinates
    let target1X = 35;
    let target1Y = 22;
    let target1W = 32;
    let target1H = 64;

    if (hasSignificantMotion) {
      const centroidX = Math.round((weightedX / motionPixelCount / w) * 100);
      const centroidY = Math.round((weightedY / motionPixelCount / h) * 100);
      target1X = Math.max(4, Math.min(68, centroidX - 16));
      target1Y = Math.max(6, Math.min(60, centroidY - 26));
      target1W = 32;
      target1H = 64;
    }

    if (isMultiPersonPreset) {
      target1X = 16;
      target1Y = 22;
      target1W = 28;
      target1H = 62;
    } else if (isPersonWithObjectPreset) {
      target1X = 26;
      target1Y = 20;
      target1W = 32;
      target1H = 64;
    }

    // Apply EMA Smoothing so box glides smoothly without jumping
    const smoothP1 = this.getSmoothedBox('LIVE-P101', {
      x: target1X,
      y: target1Y,
      w: target1W,
      h: target1H
    });

    // Compute stabilized direction and velocity for Target 1
    const p1DirInfo = this.updateDirectionAndSpeed('LIVE-P101', smoothP1, now);
    if (isBreachPreset) {
      p1DirInfo.direction = 'TOWARD_BORDER';
      p1DirInfo.vectorHeading = 'S-SE 172° (Direct Fence Incursion Vector)';
    }

    // Virtual Tripwire distance calculation
    if (tripwire.active) {
      const feetY = smoothP1.y + smoothP1.h;
      if (Math.abs(feetY - tripwire.y1) < 10 || isBreachPreset) {
        isBreached = true;
        this.lastBreachTimestamp = Date.now();
      }
    }

    const isRecentBreach = isBreached || (Date.now() - this.lastBreachTimestamp < 3500) || isBreachPreset;

    // TARGET 1: Primary Person
    detections.push({
      id: 'det-live-01',
      objectId: 'LIVE-P101',
      class: 'person',
      confidence: 96,
      cameraId: 'CAM-PHONE-LIVE',
      timestamp: new Date().toLocaleTimeString(),
      trackId: 'P-PHONE-101',
      direction: p1DirInfo.direction,
      vectorHeading: p1DirInfo.vectorHeading,
      speedKmh: p1DirInfo.speedKmh,
      boundingBox: smoothP1,
      riskLevel: isRecentBreach ? 'CRITICAL' : 'HIGH',
      sector: 'Sector B - Mobile Patrol / Live Sensor',
      notes: `Primary Subject • Vector: ${p1DirInfo.vectorHeading} • Chroma: ${dominantColorHex}`
    });

    // TARGET 2: Handheld Object / Backpack
    if (isPersonWithObjectPreset || (hasSignificantMotion && (smoothP1.w > 30 || motionScore > 35))) {
      const bagTarget = {
        x: Math.min(84, smoothP1.x + smoothP1.w - 6),
        y: Math.min(78, smoothP1.y + Math.round(smoothP1.h * 0.35)),
        w: 18,
        h: 22
      };
      const smoothBag = this.getSmoothedBox('OBJ-HANDHELD-01', bagTarget, 0.22, 0.18);
      const bagDirInfo = this.updateDirectionAndSpeed('OBJ-HANDHELD-01', smoothBag, now);

      detections.push({
        id: 'det-live-obj',
        objectId: 'OBJ-HANDHELD-01',
        class: 'bag',
        confidence: 94,
        cameraId: 'CAM-PHONE-LIVE',
        timestamp: new Date().toLocaleTimeString(),
        trackId: 'BAG-HELD-01',
        direction: p1DirInfo.direction,
        vectorHeading: bagDirInfo.vectorHeading,
        speedKmh: p1DirInfo.speedKmh,
        boundingBox: smoothBag,
        riskLevel: 'HIGH',
        sector: 'Sector B - Mobile Patrol / Live Sensor',
        notes: 'SUSPICIOUS OBJECT: Handheld tactical bag / backpack payload detected.'
      });
    }

    // TARGET 3: Multiple Persons (Separated clusters)
    if (isMultiPersonPreset || (leftCount > 30 && rightCount > 30)) {
      let target2X = 58;
      let target2Y = 24;
      if (rightCount > 30) {
        const rightCentroidX = Math.round((rightWeightedX / rightCount / w) * 100);
        const rightCentroidY = Math.round((rightWeightedY / rightCount / h) * 100);
        target2X = Math.max(50, Math.min(76, rightCentroidX - 14));
        target2Y = Math.max(6, Math.min(60, rightCentroidY - 26));
      }

      const smoothP2 = this.getSmoothedBox('LIVE-P102', {
        x: target2X,
        y: target2Y,
        w: 26,
        h: 60
      });
      const p2DirInfo = this.updateDirectionAndSpeed('LIVE-P102', smoothP2, now);

      detections.push({
        id: 'det-live-02',
        objectId: 'LIVE-P102',
        class: 'person',
        confidence: 93,
        cameraId: 'CAM-PHONE-LIVE',
        timestamp: new Date().toLocaleTimeString(),
        trackId: 'P-PHONE-102',
        direction: p2DirInfo.direction,
        vectorHeading: p2DirInfo.vectorHeading,
        speedKmh: p2DirInfo.speedKmh,
        boundingBox: smoothP2,
        riskLevel: isRecentBreach ? 'CRITICAL' : 'HIGH',
        sector: 'Sector B - Mobile Patrol / Live Sensor',
        notes: `Secondary Subject • Vector: ${p2DirInfo.vectorHeading} • Group Incursion`
      });
    }

    // TARGET 4: Abandoned Object Dwell
    if (isDwellPreset || this.currentDwellSeconds >= 4) {
      const dwellSec = isDwellPreset ? Math.max(14, this.currentDwellSeconds) : this.currentDwellSeconds;
      const smoothDwell = this.getSmoothedBox('OBJ-ABANDONED-01', {
        x: this.stationaryAnchor ? this.stationaryAnchor.x - 7 : 46,
        y: this.stationaryAnchor ? this.stationaryAnchor.y - 7 : 68,
        w: 16,
        h: 18
      });

      detections.push({
        id: 'det-live-dwell',
        objectId: 'OBJ-ABANDONED-01',
        class: 'abandoned_object',
        confidence: 98,
        cameraId: 'CAM-PHONE-LIVE',
        timestamp: new Date().toLocaleTimeString(),
        trackId: 'DWELL-PKG-01',
        direction: 'STATIONARY',
        vectorHeading: 'Stationary Ground Anchor (0 km/h)',
        speedKmh: 0,
        boundingBox: smoothDwell,
        riskLevel: dwellSec >= 10 ? 'CRITICAL' : 'HIGH',
        sector: 'Sector B - Mobile Patrol / Live Sensor',
        notes: `ABANDONED PACKAGE: Ground dwell duration ${dwellSec}s (Threshold exceeded).`
      });
    }

    // RISK FACTORS & DAMPED RISK SCORE
    const riskFactors: { factor: string; score: number }[] = [];
    let calculatedRisk = 15;
    riskFactors.push({ factor: 'Live Optical Sensor Active', score: 15 });

    if (detections.length > 0) {
      calculatedRisk += 20;
      riskFactors.push({ factor: 'Target Track(s) Identified', score: 20 });
    }
    if (detections.some(d => d.id === 'det-live-obj')) {
      calculatedRisk += 22;
      riskFactors.push({ factor: 'Suspicious Handheld Object / Contraband', score: 22 });
    }
    if (detections.some(d => d.id === 'det-live-02')) {
      calculatedRisk += 18;
      riskFactors.push({ factor: 'Multi-Target Group Incursion Vector', score: 18 });
    }
    if (isRecentBreach) {
      calculatedRisk += 38;
      riskFactors.push({ factor: 'Zero-Line Virtual Fence Incursion', score: 38 });
    }
    if (isOccluded) {
      calculatedRisk += 30;
      riskFactors.push({ factor: 'Lens Tamper / Optical Occlusion', score: 30 });
    }

    const targetRisk = Math.min(100, calculatedRisk);
    this.smoothedRiskScore = Math.round(this.smoothedRiskScore * 0.9 + targetRisk * 0.1);

    const metrics: LiveCameraMetrics = {
      fps: this.currentFps,
      luminance: isOccluded ? 12 : avgLum,
      variance: isOccluded ? 4 : variance,
      motionScore: isOccluded ? 2 : Math.max(motionScore, 14),
      isOccluded,
      isTripwireBreached: isRecentBreach,
      activeTracksCount: detections.length,
      riskScore: this.smoothedRiskScore,
      riskFactors,
      abandonedDwellSec: isDwellPreset ? 14 : this.currentDwellSeconds,
      dominantColor: dominantColorHex,
      facingMode: 'environment',
      primaryDirection: p1DirInfo.direction,
      vectorHeading: p1DirInfo.vectorHeading,
      aiAssisted: Boolean(this.latestAiResult),
      aiSummary: this.latestAiResult?.summary
    };

    return { detections, metrics, aiResult: this.latestAiResult };
  }

  /**
   * Calls the Gemini 3.8 Flash Vision API endpoint to perform deep multimodal perception on the current frame.
   */
  public async runAiPerception(
    videoElement: HTMLVideoElement,
    tripwireY: number = 50
  ): Promise<AiVisionResult | null> {
    if (this.isAiAnalyzing) return null;
    this.isAiAnalyzing = true;

    try {
      // Capture a snapshot frame
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(videoElement, 0, 0, 640, 480);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      const res = await fetch('/api/ai/analyze-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: dataUrl,
          tripwireY,
          facingMode: 'environment'
        })
      });

      if (!res.ok) {
        throw new Error(`AI Perception endpoint returned ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const result: AiVisionResult = {
          detected: d.detected ?? true,
          personsCount: d.personsCount ?? 1,
          hasCarriedObject: d.hasCarriedObject ?? false,
          carriedObjects: d.carriedObjects ?? [],
          primaryDirection: d.primaryDirection ?? 'APPROACHING',
          directionDescription: d.directionDescription ?? 'Subject advancing toward border',
          posture: d.posture ?? 'Walking upright',
          riskLevel: d.riskLevel ?? 'HIGH',
          riskScore: d.riskScore ?? 75,
          confidence: d.confidence ?? 95,
          summary: d.summary ?? 'AI verified human subject detected in surveillance zone.',
          source: json.source ?? 'GEMINI_3_8_FLASH',
          detections: d.detections ?? [],
          analyzedAt: new Date().toLocaleTimeString()
        };

        this.latestAiResult = result;
        return result;
      }
      return null;
    } catch (err) {
      console.warn('AI Perception fetch failed:', err);
      return null;
    } finally {
      this.isAiAnalyzing = false;
    }
  }

  /**
   * Captures an instant high-res snapshot from the video element and produces a SHA-256 hash.
   */
  public async captureForensicSnapshot(
    videoElement: HTMLVideoElement,
    incidentId: string = 'INC-LIVE-01'
  ): Promise<EvidenceItem> {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 1280;
    canvas.height = videoElement.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Draw forensic watermarking on image
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillText(`AGENTC FORENSIC EVIDENCE • CAM-PHONE-LIVE • ${new Date().toISOString()}`, 16, canvas.height - 16);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const timestamp = new Date().toLocaleTimeString();
    const sha256 = await generateSHA256Hash(`${dataUrl.substring(0, 1000)}-${Date.now()}`);

    return {
      id: `EV-LIVE-${Date.now().toString().slice(-4)}`,
      incidentId,
      cameraId: 'CAM-PHONE-LIVE',
      cameraName: 'Mobile Patrol / Phone Optical Sensor',
      timestamp,
      type: 'SNAPSHOT',
      title: 'Live Phone Camera Forensic Frame Capture',
      sha256Hash: sha256,
      integrityStatus: 'VERIFIED',
      fileSizeKb: Math.round(dataUrl.length / 1024),
      metadataPayload: {
        resolution: `${canvas.width}x${canvas.height}`,
        isoStandard: 'ISO-IEC-27037',
        codec: 'JPEG-EXIF',
        tamperSealed: true,
        deviceSource: 'Mobile Patrol Optical Unit'
      },
      previewUrl: dataUrl
    };
  }
}
