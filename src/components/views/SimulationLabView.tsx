import React from 'react';
import { 
  FlaskConical, Play, Pause, RotateCcw, FastForward, 
  CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, 
  Radio, ArrowRight, Video, Flame, Database, Volume2, VolumeX,
  Layers, Clock, ShieldCheck, Zap, Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SIMULATION_SCENARIOS } from '../../data/mockData';

export const SimulationLabView: React.FC = () => {
  const { 
    simulationState, currentScenario, startSimulation, pauseSimulation, 
    resetSimulation, stepSimulation, setSimulationSpeed, jumpToSimulationStep,
    runFlagshipScenario, soundMuted, toggleSoundMuted,
    abandonedObjectRecord,
    selectIncident, selectCamera, setActiveView
  } = useApp();

  const currentStep = currentScenario.steps[simulationState.currentStepIndex] || currentScenario.steps[0];
  const progressPct = Math.round(((simulationState.currentStepIndex + 1) / currentScenario.steps.length) * 100);

  // 9-Stage Event Pipeline
  const pipelineStages = [
    { label: 'Detection', key: 'DETECTION', minStep: 0 },
    { label: 'Tracking', key: 'TRACKING', minStep: 2 },
    { label: 'Behaviour', key: 'BEHAVIOUR', minStep: 3 },
    { label: 'Correlation', key: 'CORRELATION', minStep: 6 },
    { label: 'Risk Engine', key: 'RISK', minStep: 7 },
    { label: 'Alert Queue', key: 'ALERT', minStep: 8 },
    { label: 'Incident', key: 'INCIDENT', minStep: 9 },
    { label: 'Evidence', key: 'EVIDENCE', minStep: 10 },
    { label: 'Human Action', key: 'ACTION', minStep: 11 },
  ];

  // Active pipeline stage based on current scenario step index
  const activePipelineStageIndex = Math.min(
    pipelineStages.length - 1, 
    Math.floor((simulationState.currentStepIndex / Math.max(1, currentScenario.steps.length - 1)) * (pipelineStages.length - 1))
  );

  return (
    <div className="space-y-4">
      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-[#080d16] border border-cyan-500/40 rounded-xl p-4 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code text-[11px] font-bold border border-cyan-500/40 flex items-center gap-1">
                <FlaskConical className="w-3 h-3" />
                HACKATHON DECISION SIMULATION LAB
              </span>
              <span className="text-xs font-mono-code text-slate-400">
                SIH26187 Operational Event Pipeline
              </span>
            </div>
            <h1 className="text-xl font-tactical font-bold text-slate-100 mt-1 flex items-center gap-2">
              Autonomous Border Scenario Simulation Engine
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Simulates live edge CCTV feeds into detection, spatio-temporal tracking, continuous risk accumulation, and human decision-support.
            </p>
          </div>

          {/* Simulation Controls: Play, Pause, Step, Reset, Speed, Sound */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Requirement #20: Prominent Flagship Demo Button */}
            <button
              onClick={runFlagshipScenario}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-tactical font-black text-xs flex items-center gap-2 shadow-lg shadow-red-500/20 uppercase tracking-wider"
              title="Launch complete 14-step Flagship Coordinated Intrusion"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>RUN FLAGSHIP DEMO</span>
            </button>

            {simulationState.isRunning ? (
              <button
                onClick={pauseSimulation}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-mono-code font-bold text-xs flex items-center gap-2 shadow"
              >
                <Pause className="w-4 h-4 fill-black" />
                <span>PAUSE</span>
              </button>
            ) : (
              <button
                onClick={() => startSimulation()}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-mono-code font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>RESUME</span>
              </button>
            )}

            <button
              onClick={stepSimulation}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono-code text-xs font-bold"
              title="Step forward by 1 event"
            >
              STEP →
            </button>

            <button
              onClick={resetSimulation}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
              title="Reset simulation to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSoundMuted}
              className={`p-2 rounded-lg border transition-colors ${
                soundMuted 
                  ? 'bg-red-950/60 border-red-500/40 text-red-400' 
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-300'
              }`}
              title={soundMuted ? 'Unmute tactical chimes' : 'Mute tactical chimes'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Speed Multiplier */}
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5">
              {[1, 2, 5].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-2 py-1 rounded text-xs font-mono-code font-bold transition-colors ${
                    simulationState.speedMultiplier === spd ? 'bg-cyan-600 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 9-Stage Event Pipeline Diagram (Requirement #2) */}
        <div className="mt-4 pt-3 border-t border-slate-800/90">
          <div className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
              INTELLIGENT EVENT PIPELINE LIFECYCLE
            </span>
            <span>CURRENT STATE: <strong className="text-cyan-300">{pipelineStages[activePipelineStageIndex]?.label}</strong></span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
            {pipelineStages.map((stage, idx) => {
              const isPast = idx < activePipelineStageIndex;
              const isCurrent = idx === activePipelineStageIndex;

              return (
                <div 
                  key={stage.key}
                  className={`p-1.5 rounded text-center border transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 ring-1 ring-cyan-400 text-cyan-200 font-bold scale-[1.03]'
                      : isPast
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="text-[9px] font-mono-code leading-none">0{idx + 1}</div>
                  <div className="text-[10px] font-mono-code truncate mt-0.5">{stage.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scenario Progress Meter */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <span className="text-cyan-300 font-bold">
              STEP {simulationState.currentStepIndex + 1} OF {currentScenario.steps.length}: {currentStep.title}
            </span>
            <span className="text-slate-400">{progressPct}% PROGRESS</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-red-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SIMULATION_SCENARIOS.map(scen => {
          const isSelected = scen.id === simulationState.scenarioId;
          return (
            <button
              key={scen.id}
              onClick={() => {
                startSimulation(scen.id);
                resetSimulation();
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-blue-950/80 border-cyan-400 ring-1 ring-cyan-500/30 text-slate-100 shadow-md'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono-code text-cyan-400 font-bold truncate">{scen.tag}</span>
                <span className="text-[9px] font-mono-code text-slate-500">{scen.stepsCount} steps</span>
              </div>
              <h4 className="text-xs font-semibold mt-1 truncate">{scen.name}</h4>
            </button>
          );
        })}
      </div>

      {/* Abandoned Object Specialized Live Banner (Requirement #9) */}
      {simulationState.scenarioId === 'SCENARIO-ABANDONED' && abandonedObjectRecord && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-tactical font-bold text-amber-200 uppercase">
                Temporal Dwell Analytics Engine (CAM-16 Outpost Gate)
              </div>
              <div className="text-[11px] font-mono-code text-amber-400/90 flex items-center gap-3">
                <span>Object Dwell Time: <strong className="text-white text-xs">{`0${Math.floor(abandonedObjectRecord.dwellSeconds / 60)}:${(abandonedObjectRecord.dwellSeconds % 60).toString().padStart(2, '0')}`}</strong></span>
                <span>• Threshold: <strong className="text-amber-300">{abandonedObjectRecord.status}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono-code text-[11px]">
            <span className={`px-2 py-0.5 rounded border ${abandonedObjectRecord.dwellSeconds >= 30 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
              30s Warning
            </span>
            <span className={`px-2 py-0.5 rounded border ${abandonedObjectRecord.dwellSeconds >= 60 ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
              60s Medium
            </span>
            <span className={`px-2 py-0.5 rounded border ${abandonedObjectRecord.dwellSeconds >= 90 ? 'bg-red-500/30 text-red-300 border-red-500/50 animate-pulse' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
              90s High Alert
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Left Active Step Telemetry & Right Interactive Step Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (5 cols): Real-time Telemetry & Live Incident Transition */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
                  Active Simulation Telemetry
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold border ${
                currentStep.riskScore >= 80 ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' :
                currentStep.riskScore >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                THREAT: {currentStep.riskScore}/100
              </span>
            </div>

            {/* Current Step Card */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-cyan-400 font-bold">NODE: {currentStep.cameraId}</span>
                <span className="text-slate-400">{currentStep.timestamp}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-100">{currentStep.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span>TRACK: <strong className="text-cyan-300">{currentStep.trackId}</strong></span>
                <span>CLASS: <strong className="text-slate-200">{currentStep.detectionClass}</strong></span>
              </div>
            </div>

            {/* Quick Investigation Shortcuts based on simulation */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-mono-code text-slate-500 block">
                CORRELATED ARTIFACTS IN SYSTEM:
              </span>

              <button
                onClick={() => selectIncident('INC-26187-01')}
                className="w-full p-2 rounded bg-red-950/40 hover:bg-red-900/40 border border-red-500/40 text-left text-xs text-red-200 flex items-center justify-between transition-colors font-mono-code"
              >
                <span>OPEN INCIDENT DOSSIER (INC-26187-01)</span>
                <ArrowRight className="w-3.5 h-3.5 text-red-400" />
              </button>

              <button
                onClick={() => selectCamera('CAM-09')}
                className="w-full p-2 rounded bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left text-xs text-slate-300 flex items-center justify-between transition-colors font-mono-code"
              >
                <span>INSPECT ZERO-LINE CAMERA (CAM-09)</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() => setActiveView('tactical-map')}
                className="w-full p-2 rounded bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left text-xs text-slate-300 flex items-center justify-between transition-colors font-mono-code"
              >
                <span>VIEW LIVE TACTICAL TRAIL ON MAP</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() => setActiveView('evidence')}
                className="w-full p-2 rounded bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left text-xs text-slate-300 flex items-center justify-between transition-colors font-mono-code"
              >
                <span>VERIFY SHA-256 EVIDENCE VAULT</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Step-by-Step Interactive Timeline */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>Scenario Timeline Stepper (Click any step to jump)</span>
              <span className="text-[10px] text-cyan-400 font-mono-code lowercase">active across all views</span>
            </h3>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {currentScenario.steps.map((step, idx) => {
                const isActive = idx === simulationState.currentStepIndex;
                const isPast = idx < simulationState.currentStepIndex;

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => jumpToSimulationStep(idx)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      isActive
                        ? 'bg-blue-900/30 border-cyan-400 ring-1 ring-cyan-500/40 text-slate-100 shadow-md'
                        : isPast
                        ? 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-900'
                        : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <span className="w-4 h-4 rounded-full bg-cyan-400 text-black text-[10px] font-mono-code font-bold flex items-center justify-center animate-pulse">
                          {step.stepNumber}
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 text-[10px] font-mono-code flex items-center justify-center text-slate-500">
                          {step.stepNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold truncate">{step.title}</span>
                        <span className="font-mono-code text-[11px] text-cyan-400 shrink-0 ml-2">
                          {step.cameraId} • {step.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {step.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className={`text-xs font-mono-code font-bold ${
                        step.riskScore >= 80 ? 'text-red-400' : step.riskScore >= 50 ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        RISK {step.riskScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
