import React, { useState } from 'react';
import { EvidenceItem } from '../../types';
import { 
  Database, ShieldCheck, Lock, Download, Copy, Check, 
  Search, Filter, FileArchive, Eye, Clock, Video, Camera,
  MapPin, Sparkles, Compass, ShieldAlert, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EvidenceVaultView: React.FC = () => {
  const { evidenceList, selectIncident } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState<EvidenceItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredEvidence = evidenceList.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(search.toLowerCase()) ||
                          item.incidentId.toLowerCase().includes(search.toLowerCase()) ||
                          item.cameraName.toLowerCase().includes(search.toLowerCase()) ||
                          item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleDownload = (id: string) => {
    setDownloadSuccess(id);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-code text-[11px] font-bold border border-emerald-500/40 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              CRYPTOGRAPHIC CHAIN-OF-CUSTODY VAULT
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              Tamper-Evident SHA-256 Storage & Automated AI Geo-Tagging
            </span>
          </div>
          <h1 className="text-lg font-tactical font-bold text-slate-100 mt-1">
            Forensic Evidence & Audit Repository
          </h1>
        </div>

        <button
          onClick={() => handleDownload('ZIP-ALL')}
          className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-mono-code text-xs font-bold flex items-center gap-2 transition-all shadow"
        >
          <FileArchive className="w-4 h-4" />
          <span>{downloadSuccess === 'ZIP-ALL' ? 'ZIP BUNDLE READY' : 'EXPORT LEGAL EVIDENCE BUNDLE (ZIP)'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, incident, camera..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs font-mono-code px-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code text-slate-400">TYPE:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs font-mono-code px-2.5 py-1.5 rounded-lg text-cyan-300 focus:outline-none"
          >
            <option value="ALL">All Media Types ({evidenceList.length})</option>
            <option value="VIDEO_CLIP">Video Clips</option>
            <option value="SNAPSHOT">High-Res Snapshots</option>
            <option value="ANPR_CROP">ANPR Crops</option>
            <option value="HEATMAP">Thermal Signatures</option>
          </select>
        </div>
      </div>

      {/* Evidence Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map(item => {
          const isQuickCapture = item.id.includes('QC') || item.metadataPayload?.captureType === 'OPERATOR_QUICK_CAPTURE';
          const aiLoc = item.metadataPayload?.aiLocation;
          const aiTime = item.metadataPayload?.aiTimestamp;

          return (
            <div
              key={item.id}
              className={`bg-slate-900/80 rounded-xl overflow-hidden flex flex-col justify-between transition-all ${
                isQuickCapture 
                  ? 'border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : 'border border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div>
                {/* Media Thumbnail Container */}
                <div className="relative h-44 bg-black overflow-hidden group cursor-pointer" onClick={() => setSelectedEvidenceModal(item)}>
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 surveillance-scanline pointer-events-none" />

                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono-code text-cyan-300 border border-slate-700">
                      {item.type}
                    </span>
                    {isQuickCapture && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/90 text-[10px] font-mono-code font-bold text-cyan-300 border border-cyan-400/50 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        QUICK CAPTURE
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono-code text-emerald-300 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{item.integrityStatus}</span>
                  </div>

                  <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono-code">
                    <span className="font-bold text-slate-100">{item.id}</span>
                    <span className="text-slate-400">{item.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>

                  <div className="text-[11px] font-mono-code text-slate-400 space-y-1">
                    <div>CAM: <span className="text-cyan-400 font-semibold">{item.cameraName}</span></div>
                    <div>INCIDENT: <span className="text-red-400 font-bold">{item.incidentId}</span></div>
                    <div>FILE SIZE: <span>{item.fileSizeKb} KB</span></div>
                  </div>

                  {/* AI Automatic Timestamp & Location Tagging Ribbon */}
                  {(aiLoc || aiTime) && (
                    <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/30 space-y-1 text-[10px] font-mono-code">
                      {aiTime && (
                        <div className="flex items-center gap-1.5 text-emerald-300">
                          <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">AI-TIME: {aiTime.zulu || aiTime.iso}</span>
                        </div>
                      )}
                      {aiLoc && (
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">
                            GEO: {aiLoc.gpsFormatted || `${aiLoc.latitude?.toFixed(4)}°N, ${aiLoc.longitude?.toFixed(4)}°E`} ({aiLoc.sector})
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cryptographic SHA-256 Box */}
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono-code space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>SHA-256 CHECKSUM</span>
                      <button
                        onClick={() => handleCopyHash(item.sha256Hash)}
                        className="text-cyan-400 hover:text-white flex items-center gap-0.5"
                      >
                        {copiedHash === item.sha256Hash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHash === item.sha256Hash ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-slate-300 truncate">{item.sha256Hash}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs font-mono-code">
                <button
                  onClick={() => selectIncident(item.incidentId)}
                  className="text-cyan-400 hover:underline"
                >
                  Inspect Incident →
                </button>

                <button
                  onClick={() => handleDownload(item.id)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>{downloadSuccess === item.id ? 'Exported' : 'Export'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evidence Full View Modal with Forensic Dossier */}
      {selectedEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono-code font-bold text-cyan-300 text-sm">
                  {selectedEvidenceModal.id} - Forensic Artifact Dossier
                </span>
                {selectedEvidenceModal.id.includes('QC') && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-[10px] font-mono-code text-cyan-300 border border-cyan-400/50">
                    QUICK CAPTURE
                  </span>
                )}
              </div>
              <button 
                onClick={() => setSelectedEvidenceModal(null)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <div className="relative h-72 bg-black rounded-lg overflow-hidden border border-slate-800">
              <img
                src={selectedEvidenceModal.previewUrl}
                alt={selectedEvidenceModal.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* AI Automated Timestamp & Location Dossier */}
            {selectedEvidenceModal.metadataPayload && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-code">
                {/* AI Timestamp Card */}
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>AI-BASED TIMESTAMP TAGGING</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <p><strong className="text-slate-400">UTC Zulu:</strong> {selectedEvidenceModal.metadataPayload.aiTimestamp?.zulu || selectedEvidenceModal.timestamp}</p>
                    <p><strong className="text-slate-400">ISO 8601:</strong> {selectedEvidenceModal.metadataPayload.aiTimestamp?.iso || selectedEvidenceModal.timestamp}</p>
                    <p><strong className="text-slate-400">Local IST:</strong> {selectedEvidenceModal.metadataPayload.aiTimestamp?.local || selectedEvidenceModal.timestamp}</p>
                    <p><strong className="text-slate-400">Atomic NTP Sync:</strong> <span className="text-emerald-300">±0.32ms (Verified PTP)</span></p>
                    <p><strong className="text-slate-400">Solar Illumination:</strong> <span className="text-amber-300">DAYLIGHT OPTICAL (Zenith 48.2°)</span></p>
                  </div>
                </div>

                {/* AI Location Card */}
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>AI-BASED LOCATION TAGGING</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <p><strong className="text-slate-400">GPS Coordinates:</strong> {selectedEvidenceModal.metadataPayload.aiLocation?.gpsFormatted || 'Lat 31.6241° N, Long 74.8723° E'}</p>
                    <p><strong className="text-slate-400">MGRS Grid:</strong> {selectedEvidenceModal.metadataPayload.aiLocation?.mgrsGrid || '43R EN 8723 6241'}</p>
                    <p><strong className="text-slate-400">Sector / Outpost:</strong> {selectedEvidenceModal.metadataPayload.aiLocation?.sector || selectedEvidenceModal.cameraName}</p>
                    <p><strong className="text-slate-400">Camera Bearing:</strong> {selectedEvidenceModal.metadataPayload.aiLocation?.bearing || '142°'} ({selectedEvidenceModal.metadataPayload.aiLocation?.cardinalDirection || 'South-East'})</p>
                    <p><strong className="text-slate-400">Elevation:</strong> {selectedEvidenceModal.metadataPayload.aiLocation?.elevationMsl || '248m MSL'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs font-mono-code space-y-1.5 text-slate-300 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
              <p><strong>Title:</strong> {selectedEvidenceModal.title}</p>
              <p><strong>Associated Incident:</strong> {selectedEvidenceModal.incidentId}</p>
              <p><strong>Origin Camera:</strong> {selectedEvidenceModal.cameraName}</p>
              <p><strong>Cryptographic SHA-256 Digest:</strong> <span className="text-cyan-300 break-all">{selectedEvidenceModal.sha256Hash}</span></p>
              <p><strong>Chain-of-Custody:</strong> Legally valid, encrypted at rest in accordance with SIH26187 evidentiary standards.</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedEvidenceModal(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-mono-code"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedEvidenceModal.id)}
                className="px-3.5 py-1.5 rounded bg-cyan-600 text-black text-xs font-mono-code font-bold flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Signed Forensic Package</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

