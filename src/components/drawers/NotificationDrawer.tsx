import React from 'react';
import { Bell, X, Check, ShieldAlert, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationDrawerOpen, setIsNotificationDrawerOpen, 
    alerts, acknowledgeAlert, selectIncident, setActiveView 
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-[#080d16] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="font-tactical font-bold text-sm text-slate-100 uppercase tracking-wider">
                Active Tactical Alerts
              </h3>
            </div>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alerts Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {alerts.map(alert => {
              const isCritical = alert.severity === 'CRITICAL';
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs font-mono-code transition-all space-y-1.5 ${
                    alert.acknowledged
                      ? 'bg-slate-950/40 border-slate-850 opacity-60'
                      : isCritical
                      ? 'bg-red-950/40 border-red-500/50 text-slate-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                      isCritical ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-cyan-300'
                    }`}>
                      {alert.severity} • {alert.cameraId}
                    </span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-slate-100">{alert.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{alert.message}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Check className="w-3 h-3" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400">Acknowledged</span>
                    )}

                    {alert.incidentId && (
                      <button
                        onClick={() => {
                          selectIncident(alert.incidentId!);
                          setIsNotificationDrawerOpen(false);
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs font-mono-code">
            <span className="text-slate-500">{alerts.length} Total Alerts</span>
            <button
              onClick={() => {
                setActiveView('alerts');
                setIsNotificationDrawerOpen(false);
              }}
              className="text-cyan-400 hover:underline font-bold"
            >
              Open Alert Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
