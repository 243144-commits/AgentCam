import React from 'react';
import { 
  LayoutDashboard, Video, Cpu, ShieldAlert, Map, Flame, 
  Camera, Car, Users, Database, FileText, BarChart3, 
  FlaskConical, Activity, Settings, Radio, ChevronRight,
  Sparkles, LogOut, Smartphone
} from 'lucide-react';
import { useApp, AppView } from '../context/AppContext';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  hotkey?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeView, setActiveView, incidents, alerts, simulationState, 
    isEdgeModeIsolated, setIsDifferentiatorsModalOpen, logout 
  } = useApp();

  const criticalIncidentsCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'FALSE_POSITIVE').length;
  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live-surveillance', label: 'Live Surveillance', icon: Video, badge: '10 FEEDS' },
    { 
      id: 'phone-camera-lab', 
      label: 'Phone Camera Lab', 
      icon: Smartphone, 
      badge: 'JUDGES DEMO',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
    },
    { id: 'intelligence', label: 'Intelligence', icon: Cpu },
    { 
      id: 'incidents', 
      label: 'Incidents', 
      icon: ShieldAlert, 
      badge: criticalIncidentsCount > 0 ? `${criticalIncidentsCount} CRIT` : incidents.length,
      badgeColor: criticalIncidentsCount > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/40' : undefined 
    },
    { id: 'tactical-map', label: 'Tactical Map', icon: Map },
    { id: 'risk-heatmap', label: 'Risk Heatmap', icon: Flame },
    { id: 'cameras', label: 'Cameras', icon: Camera },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'persons-tracks', label: 'Persons / Tracks', icon: Users },
    { id: 'evidence', label: 'Evidence', icon: Database },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { 
      id: 'simulation-lab', 
      label: 'Simulation Lab', 
      icon: FlaskConical,
      badge: simulationState.isRunning ? 'LIVE' : 'DEMO',
      badgeColor: simulationState.isRunning ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
    },
    { 
      id: 'system-health', 
      label: 'System Health', 
      icon: Activity,
      badge: isEdgeModeIsolated ? 'EDGE' : '99.4%',
      badgeColor: isEdgeModeIsolated ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
    },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#090f1a] border-r border-slate-800/80 flex flex-col h-screen shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-600/40 text-blue-400">
          <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090f1a]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-tactical font-bold text-lg text-slate-100 tracking-wider">AgentC</span>
            <span className="text-[10px] uppercase font-mono-code px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              SIH26187
            </span>
          </div>
          <span className="text-[11px] text-slate-400 tracking-tight">Border AI Command</span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id || (activeView === 'incident-detail' && item.id === 'incidents') || (activeView === 'camera-detail' && item.id === 'cameras');

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-300 border-l-2 border-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="tracking-tight text-xs uppercase font-medium">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded font-semibold ${
                  item.badgeColor || (isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800/80 text-slate-400')
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Flagship Demo Quick Launcher & Actions */}
      <div className="p-3 border-t border-slate-800/80 bg-blue-950/20 space-y-2">
        <button
          onClick={() => {
            setActiveView('simulation-lab');
          }}
          className="w-full py-2 px-3 rounded bg-cyan-950/60 border border-cyan-600/40 hover:border-cyan-400 hover:bg-cyan-900/40 text-cyan-300 text-xs font-mono-code flex items-center justify-between transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold">WOW Demo Scenario</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => setIsDifferentiatorsModalOpen(true)}
          className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[11px] font-tactical font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>10 Core Capabilities</span>
        </button>

        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono-code border-t border-slate-800/60">
          <span>PIPELINE: ACTIVE (18ms)</span>
          <button 
            onClick={logout}
            className="hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
            title="Lock Console / Sign Out"
          >
            <LogOut className="w-3 h-3" />
            <span>LOCK</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
