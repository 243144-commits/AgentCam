import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Share2, Shield, 
  CheckCircle2, Lock, Clock, Send, Radio, AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { selectedIncident, incidents, selectIncident, operatorName, currentRole } = useApp();
  const [reportIncidentId, setReportIncidentId] = useState<string>(selectedIncident?.id || incidents[0]?.id || 'INC-26187-01');
  const [isCopied, setIsCopied] = useState(false);
  const [dispatchNotice, setDispatchNotice] = useState(false);

  const inc = incidents.find(i => i.id === reportIncidentId) || incidents[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inc, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AGENTC_REPORT_${inc.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDispatchQRT = () => {
    setDispatchNotice(true);
    setTimeout(() => setDispatchNotice(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl print:hidden">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-base font-tactical font-bold text-slate-100">
              Official Incident Dossier & Legal Evidentiary Report
            </h1>
            <p className="text-xs text-slate-400">
              Automated compilation adhering to SIH26187 Chain-of-Custody specifications
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Incident Selector */}
          <select
            value={inc.id}
            onChange={(e) => setReportIncidentId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs font-mono-code px-2.5 py-1.5 rounded-lg text-cyan-300 focus:outline-none"
          >
            {incidents.map(i => (
              <option key={i.id} value={i.id}>
                {i.id} - {i.title.substring(0, 22)}...
              </option>
            ))}
          </select>

          <button
            onClick={handleDispatchQRT}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-mono-code text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-red-400" />
            <span>{dispatchNotice ? 'DISPATCH TRANSMITTED' : 'DISPATCH TO QRT ALPHA'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-code text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-mono-code text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Printable / Viewable Structured Report Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 space-y-6 max-w-5xl mx-auto shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Report Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 print:bg-slate-200 print:text-black font-mono-code text-xs font-bold border border-blue-500/40">
                OFFICIAL BORDER SECURITY COMMAND DOSSIER
              </span>
              <span className="text-xs font-mono-code text-slate-400">SIH26187 PROTOCOL</span>
            </div>
            <h2 className="text-2xl font-tactical font-bold text-slate-100 print:text-black mt-2">
              AgentC Tactical Incident Report: {inc.id}
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Title: {inc.title}
            </p>
          </div>

          <div className="text-right font-mono-code text-xs space-y-1">
            <div>DATE/TIME: <strong className="text-slate-200 print:text-black">{inc.timestamp} IST</strong></div>
            <div>STATUS: <strong className="text-red-400">{inc.status}</strong></div>
            <div>SECTOR: <strong className="text-cyan-400 print:text-black">{inc.sector}</strong></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-tactical font-bold text-slate-300 print:text-black uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            1. Executive Tactical Summary
          </h3>
          <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed bg-slate-950/60 print:bg-slate-100 p-3.5 rounded-lg border border-slate-800/80">
            {inc.aiExplanation.summary}
          </p>
        </div>

        {/* Section 2: Threat Evaluation & Explainable Mathematical Factors */}
        <div className="space-y-3">
          <h3 className="text-xs font-tactical font-bold text-slate-300 print:text-black uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            2. Spatio-Temporal Risk Assessment (Score: {inc.riskScore}/100 - {inc.severity})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-code">
            {inc.riskBreakdown.map((r, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/60 print:bg-slate-100 rounded border border-slate-800 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-200 print:text-black">{r.factor}</span>
                  <span className="text-red-400">+{r.score} PTS</span>
                </div>
                <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Cross-Camera Re-ID Path & Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-tactical font-bold text-slate-300 print:text-black uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            3. Chronological Cross-Camera Tracking Chain
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code">
              <thead className="bg-slate-950 print:bg-slate-200 text-slate-400 print:text-black border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Camera ID</th>
                  <th className="p-2.5">Event Description</th>
                  <th className="p-2.5">Risk Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                {inc.timeline.map((evt, idx) => (
                  <tr key={idx} className="text-slate-300 print:text-black">
                    <td className="p-2.5 font-bold text-cyan-400 print:text-black">{evt.timestamp}</td>
                    <td className="p-2.5 font-bold">{evt.cameraId}</td>
                    <td className="p-2.5">{evt.description}</td>
                    <td className="p-2.5 text-red-400 font-bold">
                      {evt.riskIncrement ? `+${evt.riskIncrement}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Cryptographic Evidence Integrity Sign-off */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h3 className="text-xs font-tactical font-bold text-slate-300 print:text-black uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            4. Evidentiary Chain of Custody & Cryptographic Hash Verification
          </h3>
          <p className="text-xs text-slate-400 print:text-slate-600 leading-relaxed">
            All surveillance clips and high-resolution crops referenced in this incident have been hashed using standard SHA-256 upon edge frame ingestion. Video files are preserved in the immutable Evidence Vault under SIH26187 tamper-evident rules.
          </p>
        </div>

        {/* Section 5: Operator Sign-Off & Approvals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs font-mono-code">
          <div className="p-3 bg-slate-950 print:bg-slate-100 rounded border border-slate-800 space-y-2">
            <span className="text-slate-500 uppercase text-[10px] block">REPORT PREPARED BY:</span>
            <p className="text-slate-200 print:text-black font-bold">{operatorName}</p>
            <p className="text-slate-400">Role: {currentRole} • Sector B Watch Console</p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] pt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>DIGITALLY SIGNED & TIMESTAMPED</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 print:bg-slate-100 rounded border border-slate-800 space-y-2">
            <span className="text-slate-500 uppercase text-[10px] block">BATTALION COMMAND REVIEW:</span>
            <p className="text-slate-200 print:text-black font-bold">COMMANDER A. SHARMA (BSF HQ)</p>
            <p className="text-slate-400">Authorized QRT Alpha Sector Deployment</p>
            <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] pt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>COMMAND AUTH CODE: BSF-2026-9912A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
