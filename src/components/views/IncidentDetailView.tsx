import React, { useState } from 'react';
import { Incident } from '../../types';
import { 
  ArrowLeft, Shield, AlertTriangle, CheckCircle2, XCircle, 
  FileText, Clock, Video, Database, Share2, Sparkles, 
  Radio, ChevronRight, Lock, ExternalLink, ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CameraFeedPlayer } from '../common/CameraFeedPlayer';

export const IncidentDetailView: React.FC = () => {
  const { 
    selectedIncident, incidents, selectIncident, setActiveView,
    updateIncidentStatus, setIsFalsePositiveModalOpen, setFalsePositiveTargetIncident,
    evidenceList, cameras, operatorName, currentRole
  } = useApp();

  const inc = selectedIncident || incidents[0];
  const isCritical = inc.severity === 'CRITICAL';
  const relatedEvidence = evidenceList.filter(e => inc.evidenceIds.includes(e.id));
  const primaryCam = cameras.find(c => c.id === inc.cameraList[inc.cameraList.length - 1]) || cameras[0];

  const [activeEvidenceTab, setActiveEvidenceTab] = useState<string>(relatedEvidence[0]?.id || 'EVD-01');
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<string | null>(inc.timeline[0]?.id || null);

  const currentEvidence = relatedEvidence.find(e => e.id === activeEvidenceTab) || relatedEvidence[0];

  const handleAcknowledge = () => {
    updateIncidentStatus(inc.id, 'ACKNOWLEDGED', `Operator acknowledged threat incident.`);
  };

  const handleEscalate = () => {
    updateIncidentStatus(inc.id, 'ESCALATED', `Escalated to Battalion QRT and Border Security HQ.`);
  };

  const handleResolve = () => {
    updateIncidentStatus(inc.id, 'RESOLVED', `Incident neutralized/resolved by ground interception patrol.`);
  };

  const handleOpenFalsePositive = () => {
    setFalsePositiveTargetIncident(inc);
    setIsFalsePositiveModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('incidents')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back to incident queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tactical font-bold text-lg text-slate-100">{inc.id}</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono-code font-bold uppercase ${
                isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'
              }`}>
                RISK: {inc.riskScore} / 100 • {inc.severity}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-slate-800 text-cyan-400 border border-slate-700 uppercase font-semibold">
                {inc.status}
              </span>
            </div>
            <h1 className="text-sm font-semibold text-slate-200 mt-0.5">{inc.title}</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {inc.status !== 'ACKNOWLEDGED' && inc.status !== 'INVESTIGATING' && inc.status !== 'ESCALATED' && inc.status !== 'RESOLVED' && (
            <button
              onClick={handleAcknowledge}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono-code text-xs font-bold transition-all shadow"
            >
              Acknowledge
            </button>
          )}

          {inc.status !== 'ESCALATED' && inc.status !== 'RESOLVED' && (
            <button
              onClick={handleEscalate}
              className="px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-300 font-mono-code text-xs font-bold transition-all"
            >
              Escalate to QRT
            </button>
          )}

          {inc.status !== 'RESOLVED' && (
            <button
              onClick={handleResolve}
              className="px-3 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono-code text-xs font-bold transition-all"
            >
              Resolve Incident
            </button>
          )}

          <button
            onClick={handleOpenFalsePositive}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-mono-code text-xs transition-all"
          >
            Mark False Positive
          </button>

          <button
            onClick={() => setActiveView('reports')}
            className="px-3 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono-code text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* 3-Column Tactical Investigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (3 cols): Incident Summary & Explainable Risk Scoring */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <h3 className="text-xs font-tactical font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Threat Assessment Breakdown</span>
            </h3>

            {/* Big Risk Gauge Score */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono-code text-slate-400">CUMULATIVE RISK</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold font-mono-code ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                    {inc.riskScore}
                  </span>
                  <span className="text-xs text-slate-400 font-mono-code">/ 100</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-mono-code font-bold uppercase ${
                isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {inc.severity}
              </span>
            </div>

            {/* Explainable Mathematical Factors */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono-code text-slate-400 block">
                CONTRIBUTING RISK FACTORS (EXPLAINABLE AI)
              </span>
              {inc.riskBreakdown.map((item, idx) => (
                <div key={idx} className="p-2 bg-slate-950/60 rounded border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between font-mono-code">
                    <span className="text-slate-200 font-semibold">{item.factor}</span>
                    <strong className="text-cyan-400">+{item.score}</strong>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Sectors and Camera List */}
            <div className="pt-2 border-t border-slate-800 text-xs font-mono-code space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">PRIMARY SECTOR:</span>
                <span className="text-slate-300 font-semibold">{inc.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ASSOCIATED TRACK:</span>
                <span className="text-cyan-400 font-bold">{inc.trackIds.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ASSOCIATED VEHICLE:</span>
                <span className="text-amber-300 font-bold">{inc.vehicleIds.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column (5 cols): Evidence Video & Snapshot Player with SHA-256 */}
        <div className="lg:col-span-5 space-y-3">
          {/* Evidence Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900/80 border border-slate-800 p-1.5 rounded-lg">
            <span className="text-[10px] font-mono-code uppercase text-slate-500 px-2 flex items-center gap-1">
              <Database className="w-3 h-3 text-cyan-400" />
              Vault:
            </span>
            {relatedEvidence.map(evd => (
              <button
                key={evd.id}
                onClick={() => setActiveEvidenceTab(evd.id)}
                className={`px-2 py-1 rounded text-xs font-mono-code transition-colors whitespace-nowrap ${
                  activeEvidenceTab === evd.id
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {evd.id} ({evd.type.split('_')[0]})
              </button>
            ))}
          </div>

          {/* Primary Evidence Player Container */}
          <div className="relative h-[340px] rounded-xl overflow-hidden border border-slate-800 bg-[#05080e]">
            {currentEvidence?.type === 'VIDEO_CLIP' || !currentEvidence ? (
              <CameraFeedPlayer camera={primaryCam} isDetailed={true} showOverlay={true} />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img
                  src={currentEvidence.previewUrl}
                  alt={currentEvidence.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 surveillance-scanline" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-xs font-mono-code text-cyan-300">
                  SNAPSHOT: {currentEvidence.cameraName} ({currentEvidence.timestamp})
                </div>
              </div>
            )}
          </div>

          {/* Cryptographic SHA-256 Integrity Verification Box */}
          {currentEvidence && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 text-xs font-mono-code">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SHA-256 EVIDENCE INTEGRITY VAULT</span>
                </div>
                <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  {currentEvidence.integrityStatus}
                </span>
              </div>

              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] text-slate-400 truncate">
                <span className="text-slate-500 block">HASH DIGEST:</span>
                <span className="text-slate-200 font-mono-code">{currentEvidence.sha256Hash}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>SIZE: {currentEvidence.fileSizeKb} KB</span>
                <span>ORIGIN: {currentEvidence.cameraName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Explainable AI "Why This Alert?" & Decision Support */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
                  Explainable AI Reasoning (XAI)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/40">
                AI CONFIDENCE: {inc.aiExplanation.confidence}%
              </span>
            </div>

            {/* Why This Alert? Summary */}
            <div className="p-3 bg-blue-950/20 border border-blue-600/30 rounded-lg text-xs space-y-1.5">
              <span className="text-[10px] uppercase font-mono-code font-bold text-cyan-300">
                WHY THIS ALERT?
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {inc.aiExplanation.summary}
              </p>
            </div>

            {/* Multi-Camera Correlation Continuity Reasoning */}
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] uppercase font-mono-code text-slate-400">
                CROSS-CAMERA CONTINUITY LOGIC
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {inc.aiExplanation.crossCameraCorrelationReason}
              </p>
            </div>

            {/* Human Verification Mandate */}
            <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>MANDATORY HUMAN-IN-THE-LOOP</span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI decisions require explicit officer verification. Autonomous lethal or kinetic actions are strictly prohibited by protocol.
              </p>
            </div>

            {/* Known Limitations */}
            <div className="text-[11px] text-slate-500 italic p-1 border-t border-slate-800/80">
              <strong className="text-slate-400 not-italic">Limitations: </strong>
              {inc.aiExplanation.limitations}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Multi-Camera Chronological Event Timeline */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
              Chronological Correlated Multi-Camera Path Timeline
            </h3>
          </div>
          <span className="text-xs font-mono-code text-slate-400">
            {inc.timeline.length} VERIFIED STAGES ACROSS {inc.cameraList.length} CAMERAS
          </span>
        </div>

        {/* Interactive Timeline Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 pt-2">
          {inc.timeline.map((event, idx) => {
            const isSelected = selectedTimelineItem === event.id;
            return (
              <div
                key={event.id}
                onClick={() => setSelectedTimelineItem(event.id)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between text-xs ${
                  isSelected
                    ? 'bg-blue-900/30 border-cyan-400 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono-code">
                    <span className="text-cyan-400 font-bold">{event.timestamp}</span>
                    <span className="text-slate-500">#{idx + 1}</span>
                  </div>
                  <strong className="text-slate-200 text-xs block mt-1 truncate">{event.cameraId}</strong>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {event.description}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-code text-slate-500">
                  <span>{event.eventType.replace('_', ' ')}</span>
                  {event.riskIncrement && event.riskIncrement > 0 ? (
                    <span className="text-red-400 font-bold">+{event.riskIncrement}</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
