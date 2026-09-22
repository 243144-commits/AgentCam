import React, { useEffect, useRef, useState } from 'react';
import { Camera, Detection } from '../../types';
import { Shield, AlertTriangle, Radio, Maximize2, RefreshCw, ZoomIn, Compass, Zap, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CameraFeedPlayerProps {
  camera: Camera;
  detections?: Detection[];
  onSelect?: () => void;
  isDetailed?: boolean;
  showOverlay?: boolean;
  onCanvasRef?: (canvas: HTMLCanvasElement | null) => void;
}

export const CameraFeedPlayer: React.FC<CameraFeedPlayerProps> = ({
  camera,
  detections = [],
  onSelect,
  isDetailed = false,
  showOverlay = true,
  onCanvasRef
}) => {
  const { setActiveView } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [simulatedOffset, setSimulatedOffset] = useState<number>(0);
  const isTampered = camera.healthStatus === 'TAMPER_ALERT';
  const isThermal = camera.resolution.includes('Thermal');
  const isPhone = camera.id === 'CAM-PHONE-LIVE';

  // Expose canvas ref to parent if requested
  useEffect(() => {
    if (onCanvasRef && canvasRef.current) {
      onCanvasRef(canvasRef.current);
    }
  }, [onCanvasRef, camera.id]);

  // Realtime clock updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds() / 100));
    };
    updateTime();
    const timer = setInterval(updateTime, 100);
    return () => clearInterval(timer);
  }, []);

  // Animated surveillance canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Background Surveillance Scene rendering
      if (isTampered) {
        // Tampered camera: tilted ground texture with noise
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, w, h);

        // Ground texture
        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.3);
        ctx.lineTo(w, h * 0.45);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();

        // Warning banner across tampered feed
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.fillRect(0, h * 0.42, w, 28);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ TAMPER WARNING: OPTICAL AXIS DEFLECTED 42°', w / 2, h * 0.42 + 18);
      } else if (isThermal) {
        // Thermal IR Palette: Ironbow / White-Hot
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Horizon
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, h * 0.45, w, h * 0.55);

        // Thermal terrain noise lines
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, h * (0.55 + i * 0.1));
          ctx.lineTo(w, h * (0.52 + i * 0.11));
          ctx.stroke();
        }

        // Thermal target heat bloom (person or vehicle)
        if (camera.activeDetectionsCount > 0) {
          const osc = Math.sin(frame * 0.05) * 6;
          const targetX = w * 0.58 + osc;
          const targetY = h * 0.52;

          // Glowing heat signature
          const grad = ctx.createRadialGradient(targetX, targetY, 2, targetX, targetY, 25);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, '#f59e0b');
          grad.addColorStop(0.7, '#dc2626');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(targetX, targetY, 25, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (isPhone) {
        // Mobile Patrol / Phone Camera Feed Rendering
        ctx.fillStyle = '#06101e';
        ctx.fillRect(0, 0, w, h);

        // Ground terrain & horizon
        ctx.fillStyle = '#0b1626';
        ctx.fillRect(0, h * 0.42, w, h * 0.58);

        // Virtual fence tripwire line across frame
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(0, h * 0.52);
        ctx.lineTo(w, h * 0.52);
        ctx.stroke();
        ctx.setLineDash([]);

        // Active Optical Reticle & moving person
        const osc = (frame * 0.7) % (w * 0.75);
        const px = w * 0.15 + osc;
        const py = h * 0.52;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py - 16, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(px - 4, py - 10, 8, 18);
        ctx.fillRect(px - 5, py + 8, 4, 12);
        ctx.fillRect(px + 1, py + 8, 4, 12);

        // Mobile Sensor Watermark
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('● MOBILE OPTICAL SENSOR [PHONE LAB READY]', 12, h - 16);
      } else {
        // Standard Optical / Night Border Scene
        const isNight = camera.sector.includes('Ridge') || camera.id === 'CAM-09';
        ctx.fillStyle = isNight ? '#090d16' : '#0c1524';
        ctx.fillRect(0, 0, w, h);

        // Sky vs Desert Terrain
        ctx.fillStyle = isNight ? '#0f172a' : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.42);
        ctx.bezierCurveTo(w * 0.3, h * 0.38, w * 0.7, h * 0.46, w, h * 0.41);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();

        // Perimeter Barbed Wire / Virtual fence post representations
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
        ctx.lineWidth = 1.5;
        for (let x = 30; x < w; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, h * 0.45);
          ctx.lineTo(x, h * 0.85);
          ctx.stroke();
        }
        // Horizontal fence wire
        ctx.beginPath();
        ctx.moveTo(0, h * 0.55);
        ctx.lineTo(w, h * 0.58);
        ctx.moveTo(0, h * 0.7);
        ctx.lineTo(w, h * 0.73);
        ctx.stroke();

        // Simulated Subject movement (Person or Vehicle)
        if (camera.activeDetectionsCount > 0) {
          const osc = (frame * 0.6) % (w * 0.7);
          const px = w * 0.2 + osc;
          const py = h * 0.55;

          if (camera.id === 'CAM-01' || camera.id === 'CAM-04') {
            // Vehicle silhouette
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(px - 25, py - 12, 50, 24);
            ctx.fillStyle = '#475569';
            ctx.fillRect(px - 15, py - 20, 30, 10);
            // Headlights
            ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
            ctx.beginPath();
            ctx.moveTo(px + 25, py - 6);
            ctx.lineTo(px + 70, py - 18);
            ctx.lineTo(px + 70, py + 18);
            ctx.closePath();
            ctx.fill();
          } else {
            // Person silhouette
            ctx.fillStyle = '#0f172a';
            // head
            ctx.beginPath();
            ctx.arc(px, py - 18, 5, 0, Math.PI * 2);
            ctx.fill();
            // torso & legs
            ctx.fillRect(px - 3, py - 12, 6, 16);
            ctx.fillRect(px - 4, py + 4, 3, 12);
            ctx.fillRect(px + 1, py + 4, 3, 12);
          }
        }
      }

      // Digital Noise / TV scanline artifact
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let i = 0; i < 4; i++) {
        const ny = Math.random() * h;
        ctx.fillRect(0, ny, w, 1);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [camera, isTampered, isThermal, isPhone]);

  const cameraDetections = detections.length > 0 ? detections : (camera.activeDetectionsCount > 0 ? [
    {
      id: 'd-auto',
      objectId: camera.id === 'CAM-01' || camera.id === 'CAM-04' ? 'OBJ-V201' : 'OBJ-P104',
      class: (camera.id === 'CAM-01' || camera.id === 'CAM-04' ? 'car' : camera.id === 'CAM-16' ? 'abandoned_object' : camera.id === 'CAM-03' ? 'animal' : 'person') as any,
      confidence: camera.id === 'CAM-09' ? 94 : 91,
      cameraId: camera.id,
      timestamp: 'NOW',
      trackId: camera.id === 'CAM-01' || camera.id === 'CAM-04' ? 'V-201' : camera.id === 'CAM-16' ? 'BAG-01' : camera.id === 'CAM-03' ? 'AN-02' : 'P-104',
      direction: (camera.id === 'CAM-09' ? 'TOWARD_BORDER' : 'PARALLEL') as any,
      speedKmh: camera.id === 'CAM-09' ? 14.2 : 48,
      boundingBox: { x: 38, y: 38, w: 22, h: 32 },
      riskLevel: camera.id === 'CAM-09' ? 'CRITICAL' : 'HIGH',
      sector: camera.sector
    },
    ...(camera.id === 'CAM-PHONE-LIVE' ? [
      {
        id: 'd-phone-bag',
        objectId: 'OBJ-BAG01',
        class: 'bag' as any,
        confidence: 93,
        cameraId: camera.id,
        timestamp: 'NOW',
        trackId: 'OBJ-01',
        direction: 'TOWARD_BORDER' as any,
        speedKmh: 14.8,
        boundingBox: { x: 55, y: 48, w: 14, h: 18 },
        riskLevel: 'HIGH' as any,
        sector: camera.sector
      }
    ] : [])
  ] : []);

  return (
    <div 
      onClick={onSelect}
      className={`relative w-full h-full bg-[#05080e] rounded-lg overflow-hidden border transition-all select-none group cursor-pointer ${
        isTampered 
          ? 'border-amber-500/60 ring-1 ring-amber-500/30' 
          : camera.activeDetectionsCount > 0 
          ? 'border-red-500/50 ring-1 ring-red-500/30' 
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Video Canvas Layer */}
      <canvas
        ref={canvasRef}
        width={480}
        height={280}
        className="w-full h-full object-cover block"
      />

      {/* Surveillance Scanlines Overlay */}
      <div className="absolute inset-0 surveillance-scanline" />

      {/* Camera Header Telemetry Overlay */}
      {showOverlay && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-[11px] font-mono-code z-10">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${camera.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
            <strong className="text-slate-100 font-bold tracking-wider">{camera.id}</strong>
            <span className="text-slate-400 truncate max-w-[130px] hidden sm:inline">[{camera.name.split('-')[1] || camera.name}]</span>
            {isPhone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('phone-camera-lab');
                }}
                className="px-1.5 py-0.5 rounded bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-300 text-[10px] font-bold border border-emerald-500/50 flex items-center gap-1 transition-all"
                title="Open Phone Camera Lab with Full Interactive Computer Vision Tools"
              >
                <Smartphone className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>LAB</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {camera.isRecording && (
              <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 text-[10px] font-bold border border-red-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                REC
              </span>
            )}
            <span className="text-slate-300 text-[10px] hidden md:inline">{camera.fps} FPS</span>
            <span className="text-cyan-400 font-semibold text-[10px]">{currentTime}</span>
          </div>
        </div>
      )}

      {/* AI Inference Bounding Box Overlay */}
      {showOverlay && cameraDetections.map((det, idx) => {
        const isCritical = det.riskLevel === 'CRITICAL';
        const isTowardBorder = det.direction === 'TOWARD_BORDER';

        return (
          <div
            key={idx}
            className="absolute z-10 transition-all duration-75 ease-out pointer-events-none"
            style={{
              left: `${det.boundingBox.x}%`,
              top: `${det.boundingBox.y}%`,
              width: `${det.boundingBox.w}%`,
              height: `${det.boundingBox.h}%`
            }}
          >
            {/* Box corners bounding frame */}
            <div className={`w-full h-full border-2 relative ${
              det.class === 'bag'
                ? 'border-amber-400 bg-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.45)]'
                : isCritical ? 'border-red-500 bg-red-500/15 shadow-[0_0_10px_rgba(239,68,68,0.45)]' : 'border-emerald-400 bg-emerald-400/10'
            }`}>
              {/* Corner crosshairs */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />

              {/* Tag Header Badge */}
              <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase flex items-center gap-1.5 whitespace-nowrap shadow-md ${
                det.class === 'bag'
                  ? 'bg-amber-500 text-black'
                  : isCritical ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
              }`}>
                <span>{det.class === 'bag' ? 'HELD OBJ: BAG' : det.class}</span>
                <span>[{det.trackId}]</span>
                <span>{det.confidence}%</span>
                {det.aiVerified && <span className="bg-cyan-900 text-cyan-200 px-1 rounded text-[8px]">AI</span>}
              </div>

              {/* Direction & Risk Indicator Below Bounding Box */}
              <div className="absolute -bottom-6 left-0 px-2 py-0.5 rounded bg-slate-950/90 text-[9px] font-mono-code border border-slate-700 whitespace-nowrap flex items-center gap-1.5 shadow-lg">
                {det.direction === 'TOWARD_BORDER' ? (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    ↓ APPROACHING BORDER ({det.speedKmh} km/h)
                  </span>
                ) : det.direction === 'LATERAL_EAST' ? (
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    → PATROL EAST ({det.speedKmh} km/h)
                  </span>
                ) : det.direction === 'LATERAL_WEST' ? (
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    ← PATROL WEST ({det.speedKmh} km/h)
                  </span>
                ) : det.direction === 'AWAY_BORDER' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    ↑ RETREATING INWARD ({det.speedKmh} km/h)
                  </span>
                ) : det.direction === 'STATIONARY' ? (
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    ◎ STATIONARY LOITER
                  </span>
                ) : (
                  <span className="text-slate-300">
                    ↔ PARALLEL ({det.speedKmh} km/h)
                  </span>
                )}
                {det.vectorHeading && (
                  <span className="text-slate-400 text-[8px] border-l border-slate-700 pl-1">
                    {det.vectorHeading.split(' ')[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Camera Metadata Footer */}
      {showOverlay && (
        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-[10px] font-mono-code text-slate-400 z-10">
          <div className="flex items-center gap-2">
            <span>RES: {camera.resolution.split(' ')[0]}</span>
            <span className="hidden sm:inline">LAT: {camera.latencyMs}ms</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">AI: YOLOv10-EDGE</span>
            {isDetailed && <Maximize2 className="w-3 h-3 text-slate-400" />}
          </div>
        </div>
      )}
    </div>
  );
};
