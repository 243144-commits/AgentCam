import React, { useState } from 'react';
import { Camera, Detection } from '../../types';
import { 
  Grid, LayoutGrid, Maximize, Eye, Filter, 
  Volume2, VolumeX, Shield, Radio, Sparkles,
  Play, Pause, ArrowRight, ShieldAlert, Clock, Flame, Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CameraFeedPlayer } from '../common/CameraFeedPlayer';

export const LiveSurveillanceView: React.FC = () => {
  const { 
    setActiveView,
    cameras, detections, selectCamera, simulationState, currentScenario,
    startSimulation, pauseSimulation, stepSimulation, selectIncident,
    soundMuted, toggleSoundMuted, abandonedObjectRecord, runFlagshipScenario
  } = useApp();
  
  const [gridSize, setGridSize] = useState<1 | 4 | 6 | 9>(4);
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [showOverlays, setShowOverlays] = useState<boolean>(true);

  const currentStep = currentScenario.steps[simulationState.currentStepIndex] || currentScenario.steps[0];
  const sectors = ['ALL', 'Live Phone Unit', 'Sector A', 'Sector B', 'Sector C', 'Sector D'];

  const filteredCameras = cameras.filter(cam => {
    if (selectedSector === 'ALL') return true;
    if (selectedSector === 'Live Phone Unit') return cam.id === 'CAM-PHONE-LIVE';
    return cam.sector.includes(selectedSector);
  });

  const displayedCameras = filteredCameras.slice(0, gridSize);

  return (
    <div className="space-y-3 flex flex-col h-full">
      {/* Simulation Active Tactical Strip */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-[#080d16] border border-cyan-500/40 px-3.5 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code text-[11px] font-bold border border-cyan-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>LIVE PIPELINE</span>
          </span>

          <div className="text-xs">
            <span className="font-tactical font-bold text-slate-100 mr-2">
              {currentScenario.name}:
            </span>
            <span className="font-mono-code text-cyan-300 text-[11px]">
              Step {simulationState.currentStepIndex + 1}/{currentScenario.steps.length} — {currentStep.title} ({currentStep.cameraId})
            </span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold border ${
            currentStep.riskScore >= 80 ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' :
            currentStep.riskScore >= 50 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
            'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            RISK: {currentStep.riskScore}/100
          </span>
        </div>

        <div className="flex items-center gap-2">
          {simulationState.isRunning ? (
            <button
              onClick={pauseSimulation}
              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black text-xs font-mono-code font-bold flex items-center gap-1 shadow"
            >
              <Pause className="w-3.5 h-3.5 fill-black" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={() => startSimulation()}
              className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-mono-code font-bold flex items-center gap-1 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>RESUME</span>
            </button>
          )}

          <button
            onClick={stepSimulation}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono-code text-xs font-bold"
            title="Step to next scenario event"
          >
            STEP →
          </button>

          <button
            onClick={() => selectIncident('INC-26187-01')}
            className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-mono-code flex items-center gap-1 transition-colors"
          >
            <ShieldAlert className="w-3 h-3 text-red-400" />
            <span>INCIDENT DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl shrink-0">
        {/* Left: Sector filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-xs font-mono-code text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            SECTOR:
          </span>
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded text-xs font-mono-code transition-colors ${
                selectedSector === sec
                  ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {sec}
            </button>
          ))}
          <button
            onClick={() => setActiveView('phone-camera-lab')}
            className="ml-2 px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-mono-code text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Open Phone Camera Intelligence & Judges Demonstration Lab"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>PHONE LAB</span>
          </button>
        </div>

        {/* Right: Grid layout selector & Toggles */}
        <div className="flex items-center gap-3">
          {/* AI Overlay toggle */}
          <button
            onClick={() => setShowOverlays(prev => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono-code transition-colors ${
              showOverlays 
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40' 
                : 'text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>AI Bounding Boxes: {showOverlays ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSoundMuted}
            className={`p-1.5 rounded border transition-colors ${
              soundMuted 
                ? 'border-red-500/40 text-red-400 bg-red-950/30' 
                : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={soundMuted ? "Unmute perimeter audio" : "Mute perimeter audio"}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Grid Layout Buttons */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setGridSize(1)}
              className={`px-2 py-1 rounded text-xs font-mono-code font-bold transition-all ${
                gridSize === 1 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Single Feed"
            >
              1x1
            </button>
            <button
              onClick={() => setGridSize(4)}
              className={`px-2 py-1 rounded text-xs font-mono-code font-bold transition-all ${
                gridSize === 4 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Quad Matrix (4 Cams)"
            >
              2x2
            </button>
            <button
              onClick={() => setGridSize(6)}
              className={`px-2 py-1 rounded text-xs font-mono-code font-bold transition-all ${
                gridSize === 6 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="6 Feeds"
            >
              2x3
            </button>
            <button
              onClick={() => setGridSize(9)}
              className={`px-2 py-1 rounded text-xs font-mono-code font-bold transition-all ${
                gridSize === 9 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="9 Feeds"
            >
              3x3
            </button>
          </div>
        </div>
      </div>

      {/* Camera Matrix Grid */}
      <div className={`grid gap-3 flex-1 ${
        gridSize === 1 
          ? 'grid-cols-1 min-h-[520px]' 
          : gridSize === 4 
          ? 'grid-cols-1 md:grid-cols-2 min-h-[500px]' 
          : gridSize === 6 
          ? 'grid-cols-1 md:grid-cols-3 min-h-[500px]' 
          : 'grid-cols-1 md:grid-cols-3 min-h-[500px]'
      }`}>
        {displayedCameras.map(cam => {
          const camDets = detections.filter(d => d.cameraId === cam.id);
          return (
            <div key={cam.id} className="h-64 sm:h-72 lg:h-full min-h-[220px]">
              <CameraFeedPlayer
                camera={cam}
                detections={camDets}
                showOverlay={showOverlays}
                onSelect={() => selectCamera(cam.id)}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Surveillance Bar */}
      <div className="bg-slate-900/60 border border-slate-800 px-3 py-2 rounded-lg flex items-center justify-between text-xs font-mono-code text-slate-400 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>STREAM ENCODING: H.265 / RTSP EDGE STREAM</span>
          </span>
          <span className="hidden sm:inline">EDGE INFERENCE: YOLOv8-Custom INT8 @ 14.8ms</span>
        </div>
        <span className="text-slate-500">Click any camera tile for tripwire polygon editing, optical tamper diagnostics, and Re-ID history.</span>
      </div>
    </div>
  );
};
