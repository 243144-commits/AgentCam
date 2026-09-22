import React, { useState } from 'react';
import { Severity } from '../../types';
import { 
  Bell, AlertTriangle, ShieldAlert, CheckCircle2, 
  Volume2, VolumeX, Search, Filter, Clock, Check, ArrowRight,
  Layers, Sparkles, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, selectIncident, soundMuted, toggleSoundMuted } = useApp();
  const [severityFilter, setSeverityFilter] = useState<'ALL' | Severity>('ALL');
  const [search, setSearch] = useState('');

  const filteredAlerts = alerts.filter(a => {
    const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const titleMatch = (a.title || '').toLowerCase().includes(search.toLowerCase());
    const summaryMatch = (a.summary || '').toLowerCase().includes(search.toLowerCase());
    const sectorMatch = (a.sector || '').toLowerCase().includes(search.toLowerCase());
    return matchesSev && (titleMatch || summaryMatch || sectorMatch);
  });

  const unreadCount = alerts.filter(a => !a.acknowledged).length;

  const handleAcknowledgeAll = () => {
    alerts.forEach(a => {
      if (!a.acknowledged) acknowledgeAlert(a.id);
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-mono-code font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-base font-tactical font-bold text-slate-100">
              Perimeter Threat Alerts & Decision Queue
            </h1>
            <p className="text-xs text-slate-400">
              {unreadCount} unacknowledged operational alarms requiring human confirmation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSoundMuted}
            className={`px-3 py-1.5 rounded-lg border font-mono-code text-xs flex items-center gap-1.5 transition-colors ${
              soundMuted 
                ? 'bg-red-950/40 border-red-500/40 text-red-400' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-400'
            }`}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{soundMuted ? 'Alarms Muted' : 'Siren Active'}</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleAcknowledgeAll}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono-code text-xs font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Acknowledge All ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Requirement #5: Deduplication Demonstration Banner */}
      <div className="p-3.5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-cyan-500/40 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-tactical font-bold text-cyan-200 uppercase tracking-wider">
                Intelligent Alert Deduplication Engine Active
              </span>
              <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono-code text-[10px] font-bold">
                87.5% NOISE REDUCTION
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-3xl">
              Rather than dispatching 40 repetitive notifications for the same suspect, <strong>4 cross-camera detections (CAM-01 → CAM-04 → CAM-07 → CAM-09)</strong> were autonomously clustered into 1 coordinated Incident Dossier (INC-26187-01).
            </p>
          </div>
        </div>

        <button
          onClick={() => selectIncident('INC-26187-01')}
          className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all whitespace-nowrap"
        >
          <span>Inspect Correlated Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts, camera, sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs font-mono-code px-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded text-xs font-mono-code transition-colors ${
                severityFilter === sev ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-2.5">
        {filteredAlerts.map(alert => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.acknowledged
                  ? 'bg-slate-950/50 border-slate-800/80 text-slate-400'
                  : isCritical
                  ? 'bg-red-950/40 border-red-500/60 ring-1 ring-red-500/20 text-slate-100'
                  : isHigh
                  ? 'bg-amber-950/30 border-amber-500/40 text-slate-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.2 rounded text-[10px] font-mono-code font-bold uppercase ${
                    isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    isHigh ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-blue-500/20 text-cyan-300'
                  }`}>
                    {alert.severity}
                  </span>

                  <span className="font-mono-code font-bold text-xs text-slate-300">{alert.id}</span>
                  {alert.sourceCameras && (
                    <span className="text-xs font-mono-code text-cyan-400">[{alert.sourceCameras.join(', ')}]</span>
                  )}
                  <span className="text-[11px] font-mono-code text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>

                  {alert.acknowledged && (
                    <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono-code flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Acknowledged
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-semibold text-slate-200">{alert.title}</h4>
                <p className="text-[11px] text-slate-400">{alert.summary}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code font-semibold transition-colors border border-slate-700"
                  >
                    Acknowledge
                  </button>
                )}

                <button
                  onClick={() => selectIncident('INC-26187-01')}
                  className="px-3 py-1.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 border border-blue-500/40 text-xs font-mono-code font-bold flex items-center gap-1 transition-all"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
