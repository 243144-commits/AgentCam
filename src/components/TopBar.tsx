import React from 'react';
import { 
  Search, Bell, Shield, Radio, Wifi, WifiOff, 
  RefreshCw, User, ChevronDown, AlertTriangle, ShieldCheck,
  Sparkles, Plus, LogOut, Crosshair, Camera as CameraIcon,
  Volume2, VolumeX, Flame, Smartphone
} from 'lucide-react';
import { useApp, UserRole } from '../context/AppContext';

export const TopBar: React.FC = () => {
  const { 
    setActiveView,
    cameras, incidents, alerts, isEdgeModeIsolated, offlineBufferedCount,
    isSyncingEdge, toggleEdgeMode, triggerEdgeSync, currentRole, setCurrentRole,
    operatorName, setIsSearchModalOpen, setIsNotificationDrawerOpen,
    setIsDifferentiatorsModalOpen, setIsAddCameraModalOpen, setIsCreateZoneModalOpen,
    runFlagshipScenario, soundMuted, toggleSoundMuted, kpis,
    logout
  } = useApp();

  const onlineCameras = kpis.activeCamerasCount;
  const criticalCount = kpis.criticalAlertsCount;
  const unreadAlerts = kpis.unacknowledgedAlertsCount;

  return (
    <header className="h-14 bg-[#080d16] border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Left: Operational Status Badge & Quick Telemetry */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Threat Level Badge */}
        <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded border text-xs font-mono-code font-bold uppercase tracking-wider ${
          criticalCount > 0
            ? 'bg-red-950/60 border-red-500/50 text-red-400'
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${criticalCount > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
          <span className="hidden sm:inline">{criticalCount > 0 ? `THREAT: CRITICAL (${criticalCount} BREACH)` : 'STATUS: ELEVATED PATROL'}</span>
          <span className="sm:hidden">{criticalCount > 0 ? 'CRITICAL' : 'PATROL'}</span>
        </div>

        {/* Simulation Mode Badge (Req #54) */}
        <div 
          title="All displayed surveillance data is simulated for demonstration."
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono-code text-[11px]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-bold">SIMULATION MODE</span>
          <span className="hidden xl:inline text-amber-400/80 text-[10px]">• Demo data only</span>
        </div>

        {/* Camera Status */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono-code text-slate-400 border-l border-slate-800 pl-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>CAMS: <strong className="text-slate-200">{onlineCameras}/{cameras.length}</strong></span>
        </div>

        {/* Edge / Bandwidth Mode status */}
        <div className="hidden md:flex items-center gap-2 border-l border-slate-800 pl-3">
          <button
            onClick={toggleEdgeMode}
            title="Click to toggle Edge Offline Mode simulation"
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono-code transition-colors border ${
              isEdgeModeIsolated 
                ? 'bg-amber-950/60 text-amber-400 border-amber-500/40 hover:bg-amber-900/40' 
                : 'bg-blue-950/40 text-blue-300 border-blue-600/30 hover:bg-blue-900/40'
            }`}
          >
            {isEdgeModeIsolated ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isEdgeModeIsolated ? `ISOLATED (${offlineBufferedCount})` : 'EDGE ON'}</span>
          </button>

          {isEdgeModeIsolated && offlineBufferedCount > 0 && (
            <button
              onClick={triggerEdgeSync}
              disabled={isSyncingEdge}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono-code hover:bg-amber-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingEdge ? 'animate-spin' : ''}`} />
              <span>{isSyncingEdge ? 'SYNCING...' : 'SYNC'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Center/Right: Flagship Demo, 10 Capabilities, Sound, Quick Actions, Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Phone Camera Lab Quick Button */}
        <button
          onClick={() => setActiveView('phone-camera-lab')}
          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 text-xs font-tactical font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
          title="Open Phone Camera Intelligence & Judges Demonstration Lab"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">PHONE LAB</span>
          <span className="sm:hidden">PHONE</span>
        </button>

        {/* Requirement #20: One-Click Flagship Demo in TopBar */}
        <button
          onClick={runFlagshipScenario}
          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-red-600/30 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-tactical font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
          title="Run 14-Step Flagship Multi-Camera Intrusion Demo"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 animate-pulse" />
          <span className="hidden sm:inline">FLAGSHIP DEMO</span>
          <span className="sm:hidden">DEMO</span>
        </button>

        {/* 10 Core Capabilities Button (Req #55) */}
        <button
          onClick={() => setIsDifferentiatorsModalOpen(true)}
          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 text-xs font-tactical font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-500/10 cursor-pointer"
          title="AgentC 10 Core Product Capabilities & Architecture"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">10 CAPABILITIES</span>
          <span className="md:hidden">Diffs</span>
        </button>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={toggleSoundMuted}
          className={`p-1.5 rounded-lg border transition-colors ${
            soundMuted 
              ? 'bg-red-950/40 border-red-500/40 text-red-400' 
              : 'bg-slate-900/80 border-slate-800 text-cyan-400 hover:text-cyan-300'
          }`}
          title={soundMuted ? 'Tactical Audio Muted (Click to Unmute)' : 'Tactical Audio Active (Click to Mute)'}
        >
          {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Quick Add Camera */}
        <button
          onClick={() => setIsAddCameraModalOpen(true)}
          className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-mono-code transition-colors"
          title="Add New Camera Stream"
        >
          <CameraIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>+ Cam</span>
        </button>

        {/* Quick Create Zone */}
        <button
          onClick={() => setIsCreateZoneModalOpen(true)}
          className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-red-400 text-xs font-mono-code transition-colors"
          title="Create Virtual Surveillance Zone"
        >
          <Crosshair className="w-3.5 h-3.5 text-red-400" />
          <span>+ Zone</span>
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-all w-32 sm:w-44 md:w-56"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">Search CAM, plate, P-104...</span>
          <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.2 text-[10px] font-mono-code bg-slate-800 border border-slate-700 rounded text-slate-400">
            /
          </kbd>
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative p-2 rounded-md bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-mono-code font-bold flex items-center justify-center ring-2 ring-[#080d16]">
              {unreadAlerts}
            </span>
          )}
        </button>

        {/* Role & Operator Profile Selector */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-2 sm:pl-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-medium text-slate-200 leading-tight">{operatorName}</span>
            <div className="flex items-center justify-end gap-1">
              <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-wider">{currentRole}</span>
              <span className="text-[10px] text-slate-500">• SECTOR B</span>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 hover:border-cyan-500 transition-colors">
              <User className="w-4 h-4" />
            </button>

            {/* Quick Role Switch Dropdown */}
            <div className="absolute right-0 top-full mt-1.5 w-52 py-1 bg-slate-900 border border-slate-800 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-30">
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono-code text-slate-400 border-b border-slate-800">
                Switch Operational Role
              </div>
              <button
                onClick={() => setCurrentRole('OPERATOR')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                  currentRole === 'OPERATOR' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>Console Operator</span>
                {currentRole === 'OPERATOR' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
              <button
                onClick={() => setCurrentRole('SUPERVISOR')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                  currentRole === 'SUPERVISOR' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>Watch Commander</span>
                {currentRole === 'SUPERVISOR' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>
              <button
                onClick={() => setCurrentRole('ADMINISTRATOR')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                  currentRole === 'ADMINISTRATOR' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>System Administrator</span>
                {currentRole === 'ADMINISTRATOR' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
              </button>

              <div className="border-t border-slate-800 mt-1 pt-1">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Console / Return to Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

