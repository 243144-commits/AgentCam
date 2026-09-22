import React, { useState } from 'react';
import { 
  Settings, Sliders, Shield, Users, Lock, Download, 
  RotateCcw, CheckCircle2, AlertTriangle, FileText, Database 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    riskWeights, updateRiskWeights, auditLogs, addAuditLog, 
    currentRole, setCurrentRole, operatorName 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'RISK_WEIGHTS' | 'AUDIT_LOGS' | 'USERS'>('RISK_WEIGHTS');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleWeightChange = (key: keyof typeof riskWeights, value: number) => {
    updateRiskWeights({ [key]: value });
  };

  const handleResetWeights = () => {
    updateRiskWeights({
      proximityToZeroLine: 35,
      vectorHeadingTowardBorder: 20,
      multiCameraContinuity: 20,
      loiteringDuration: 15,
      suspiciousVehiclePresence: 10,
      opticalTamperAlert: 30
    });
    addAuditLog('CONFIG_UPDATE', 'RISK_ENGINE', 'Reset risk weights to factory SIH26187 defaults', 'SUCCESS');
  };

  const handleExportAuditCSV = () => {
    const headers = "ID,Timestamp,User,Action,Target,Status,Details\n";
    const rows = auditLogs.map(l => 
      `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.target}","${l.status}","${l.details}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AGENTC_AUDIT_LOG_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Tab Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono-code text-[11px] font-bold border border-blue-500/40">
              OPERATIONAL GOVERNANCE & AUDIT TRAIL
            </span>
            <span className="text-xs font-mono-code text-slate-400">SIH26187 Protocol</span>
          </div>
          <h1 className="text-lg font-tactical font-bold text-slate-100 mt-1">
            System Settings & Security Configuration
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('RISK_WEIGHTS')}
            className={`px-3 py-1.5 rounded text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'RISK_WEIGHTS' ? 'bg-cyan-600 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>RISK ENGINE WEIGHTS</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-3 py-1.5 rounded text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'AUDIT_LOGS' ? 'bg-cyan-600 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AUDIT TRAIL ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-3 py-1.5 rounded text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'USERS' ? 'bg-cyan-600 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>RBAC ACCESS ROLES</span>
          </button>
        </div>
      </div>

      {activeTab === 'RISK_WEIGHTS' ? (
        /* Risk Formula Tuning Sliders */
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-tactical font-bold text-slate-100 uppercase tracking-wider">
                Explainable Threat Formulation Sliders
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjusting weights dynamically re-calculates active incident threat scores across the border in real-time.
              </p>
            </div>

            <button
              onClick={handleResetWeights}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono-code text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-200 font-semibold">Proximity to Zero-Line (Lethal Zone)</span>
                <strong className="text-red-400 text-sm">+{riskWeights.proximityToZeroLine} PTS</strong>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={riskWeights.proximityToZeroLine}
                onChange={(e) => handleWeightChange('proximityToZeroLine', Number(e.target.value))}
                className="w-full accent-red-500"
              />
              <span className="text-[10px] text-slate-500 block">Applied when subject penetrates 200m international perimeter buffer.</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-200 font-semibold">Vector Heading Toward Border</span>
                <strong className="text-amber-400 text-sm">+{riskWeights.vectorHeadingTowardBorder} PTS</strong>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={riskWeights.vectorHeadingTowardBorder}
                onChange={(e) => handleWeightChange('vectorHeadingTowardBorder', Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-500 block">Trajectory analysis confirming motion angle directly toward zero line.</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-200 font-semibold">Multi-Camera Sequence (Re-ID Match)</span>
                <strong className="text-cyan-400 text-sm">+{riskWeights.multiCameraContinuity} PTS</strong>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={riskWeights.multiCameraContinuity}
                onChange={(e) => handleWeightChange('multiCameraContinuity', Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <span className="text-[10px] text-slate-500 block">Cross-camera correlation confirming coordinated continuous progress.</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-200 font-semibold">Loitering Duration & Stationary Object</span>
                <strong className="text-indigo-400 text-sm">+{riskWeights.loiteringDuration} PTS</strong>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={riskWeights.loiteringDuration}
                onChange={(e) => handleWeightChange('loiteringDuration', Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500 block">Sojourn in sensitive border sectors exceeding 120 continuous seconds.</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-200 font-semibold">Suspicious Vehicle Presence (ANPR)</span>
                <strong className="text-blue-400 text-sm">+{riskWeights.suspiciousVehiclePresence} PTS</strong>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={riskWeights.suspiciousVehiclePresence}
                onChange={(e) => handleWeightChange('suspiciousVehiclePresence', Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <span className="text-[10px] text-slate-500 block">Vehicle parked or dropping off subjects in non-designated border areas.</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-code">
                <span className="text-slate-200 font-semibold">Optical Sensor Tamper Alert</span>
                <strong className="text-amber-300 text-sm">+{riskWeights.opticalTamperAlert} PTS</strong>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={riskWeights.opticalTamperAlert}
                onChange={(e) => handleWeightChange('opticalTamperAlert', Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <span className="text-[10px] text-slate-500 block">Triggered when camera axis deflected or lens obstructed.</span>
            </div>
          </div>
        </div>
      ) : activeTab === 'AUDIT_LOGS' ? (
        /* Immutable Audit Logs Table */
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
              Cryptographically Timestamped Audit Trail
            </h3>
            <button
              onClick={handleExportAuditCSV}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono-code text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3 text-cyan-400 font-bold whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 text-slate-300 whitespace-nowrap">{log.user}</td>
                    <td className="p-3 font-bold text-slate-200 whitespace-nowrap">{log.action}</td>
                    <td className="p-3 text-slate-400 whitespace-nowrap">{log.target}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* RBAC Roles */
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
            Role-Based Access Control (RBAC) Permissions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-code">
            <div className={`p-4 rounded-xl border ${currentRole === 'OPERATOR' ? 'bg-blue-950/40 border-cyan-400 ring-1 ring-cyan-500/30' : 'bg-slate-950 border-slate-800'}`}>
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-100 text-sm">Console Operator</h4>
                {currentRole === 'OPERATOR' && <span className="px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">CURRENT</span>}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Live monitoring, acknowledge alerts, mark false positive feedback, generate reports.
              </p>
              <button
                onClick={() => setCurrentRole('OPERATOR')}
                className="mt-3 w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Switch to Operator
              </button>
            </div>

            <div className={`p-4 rounded-xl border ${currentRole === 'SUPERVISOR' ? 'bg-blue-950/40 border-cyan-400 ring-1 ring-cyan-500/30' : 'bg-slate-950 border-slate-800'}`}>
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-100 text-sm">Watch Commander</h4>
                {currentRole === 'SUPERVISOR' && <span className="px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">CURRENT</span>}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                All operator permissions + QRT tactical dispatch authorization and incident resolution sign-off.
              </p>
              <button
                onClick={() => setCurrentRole('SUPERVISOR')}
                className="mt-3 w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Switch to Commander
              </button>
            </div>

            <div className={`p-4 rounded-xl border ${currentRole === 'ADMINISTRATOR' ? 'bg-blue-950/40 border-cyan-400 ring-1 ring-cyan-500/30' : 'bg-slate-950 border-slate-800'}`}>
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-100 text-sm">System Administrator</h4>
                {currentRole === 'ADMINISTRATOR' && <span className="px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">CURRENT</span>}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                All permissions + camera RTSP calibrations, risk engine weight tuning, edge node deployment.
              </p>
              <button
                onClick={() => setCurrentRole('ADMINISTRATOR')}
                className="mt-3 w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Switch to Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
