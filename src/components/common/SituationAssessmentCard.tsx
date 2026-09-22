import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, MapPin, AlertTriangle, Brain, 
  Camera, History, Lock, Radio, ChevronDown, ChevronUp, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SituationAssessmentCard: React.FC = () => {
  const { cameras, incidents, alerts, selectIncident, setActiveView } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  const flagship = incidents.find(i => i.id === 'INC-26187-01') || incidents[0];
  const onlineCams = cameras.filter(c => c.status === 'ONLINE').length;

  const assessmentPoints = [
    {
      q: '1. Is the system healthy?',
      answer: `${onlineCams}/${cameras.length} Cameras Nominal • Edge Mesh 99.4% Synchronized`,
      status: 'HEALTHY',
      icon: Activity,
      color: 'text-emerald-400',
      actionLabel: 'Inspect Nodes',
      action: () => setActiveView('system-health')
    },
    {
      q: '2. Is anything happening right now?',
      answer: 'Active Zero-Line Perimeter Intrusion in progress (Incident INC-26187-01)',
      status: 'CRITICAL',
      icon: ShieldAlert,
      color: 'text-red-400',
      actionLabel: 'Open Dossier',
      action: () => selectIncident(flagship.id)
    },
    {
      q: '3. Where is it happening?',
      answer: 'Sector Bravo • Ridge Line Overpass (GPS: 27.0384° N, 71.2031° E)',
      status: 'LOCATED',
      icon: MapPin,
      color: 'text-cyan-400',
      actionLabel: 'View on Map',
      action: () => setActiveView('tactical-map')
    },
    {
      q: '4. How serious is it?',
      answer: `Risk Score: ${flagship.riskScore}/100 • Critical Severity Level (Immediate Lethal Zone Threat)`,
      status: 'SEV_CRITICAL',
      icon: AlertTriangle,
      color: 'text-red-400',
      actionLabel: 'Risk Factors',
      action: () => selectIncident(flagship.id)
    },
    {
      q: '5. Why did AI flag it?',
      answer: 'Restricted zone breach + 32° heading toward border + cross-camera track continuity',
      status: 'XAI_EXPLAINED',
      icon: Brain,
      color: 'text-indigo-400',
      actionLabel: 'AI Reasoning',
      action: () => selectIncident(flagship.id)
    },
    {
      q: '6. What cameras are involved?',
      answer: 'CAM-01 (Highway) → CAM-04 (Access) → CAM-07 (Ridge) → CAM-09 (Zero Fence)',
      status: 'MULTI_CAM',
      icon: Camera,
      color: 'text-blue-400',
      actionLabel: 'Multi-Cam Stream',
      action: () => setActiveView('live-surveillance')
    },
    {
      q: '7. What happened before?',
      answer: '02:41 Unmarked pickup drop-off (V-201) → 02:44 Trail loitering → 02:48 Wire cut attempt',
      status: 'SEQUENCE',
      icon: History,
      color: 'text-amber-400',
      actionLabel: 'View Timeline',
      action: () => selectIncident(flagship.id)
    },
    {
      q: '8. What evidence exists?',
      answer: '3 Hashed RTSP MP4 recordings + 1 Infrared cropped facial contour (SHA-256 verified)',
      status: 'VERIFIED',
      icon: Lock,
      color: 'text-emerald-400',
      actionLabel: 'Evidence Vault',
      action: () => setActiveView('evidence')
    },
    {
      q: '9. What action should operator take?',
      answer: 'Authorize Quick Reaction Team (QRT Alpha) deployment & verify Sector B thermal camera',
      status: 'ACTION_REQUIRED',
      icon: Radio,
      color: 'text-cyan-300',
      highlight: true,
      actionLabel: 'Dispatch QRT',
      action: () => setActiveView('reports')
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all">
      {/* Assessment Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-950"
      >
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-blue-500/20 text-cyan-400 border border-blue-500/30">
            <Brain className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-tactical font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Operator 9-Point Situation Assessment</span>
              <span className="px-2 py-0.2 rounded bg-red-500/20 text-red-400 text-[10px] font-mono-code font-bold">
                SIH26187 HIERARCHY
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Operational situational awareness questions answered autonomously in seconds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-code text-slate-400 hidden sm:inline">
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* 9 Grid Tiles */}
      {isExpanded && (
        <div className="p-3.5 grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {assessmentPoints.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs font-mono-code flex flex-col justify-between transition-all ${
                  pt.highlight 
                    ? 'bg-gradient-to-br from-blue-950/60 to-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold pb-1.5 border-b border-slate-800/60 mb-2">
                    <span className="text-slate-400 truncate">{pt.q}</span>
                    <Icon className={`w-3.5 h-3.5 ${pt.color} shrink-0 ml-1`} />
                  </div>
                  <p className="text-xs font-medium text-slate-200 leading-snug">
                    {pt.answer}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${pt.color}`}>
                    {pt.status}
                  </span>
                  <button
                    onClick={pt.action}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold group"
                  >
                    <span>{pt.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
