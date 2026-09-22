import React from 'react';
import { 
  Camera, AlertTriangle, ShieldCheck, Activity, Users, Car, 
  Flame, Radio, ArrowRight, ShieldAlert, Clock, ChevronRight, Play,
  Plus, Crosshair, Map, FileText, BarChart2, Sparkles, Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TacticalMapCanvas } from '../common/TacticalMapCanvas';
import { SituationAssessmentCard } from '../common/SituationAssessmentCard';

export const OverviewView: React.FC = () => {
  const { 
    cameras, incidents, alerts, tracks, vehicles, selectIncident, 
    setActiveView, startSimulation, simulationState, runFlagshipScenario, kpis: liveKpis,
    setIsAddCameraModalOpen, setIsCreateZoneModalOpen, setIsDifferentiatorsModalOpen 
  } = useApp();

  const onlineCameras = liveKpis.activeCamerasCount;
  const offlineCameras = cameras.length - onlineCameras;
  const activeIncidents = incidents.filter(i => ['NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'ESCALATED'].includes(i.status));
  const criticalAlerts = liveKpis.criticalAlertsCount;
  const activePersons = tracks.filter(t => t.class === 'person' && t.status === 'ACTIVE').length;
  const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE_SEARCH').length;
  const flagshipIncident = incidents.find(i => i.id === 'INC-26187-01') || incidents[0];

  const kpiCards = [
    { label: 'Cameras Online', value: `${onlineCameras}/${cameras.length}`, sub: `${Math.round((onlineCameras / Math.max(1, cameras.length)) * 100)}% operational`, icon: Camera, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Cameras Degraded/Offline', value: `${offlineCameras}`, sub: offlineCameras > 0 ? 'CAM-14 Tamper alert' : 'All clear', icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'Active Incidents', value: `${activeIncidents.length}`, sub: 'Under investigation', icon: ShieldAlert, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'Critical Alerts', value: `${criticalAlerts}`, sub: criticalAlerts > 0 ? 'Zero-Line Breach' : 'Patrol nominal', icon: Flame, color: 'text-red-400', border: 'border-red-500/40', pulse: criticalAlerts > 0 },
    { label: 'Persons Tracked', value: `${activePersons}`, sub: 'Anonymous IDs (P-104)', icon: Users, color: 'text-blue-400', border: 'border-blue-500/30' },
    { label: 'Vehicles Tracked', value: `${activeVehicles}`, sub: 'ANPR consensus active', icon: Car, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { label: 'Current Threat Score', value: `${flagshipIncident.riskScore} / 100`, sub: flagshipIncident.riskScore >= 80 ? 'SECTOR B CRITICAL' : 'ELEVATED WATCH', icon: Flame, color: 'text-red-400', border: 'border-red-500/40', badge: flagshipIncident.severity },
    { label: 'Edge Bandwidth Saved', value: `${liveKpis.bandwidthSavedPct}%`, sub: `${liveKpis.edgeNodesOnlineCount}/4 Nodes Online`, icon: Activity, color: 'text-emerald-400', border: 'border-emerald-500/30' }
  ];

  return (
    <div className="space-y-4">
      {/* Simulation Mode Disclaimer Bar (Req #54) */}
      <div className="px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between text-xs font-mono-code">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <strong className="tracking-wide">SIMULATION MODE:</strong>
          <span>All displayed surveillance data is simulated for demonstration purposes (SIH26187 Research Prototype).</span>
        </div>
        <button
          onClick={() => setIsDifferentiatorsModalOpen(true)}
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 font-bold shrink-0 ml-2"
        >
          <Sparkles className="w-3 h-3" />
          <span>View 10 Core Capabilities</span>
        </button>
      </div>

      {/* Top Banner: SIH26187 Operational Header */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-[#090f1a] border border-blue-600/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono-code text-[11px] font-bold border border-blue-500/40">
              SMART INDIA HACKATHON 2026 • SIH26187
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              CCTV AI Video Analytics Layer
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-tactical font-bold text-slate-100 tracking-wide">
            AgentC Tactical Border Operations Center
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl">
            Autonomous multi-camera correlation platform converting raw CCTV feeds into continuous threat assessment, anonymous track continuity, and explainable decision dossiers.
          </p>
        </div>

        {/* Action Button: Launch Flagship WOW Demo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={runFlagshipScenario}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-tactical font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-red-500/20 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>RUN FLAGSHIP DEMO</span>
          </button>

          <button
            onClick={() => selectIncident('INC-26187-01')}
            className="px-3.5 py-2 rounded-lg bg-red-950/80 hover:bg-red-900/80 border border-red-500/50 text-red-300 font-mono-code text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>INSPECT B-1042 (RISK {flagshipIncident.riskScore})</span>
          </button>
        </div>
      </div>

      {/* Command Center Quick Actions Bar (Req #56) */}
      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400 px-1">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">Command Actions:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Camera */}
          <button
            onClick={() => setIsAddCameraModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Camera</span>
          </button>

          {/* Create Zone */}
          <button
            onClick={() => setIsCreateZoneModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5 text-red-400" />
            <span>Create Zone</span>
          </button>

          {/* Start Simulation */}
          <button
            onClick={() => {
              setActiveView('simulation-lab');
              startSimulation('SCENARIO-WOW');
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono-code flex items-center gap-1.5 border border-cyan-500/40 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>Start Simulation</span>
          </button>

          {/* View Critical Alerts */}
          <button
            onClick={() => setActiveView('alerts' as any)}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 text-xs font-mono-code flex items-center gap-1.5 border border-red-500/30 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>View Critical Alerts ({criticalAlerts})</span>
          </button>

          {/* Open Tactical Map */}
          <button
            onClick={() => setActiveView('tactical-map')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Tactical Map</span>
          </button>

          {/* Generate Report */}
          <button
            onClick={() => setActiveView('reports')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Generate Report</span>
          </button>

          {/* Open Analytics */}
          <button
            onClick={() => setActiveView('analytics')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Analytics</span>
          </button>
        </div>
      </div>

      {/* 8 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className={`bg-slate-900/70 border ${kpi.border} rounded-lg p-3 flex flex-col justify-between transition-all hover:bg-slate-900`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono-code text-slate-400 truncate">{kpi.label}</span>
                <Icon className={`w-3.5 h-3.5 ${kpi.color} ${kpi.pulse ? 'animate-pulse' : ''}`} />
              </div>
              <div className="my-1.5 flex items-baseline gap-1.5">
                <span className={`text-lg font-bold font-mono-code ${kpi.color}`}>{kpi.value}</span>
                {kpi.badge && (
                  <span className="text-[9px] font-mono-code px-1 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                    {kpi.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 truncate">{kpi.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Operator 9-Point Situation Assessment (Req #58) */}
      <SituationAssessmentCard />

      {/* Main Grid: Interactive Tactical Map + Live Correlated Incident Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Live Tactical Map */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-sm font-tactical font-bold text-slate-200 uppercase tracking-wider">
                Live Tactical Map & Virtual Tripwires
              </h2>
            </div>
            <button
              onClick={() => setActiveView('tactical-map')}
              className="text-xs font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Screen View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <TacticalMapCanvas height="h-[460px]" />
        </div>

        {/* Right 1 Col: Active Correlated Incidents Dossier Queue */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-sm font-tactical font-bold text-slate-200 uppercase tracking-wider">
                Correlated Incidents ({activeIncidents.length})
              </h2>
            </div>
            <button
              onClick={() => setActiveView('incidents')}
              className="text-xs font-mono-code text-slate-400 hover:text-cyan-300"
            >
              View All
            </button>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
            {activeIncidents.map(inc => {
              const isCritical = inc.severity === 'CRITICAL';
              return (
                <div
                  key={inc.id}
                  onClick={() => selectIncident(inc.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all bg-slate-900/80 hover:bg-slate-800/90 ${
                    isCritical 
                      ? 'border-red-500/60 ring-1 ring-red-500/20' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                        isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        RISK {inc.riskScore} • {inc.severity}
                      </span>
                      <span className="text-xs font-mono-code text-slate-400">{inc.id}</span>
                    </div>

                    <span className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {inc.timestamp}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors">
                    {inc.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {inc.aiExplanation.summary}
                  </p>

                  {/* Multi-Camera Path Sequence Preview */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-code">
                    <div className="flex items-center gap-1 text-cyan-400">
                      <span>PATH:</span>
                      <span>{inc.cameraList.join(' → ')}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}

            {/* Quick Tactical Action Card */}
            <div className="p-3 bg-blue-950/20 border border-blue-600/30 rounded-lg text-xs space-y-1.5">
              <div className="font-mono-code font-bold text-cyan-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>QRT SQUAD DISPATCH READY</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Quick Reaction Team Bravo at Outpost 02 is armed with thermal coordinates for Track P-104.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
