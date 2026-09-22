import React, { useState } from 'react';
import { Incident, Severity, IncidentStatus } from '../../types';
import { 
  ShieldAlert, Filter, Search, Clock, ChevronRight, 
  AlertTriangle, CheckCircle, ShieldCheck, Flame, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IncidentsView: React.FC = () => {
  const { incidents, selectIncident, setActiveView } = useApp();
  const [severityFilter, setSeverityFilter] = useState<'ALL' | Severity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [search, setSearch] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesSearch = inc.title.toLowerCase().includes(search.toLowerCase()) ||
                          inc.id.toLowerCase().includes(search.toLowerCase()) ||
                          inc.sector.toLowerCase().includes(search.toLowerCase()) ||
                          inc.trackIds.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident, P-104, sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs font-mono-code px-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Filter */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-1 rounded text-xs font-mono-code transition-colors ${
                  severityFilter === sev ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 text-xs font-mono-code px-2.5 py-1.5 rounded-lg text-cyan-300 focus:outline-none"
          >
            <option value="ALL">All Statuses ({incidents.length})</option>
            <option value="NEW">New</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
            <option value="FALSE_POSITIVE">False Positive</option>
          </select>
        </div>
      </div>

      {/* Incidents List Cards */}
      <div className="space-y-3">
        {filteredIncidents.map(inc => {
          const isCritical = inc.severity === 'CRITICAL';
          const isHigh = inc.severity === 'HIGH';

          return (
            <div
              key={inc.id}
              onClick={() => selectIncident(inc.id)}
              className={`p-4 rounded-xl border bg-slate-900/80 hover:bg-slate-850 cursor-pointer transition-all ${
                isCritical 
                  ? 'border-red-500/60 ring-1 ring-red-500/30' 
                  : isHigh 
                  ? 'border-amber-500/40' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left: Badges, Title & Sector */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono-code font-bold uppercase tracking-wider ${
                      isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      THREAT SCORE: {inc.riskScore}/100 • {inc.severity}
                    </span>

                    <span className="text-xs font-mono-code text-slate-300 font-bold">{inc.id}</span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code uppercase font-semibold ${
                      inc.status === 'INVESTIGATING' ? 'bg-cyan-500/20 text-cyan-300' :
                      inc.status === 'ESCALATED' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                      inc.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' :
                      inc.status === 'FALSE_POSITIVE' ? 'bg-slate-800 text-slate-400' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {inc.status}
                    </span>

                    <span className="text-xs font-mono-code text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {inc.timestamp}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-100 hover:text-cyan-300 transition-colors">
                    {inc.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                    {inc.aiExplanation.summary}
                  </p>
                </div>

                {/* Right: Camera Sequence, Evidence Count & Investigate Action */}
                <div className="flex md:flex-col items-end justify-between gap-2 shrink-0 border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                  <div className="text-right text-[11px] font-mono-code">
                    <span className="text-slate-500 block">CORRELATED SEQUENCE:</span>
                    <span className="text-cyan-400 font-bold">{inc.cameraList.join(' → ')}</span>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-cyan-300 text-xs font-mono-code font-bold flex items-center gap-1 transition-all">
                    <span>Investigate Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
