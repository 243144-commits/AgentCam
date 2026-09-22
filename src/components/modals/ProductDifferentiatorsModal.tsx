import React, { useState } from 'react';
import { 
  X, Shield, GitMerge, Brain, Activity, WifiOff, Camera, 
  Flame, Lock, UserCheck, TrendingUp, Play, ArrowRight, CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductDifferentiatorsModal: React.FC = () => {
  const { 
    isDifferentiatorsModalOpen, setIsDifferentiatorsModalOpen, 
    setActiveView, selectIncident, startSimulation 
  } = useApp();

  const [activeCapIndex, setActiveCapIndex] = useState(0);

  if (!isDifferentiatorsModalOpen) return null;

  const capabilities = [
    {
      num: '01',
      title: 'Multi-Camera Event Correlation',
      tagline: 'Stitching isolated CCTV streams into continuous single-threat narratives',
      icon: GitMerge,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      challenge: 'Traditional CCTV shows disconnected monitor tiles. When a target leaves camera 1, the operator loses sight or must manually hunt across 200 monitors.',
      solution: 'AgentC uses spatiotemporal graph correlation and Re-ID feature vectors to link feeds (CAM-01 → CAM-04 → CAM-07 → CAM-09) into a unified intrusion track without requiring high-bandwidth facial recognition.',
      actionText: 'View Correlated Incident Dossier',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        selectIncident('INC-26187-01');
      }
    },
    {
      num: '02',
      title: 'Explainable Risk Scoring',
      tagline: 'Transparent 0–100 risk scores with human-readable factor weights',
      icon: Brain,
      color: 'text-indigo-400',
      border: 'border-indigo-500/40',
      challenge: 'Black-box AI models output cryptic confidence scores (e.g., "0.87 probability") without explaining why an alert was triggered, eroding operator trust.',
      solution: 'AgentC calculates risk scores with a transparent mathematical breakdown: Restricted Zone (+30), Heading Toward Border (+20), Multi-Camera Track Continuity (+15), Night-time Condition (+10), and Anomaly Vector (+16). Operators inspect every factor.',
      actionText: 'Inspect Risk Factor Breakdown',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        selectIncident('INC-26187-01');
      }
    },
    {
      num: '03',
      title: 'Behaviour Intelligence',
      tagline: 'Detecting subtle precursor threats before physical perimeter breach',
      icon: Activity,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      challenge: 'Simple motion sensors generate false alarms for wind or animals and only trigger after the fence is already cut or crossed.',
      solution: 'AgentC analyzes trajectory vectors, loitering velocity, sudden directional shifts toward restricted border lines, and vehicle rendezvous drops (V-201 drop-off) prior to physical boundary contact.',
      actionText: 'Explore Behavior Trajectories',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        setActiveView('intelligence');
      }
    },
    {
      num: '04',
      title: 'Edge / Low-Connectivity Operation',
      tagline: 'Autonomous localized inference with resilient store-and-forward sync',
      icon: WifiOff,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      challenge: 'Remote border outposts experience frequent satellite and fiber cutoffs. Cloud-dependent video analytics completely crash when backhaul is lost.',
      solution: 'AgentC edge nodes (Jetson / TensorRT) run on-premise inference and buffer detections in encrypted local NVMe SQLite storage. When connectivity restores, events seamlessly synchronize with HQ.',
      actionText: 'Test Edge Disconnection & Sync',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        setActiveView('system-health');
      }
    },
    {
      num: '05',
      title: 'Camera Health Intelligence',
      tagline: 'Automated detection of sabotage, lens obstruction, and tampering',
      icon: Camera,
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      challenge: 'Adversaries spray paint lenses, misalign optical angles, or cut power to create blind spots that go unnoticed until after an intrusion occurs.',
      solution: 'AgentC runs structural similarity (SSIM) and frame-entropy audits to immediately raise TAMPER_ALERT when a camera angle is rotated, blurred, obscured, or frozen.',
      actionText: 'View Camera Health & Tamper Grid',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        setActiveView('cameras');
      }
    },
    {
      num: '06',
      title: 'Smart Alert Prioritization',
      tagline: 'Eliminating alert fatigue by suppressing redundant low-threat pings',
      icon: Flame,
      color: 'text-red-400',
      border: 'border-red-500/40',
      challenge: 'Operators face 5,000+ alerts per day from blowing bushes and stray animals, causing critical alerts to be missed in the noise.',
      solution: 'AgentC consolidates recurring detections from the same object into a single correlated incident lifecycle, only escalating severity when high-risk factors accumulate.',
      actionText: 'Open Alert Priority Queue',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        setActiveView('incidents');
      }
    },
    {
      num: '07',
      title: 'Evidence Integrity & Chain of Custody',
      tagline: 'Cryptographic SHA-256 hashing and legal court-admissible dossiers',
      icon: Lock,
      color: 'text-teal-400',
      border: 'border-teal-500/40',
      challenge: 'Raw video files stored on local DVRs can be altered or disputed in legal inquiries due to missing chain-of-custody verification.',
      solution: 'AgentC stamps all keyframes and incident video clips with SHA-256 digital hashes, tamper seals, and ISO-8601 metadata directly exportable into court-ready Incident Dossiers.',
      actionText: 'View Evidence Vault & Hashes',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        setActiveView('evidence');
      }
    },
    {
      num: '08',
      title: 'Human-in-the-Loop Decisions',
      tagline: 'Active-learning feedback loops for continuous model calibration',
      icon: UserCheck,
      color: 'text-blue-400',
      border: 'border-blue-500/40',
      challenge: 'Traditional AI solutions offer no way for operators to teach the model when it makes a mistake (e.g. desert mirages or thermal reflections).',
      solution: 'Operators can flag false alarms with structured feedback (Foliage, Wildlife, Weather, Glare). AgentC logs this in an active-learning registry to automatically tune edge confidence thresholds.',
      actionText: 'Review Operator Audit & Feedback',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        setActiveView('settings');
      }
    },
    {
      num: '09',
      title: 'Predictive Risk Estimation',
      tagline: 'Forward extrapolation of projected boundary interception points',
      icon: TrendingUp,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      challenge: 'Perimeter systems only notify where a target was, leaving QRT commanders guessing where to deploy intercept squads.',
      solution: 'AgentC uses linear Kalman filters and terrain-elevation vectors to project a target&apos;s likely perimeter intercept point 90 seconds in advance, guiding QRT deployment before the fence line is breached.',
      actionText: 'Inspect Tactical Vector Map',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        setActiveView('tactical-map');
      }
    },
    {
      num: '10',
      title: 'Simulation-Driven Command Center',
      tagline: 'High-fidelity operational rehearsal and stress-testing laboratory',
      icon: Play,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      challenge: 'Security commanders cannot wait for a real hostile intrusion to evaluate how their personnel and camera networks perform under pressure.',
      solution: 'AgentC includes a complete Simulation Lab featuring the flagship "Coordinated Border Intrusion" scenario, allowing step-by-step playback, speed control, and live stress testing.',
      actionText: 'Launch Simulation Lab (WOW Demo)',
      onAction: () => {
        setIsDifferentiatorsModalOpen(false);
        setActiveView('simulation-lab');
        startSimulation('SCENARIO-WOW');
      }
    }
  ];

  const activeCap = capabilities[activeCapIndex];
  const ActiveIcon = activeCap.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-[#090f1a] border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-tactical font-bold text-slate-100">
                  AgentC Integrated Capability Set
                </h2>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  10 CORE DIFFERENTIATORS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transforming legacy border CCTV into an intelligent decision-support platform (SIH26187)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDifferentiatorsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left sidebar list + Right detail view */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: List of 10 Capabilities */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/50 overflow-y-auto p-2.5 space-y-1">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              const isSelected = activeCapIndex === idx;
              return (
                <button
                  key={cap.num}
                  onClick={() => setActiveCapIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border border-cyan-500/50 text-slate-100 shadow-sm'
                      : 'border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-xs font-mono-code font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {cap.num}
                  </span>
                  <div className="flex-1 truncate">
                    <div className="text-xs font-semibold truncate leading-tight">{cap.title}</div>
                  </div>
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? cap.color : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: In-depth breakdown of selected differentiator */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-gradient-to-br from-[#090f1a] to-[#0d1527]">
            {/* Header info */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-slate-900 border ${activeCap.border} ${activeCap.color} shrink-0`}>
                <ActiveIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    CAPABILITY {activeCap.num} OF 10
                  </span>
                </div>
                <h3 className="text-lg font-tactical font-bold text-white">
                  {activeCap.title}
                </h3>
                <p className="text-xs font-mono-code text-cyan-300">
                  {activeCap.tagline}
                </p>
              </div>
            </div>

            {/* Comparison Cards: The Operational Challenge vs AgentC Technical Solution */}
            <div className="space-y-3">
              {/* Existing Failure */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1.5">
                <div className="text-xs font-mono-code text-red-400 uppercase font-bold tracking-wider">
                  The Problem with Existing CCTV Platforms
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeCap.challenge}
                </p>
              </div>

              {/* AgentC Breakthrough */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="text-xs font-mono-code text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AgentC Integrated Solution</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeCap.solution}
                </p>
              </div>
            </div>

            {/* Action link */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Experience this capability live in the platform
              </span>
              <button
                onClick={activeCap.onAction}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tactical font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>{activeCap.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-slate-400">
          <span>AgentC • AI-Powered Border Video Analytics & Command Platform</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsDifferentiatorsModalOpen(false);
                setActiveView('phone-camera-lab');
              }}
              className="px-3 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-bold transition-colors flex items-center gap-1.5"
            >
              <span>📱 Open Phone Camera Lab</span>
            </button>
            <button
              onClick={() => setIsDifferentiatorsModalOpen(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              Close Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
