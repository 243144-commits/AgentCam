import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, Shield, Activity, Clock, CheckCircle2, 
  Download, Sparkles, Filter, Layers 
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  // Chart datasets
  const hourlyThreatData = [
    { hour: '00:00', threats: 1, falsePositives: 4 },
    { hour: '02:00', threats: 0, falsePositives: 3 },
    { hour: '04:00', threats: 2, falsePositives: 5 },
    { hour: '06:00', threats: 1, falsePositives: 2 },
    { hour: '08:00', threats: 3, falsePositives: 1 },
    { hour: '10:00', threats: 4, falsePositives: 2 },
    { hour: '12:00', threats: 2, falsePositives: 1 },
    { hour: '14:00', threats: 8, falsePositives: 2 }, // Spike during flagship incident
    { hour: '16:00', threats: 5, falsePositives: 3 },
    { hour: '18:00', threats: 3, falsePositives: 2 },
    { hour: '20:00', threats: 6, falsePositives: 4 },
    { hour: '22:00', threats: 4, falsePositives: 3 },
  ];

  const sectorData = [
    { sector: 'Sector A (River)', count: 4, fill: '#3b82f6' },
    { sector: 'Sector B (Ridge)', count: 9, fill: '#ef4444' }, // Flagship sector
    { sector: 'Sector C (Highway)', count: 5, fill: '#f59e0b' },
    { sector: 'Sector D (Salt)', count: 2, fill: '#10b981' }
  ];

  const classData = [
    { name: 'Persons (P-series)', value: 48, color: '#38bdf8' },
    { name: 'Vehicles (V-series)', value: 24, color: '#818cf8' },
    { name: 'Filtered Wildlife', value: 18, color: '#34d399' },
    { name: 'Objects/Bags', value: 10, color: '#fbbf24' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono-code text-[11px] font-bold border border-blue-500/40 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              OPERATIONAL PERFORMANCE METRICS
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              SIH26187 Decision Verification
            </span>
          </div>
          <h1 className="text-lg font-tactical font-bold text-slate-100 mt-1">
            Border Surveillance Analytics & AI Correlation Efficacy
          </h1>
        </div>

        <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-code text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700">
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* KPI Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">FALSE POSITIVE SUPPRESSION</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-code text-emerald-400">78.4%</span>
            <span className="text-xs text-emerald-500 font-mono-code">REDUCTION</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Achieved via spatio-temporal continuity vs naive single-cam tripwires.
          </p>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">MEAN TIME TO DETECT (MTTD)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-code text-cyan-300">1.4s</span>
            <span className="text-xs text-cyan-400 font-mono-code">EDGE INFERENCE</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            YOLOv10 quantized models on edge nodes at 30 FPS.
          </p>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">OPERATOR RESPONSE SPEED</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-code text-blue-400">14.2s</span>
            <span className="text-xs text-blue-500 font-mono-code">AVG ACK</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Single-click dossier verification with XAI factor breakdown.
          </p>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">OFFLINE RESILIENCE BUFFER</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-code text-amber-400">100%</span>
            <span className="text-xs text-amber-500 font-mono-code">LOCAL SURVIVABILITY</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Zero threat telemetry loss during backhaul severance simulation.
          </p>
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Threat Events vs Suppressed False Positives over 24h */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
              24-Hour Threat Frequency & False Positive Suppression
            </h3>
            <span className="text-[10px] font-mono-code text-slate-400">HOURLY DISTRIBUTION</span>
          </div>

          <div className="h-64 w-full text-xs font-mono-code">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyThreatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Verified Correlated Threats" />
                <Line type="monotone" dataKey="falsePositives" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" name="Suppressed False Positives" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Density by Sector */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
              Incident Concentration by Border Sector
            </h3>
            <span className="text-[10px] font-mono-code text-slate-400">SECTOR LOAD</span>
          </div>

          <div className="h-64 w-full text-xs font-mono-code">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="sector" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Incidents Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Classification Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
              Detection Class Taxonomy
            </h3>
            <span className="text-[10px] font-mono-code text-slate-400">AI OBJECT CATEGORIZATION</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainable AI Risk Factor Weights Impact */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
            Risk Formulation Weights (Operational Protocol)
          </h3>
          <p className="text-xs text-slate-400">
            Current mathematical weighting applied by the decision engine to convert raw spatio-temporal detections into a 0-100 severity metric.
          </p>

          <div className="space-y-2 text-xs font-mono-code pt-1">
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">Zero-Line / Prohibited Boundary Proximity</span>
              <strong className="text-red-400 font-bold">+35 PTS MAX</strong>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">Vector Heading Toward International Border</span>
              <strong className="text-amber-400 font-bold">+20 PTS MAX</strong>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">Cross-Camera Sequential Correlation (Multi-Cam Re-ID)</span>
              <strong className="text-cyan-400 font-bold">+20 PTS MAX</strong>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">Loitering & Stationary Abandoned Package</span>
              <strong className="text-indigo-400 font-bold">+15 PTS MAX</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
