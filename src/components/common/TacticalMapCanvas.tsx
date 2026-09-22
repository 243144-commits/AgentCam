import React, { useState } from 'react';
import { Camera, Incident, Track, VehicleRecord } from '../../types';
import { Eye, Shield, AlertTriangle, Radio, Navigation, ZoomIn, ZoomOut, Layers, Crosshair } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TacticalMapCanvasProps {
  height?: string;
  showControls?: boolean;
  interactive?: boolean;
}

export const TacticalMapCanvas: React.FC<TacticalMapCanvasProps> = ({ 
  height = 'h-full min-h-[440px]',
  showControls = true,
  interactive = true 
}) => {
  const { cameras, incidents, tracks, vehicles, selectCamera, selectIncident, simulationState, setIsCreateZoneModalOpen } = useApp();

  const [layers, setLayers] = useState({
    cameras: true,
    borderLine: true,
    restrictedZones: true,
    tracks: true,
    vehicles: true,
    incidents: true,
    fovCones: true
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedPin, setSelectedPin] = useState<{ type: 'camera' | 'incident' | 'track'; id: string } | null>(null);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className={`relative w-full ${height} bg-[#060b13] border border-slate-800 rounded-xl overflow-hidden select-none flex flex-col`}>
      {/* Top Map Toolbar & Layer Filter Pills */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg pointer-events-auto shadow-lg">
          <span className="text-[10px] uppercase font-mono-code text-slate-400 px-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            Layers
          </span>
          <button
            onClick={() => toggleLayer('cameras')}
            className={`px-2 py-1 rounded text-[11px] font-mono-code transition-colors ${
              layers.cameras ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            Cams ({cameras.length})
          </button>
          <button
            onClick={() => toggleLayer('incidents')}
            className={`px-2 py-1 rounded text-[11px] font-mono-code transition-colors ${
              layers.incidents ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            Incidents ({incidents.length})
          </button>
          <button
            onClick={() => toggleLayer('tracks')}
            className={`px-2 py-1 rounded text-[11px] font-mono-code transition-colors ${
              layers.tracks ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            Tracks ({tracks.filter(t => t.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => toggleLayer('restrictedZones')}
            className={`px-2 py-1 rounded text-[11px] font-mono-code transition-colors ${
              layers.restrictedZones ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            Zones
          </button>
          <button
            onClick={() => toggleLayer('fovCones')}
            className={`px-2 py-1 rounded text-[11px] font-mono-code transition-colors ${
              layers.fovCones ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            FOV Cones
          </button>
        </div>

        {/* Tactical Map Compass, Scale & Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsCreateZoneModalOpen(true)}
            className="px-2.5 py-1 rounded-md bg-red-950/80 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-[11px] font-mono-code flex items-center gap-1 transition-colors pointer-events-auto shadow cursor-pointer"
            title="Define New Geofenced Surveillance Zone"
          >
            <Crosshair className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">+ Create Zone</span>
            <span className="sm:hidden">+ Zone</span>
          </button>

          <div className="hidden sm:flex px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] font-mono-code text-slate-300 items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-cyan-400 rotate-45" />
            <span>N 27°02' BORDER GRID</span>
          </div>

          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-md overflow-hidden">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[10px] font-mono-code text-slate-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.8))}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map Surface */}
      <div className="relative flex-1 w-full h-full overflow-hidden tactical-grid">
        <svg 
          viewBox="0 0 1000 650" 
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Camera FOV Radar gradient */}
            <linearGradient id="fovGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.35)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.02)" />
            </linearGradient>

            <linearGradient id="fovTamperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.35)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0.02)" />
            </linearGradient>

            {/* Restricted Zone Hatch pattern */}
            <pattern id="restrictedHatch" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(239, 68, 68, 0.22)" strokeWidth="4" />
            </pattern>

            <pattern id="bufferHatch" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="rgba(245, 158, 11, 0.12)" strokeWidth="2" />
            </pattern>
          </defs>

          {/* Sector Outlines & Riverline Water feature */}
          <path 
            d="M 50,80 Q 250,140 450,110 T 850,180" 
            fill="none" 
            stroke="rgba(30, 64, 175, 0.3)" 
            strokeWidth="38" 
            strokeLinecap="round" 
          />
          <text x="240" y="115" fill="rgba(96, 165, 250, 0.4)" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="2">
            RIVER SUTLEJ BASIN (NATURAL BOUNDARY SECTOR A)
          </text>

          {/* Ridge contour lines (Sector B) */}
          <path d="M 420,240 Q 600,280 820,380" fill="none" stroke="rgba(100, 116, 139, 0.2)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 480,260 Q 640,310 860,400" fill="none" stroke="rgba(100, 116, 139, 0.2)" strokeWidth="2" strokeDasharray="4 4" />
          <text x="560" y="270" fill="rgba(148, 163, 184, 0.35)" fontSize="10" fontFamily="JetBrains Mono">
            RIDGE CONTOUR 420m (SECTOR B)
          </text>

          {/* Buffer Zone Polygon */}
          {layers.restrictedZones && (
            <>
              <polygon
                points="100,200 950,280 950,420 100,320"
                fill="url(#bufferHatch)"
                stroke="rgba(245, 158, 11, 0.3)"
                strokeWidth="1.5"
              />
              <text x="120" y="250" fill="rgba(245, 158, 11, 0.6)" fontSize="10" fontFamily="JetBrains Mono">
                500m TACTICAL BUFFER ZONE
              </text>

              {/* Zero-Line Restricted Zone (Lethal Zone) */}
              <polygon
                points="100,420 950,510 950,580 100,480"
                fill="url(#restrictedHatch)"
                stroke="rgba(239, 68, 68, 0.6)"
                strokeWidth="2"
              />
              <text x="120" y="460" fill="rgba(239, 68, 68, 0.8)" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                PROHIBITED ZERO-LINE RESTRICTED ZONE (SIH26187)
              </text>
            </>
          )}

          {/* International Zero Border Line */}
          {layers.borderLine && (
            <g>
              <line
                x1="80" y1="520"
                x2="960" y2="600"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeDasharray="10 6"
              />
              <text x="820" y="585" fill="#f87171" fontSize="11" fontFamily="Chakra Petch" fontWeight="bold">
                INTERNATIONAL ZERO LINE ────
              </text>
            </g>
          )}

          {/* Multi-Camera Correlated Intrusion Trail (Flagship P-104 path) */}
          {layers.tracks && (
            <g className="transition-opacity duration-300">
              {/* Interpolated Trajectory line between CAM-01 -> CAM-04 -> CAM-07 -> CAM-09 */}
              <path
                d="M 180,208 L 340,286 L 550,377 L 740,468"
                fill="none"
                stroke="rgba(239, 68, 68, 0.8)"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-pulse"
              />

              {/* Waypoint badges on track */}
              <circle cx="180" cy="208" r="5" fill="#ef4444" />
              <circle cx="340" cy="286" r="5" fill="#ef4444" />
              <circle cx="550" cy="377" r="5" fill="#ef4444" />
              <circle cx="740" cy="468" r="7" fill="#ef4444" className="animate-ping" />
              <circle cx="740" cy="468" r="7" fill="#ef4444" />

              <rect x="752" y="456" width="130" height="24" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#ef4444" strokeWidth="1" />
              <text x="760" y="472" fill="#fca5a5" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                TRACK P-104 (CRIT 91)
              </text>
            </g>
          )}

          {/* Cameras and Field of View cones */}
          {layers.cameras && cameras.map(cam => {
            const cx = cam.mapLocation.x * 10;
            const cy = cam.mapLocation.y * 6.5;
            const isTampered = cam.healthStatus === 'TAMPER_ALERT';
            const isDegraded = cam.status === 'DEGRADED';

            // FOV cone geometry calculations
            const angleRad = (cam.angleDeg - 90) * (Math.PI / 180);
            const halfFovRad = (cam.fovDeg / 2) * (Math.PI / 180);
            const length = 95;
            const p1x = cx + length * Math.cos(angleRad - halfFovRad);
            const p1y = cy + length * Math.sin(angleRad - halfFovRad);
            const p2x = cx + length * Math.cos(angleRad + halfFovRad);
            const p2y = cy + length * Math.sin(angleRad + halfFovRad);

            return (
              <g 
                key={cam.id}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedPin({ type: 'camera', id: cam.id });
                  selectCamera(cam.id);
                }}
              >
                {/* FOV Cone */}
                {layers.fovCones && (
                  <polygon
                    points={`${cx},${cy} ${p1x},${p1y} ${p2x},${p2y}`}
                    fill={isTampered ? "url(#fovTamperGrad)" : "url(#fovGrad)"}
                    stroke={isTampered ? "rgba(245, 158, 11, 0.5)" : "rgba(6, 182, 212, 0.4)"}
                    strokeWidth="1"
                    strokeDasharray={isTampered ? "3 3" : undefined}
                    className="opacity-75 group-hover:opacity-100 transition-opacity"
                  />
                )}

                {/* Camera Pin Body */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="10"
                  fill={isTampered ? "#78350f" : isDegraded ? "#451a03" : "#0f172a"}
                  stroke={isTampered ? "#f59e0b" : "#06b6d4"}
                  strokeWidth="2"
                  className="group-hover:scale-125 transition-transform origin-center"
                />

                <circle
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill={isTampered ? "#f59e0b" : "#22d3ee"}
                />

                {/* Camera Label Tag */}
                <rect
                  x={cx - 30}
                  y={cy + 13}
                  width="60"
                  height="16"
                  rx="3"
                  fill="rgba(9, 15, 26, 0.9)"
                  stroke={isTampered ? "rgba(245, 158, 11, 0.6)" : "rgba(51, 65, 85, 0.8)"}
                  strokeWidth="1"
                />
                <text
                  x={cx}
                  y={cy + 24}
                  textAnchor="middle"
                  fill={isTampered ? "#fbbf24" : "#e2e8f0"}
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  {cam.id}
                </text>
              </g>
            );
          })}

          {/* Active Incident Markers */}
          {layers.incidents && incidents.map(inc => {
            if (inc.status === 'RESOLVED' || inc.status === 'FALSE_POSITIVE') return null;
            const primaryCam = cameras.find(c => c.id === inc.cameraList[inc.cameraList.length - 1]) || cameras[0];
            const ix = primaryCam.mapLocation.x * 10 + 18;
            const iy = primaryCam.mapLocation.y * 6.5 - 24;

            const isCritical = inc.severity === 'CRITICAL';

            return (
              <g 
                key={inc.id}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedPin({ type: 'incident', id: inc.id });
                  selectIncident(inc.id);
                }}
              >
                <circle
                  cx={ix}
                  cy={iy}
                  r={isCritical ? "16" : "12"}
                  fill={isCritical ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)"}
                  className="animate-ping"
                />
                <circle
                  cx={ix}
                  cy={iy}
                  r="10"
                  fill={isCritical ? "#dc2626" : "#d97706"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x={ix}
                  y={iy + 3.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  !
                </text>

                {/* Hover / Status tooltip tag */}
                <g className="opacity-90 group-hover:opacity-100 transition-opacity">
                  <rect
                    x={ix + 12}
                    y={iy - 12}
                    width="120"
                    height="28"
                    rx="4"
                    fill="rgba(10, 15, 26, 0.95)"
                    stroke={isCritical ? "#ef4444" : "#f59e0b"}
                    strokeWidth="1"
                  />
                  <text x={ix + 18} y={iy + 1} fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                    {inc.id} ({inc.riskScore}/100)
                  </text>
                  <text x={ix + 18} y={iy + 12} fill="#94a3b8" fontSize="8" fontFamily="Inter">
                    {inc.title.substring(0, 18)}...
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Tactical Legend Box */}
        <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono-code text-slate-300 shadow-xl space-y-1.5 pointer-events-none">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider mb-1">
            Map Legend (SIH26187)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-red-500 border border-red-400" />
            <span>Zero Border Line (Red)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>CCTV Camera Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>Correlated Incident Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-red-400" />
            <span>Multi-Cam Intrusion Trail</span>
          </div>
        </div>

        {/* Selected Node Quick Info Card on Bottom Right */}
        {selectedPin && (
          <div className="absolute bottom-3 right-3 bg-slate-900/95 backdrop-blur border border-cyan-500/40 rounded-lg p-3 w-64 shadow-2xl z-10 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-mono-code font-bold text-cyan-300 uppercase">{selectedPin.type}: {selectedPin.id}</span>
              <button 
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 text-slate-300 text-[11px]">
              {selectedPin.type === 'camera' ? (
                <div>
                  <p>Status: <strong className="text-emerald-400">ONLINE 30 FPS</strong></p>
                  <p className="mt-1 text-slate-400">Click to open full inspection feed.</p>
                </div>
              ) : (
                <div>
                  <p className="text-red-400 font-bold">Threat Alert Active</p>
                  <p className="mt-1 text-slate-400">Click to investigate multi-camera evidence.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
