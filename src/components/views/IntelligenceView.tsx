import React, { useState } from 'react';
import { 
  Users, Car, ShieldCheck, Search, Activity, 
  ArrowRight, Radio, Eye, Sparkles, Filter, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IntelligenceView: React.FC = () => {
  const { tracks, vehicles, cameras, selectIncident, selectCamera } = useApp();
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0]?.id || 'P-104');
  const [activeTab, setActiveTab] = useState<'PERSONS' | 'VEHICLES'>('PERSONS');

  const selectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];

  return (
    <div className="space-y-4">
      {/* Top Banner & Tab Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono-code text-[11px] font-bold border border-blue-500/40">
              AI RE-IDENTIFICATION & CORRELATION ENGINE
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              Cross-Camera Anonymous Tracking
            </span>
          </div>
          <h1 className="text-lg font-tactical font-bold text-slate-100 mt-1">
            Re-ID Intelligence & ANPR Consensus Hub
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('PERSONS')}
            className={`px-3 py-1.5 rounded text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'PERSONS' ? 'bg-cyan-600 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>PERSON TRACKS ({tracks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('VEHICLES')}
            className={`px-3 py-1.5 rounded text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'VEHICLES' ? 'bg-cyan-600 text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>ANPR VEHICLES ({vehicles.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'PERSONS' ? (
        /* Persons Re-ID Gallery & Sequence Flow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column (4 cols): Active Re-ID Tracks List */}
          <div className="lg:col-span-4 space-y-2.5">
            <h3 className="text-xs font-tactical font-bold text-slate-300 uppercase tracking-wider px-1">
              Active Anonymous Re-ID Tracks
            </h3>

            <div className="space-y-2">
              {tracks.map(trk => {
                const isSelected = trk.id === selectedTrackId;
                const isCritical = trk.id === 'P-104';

                return (
                  <div
                    key={trk.id}
                    onClick={() => setSelectedTrackId(trk.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-900/30 border-cyan-400 ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code font-bold text-sm text-slate-100">{trk.id}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-mono-code font-bold uppercase ${
                          isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-cyan-300'
                        }`}>
                          {trk.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono-code text-cyan-400 font-semibold">
                        {trk.reIdConfidence}% MATCH
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono-code text-slate-400">
                      <div>
                        <span className="text-slate-500 text-[10px] block">DIRECTION:</span>
                        <span className="text-slate-200">{trk.direction}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">CAMERAS LOGGED:</span>
                        <span className="text-slate-200">{trk.cameraList.length} Cams</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono-code text-cyan-400 truncate">
                      PATH: {trk.cameraList.join(' → ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (8 cols): Selected Track Deep Inspection */}
          <div className="lg:col-span-8 space-y-4">
            {selectedTrack && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-tactical font-bold text-slate-100">{selectedTrack.id} Dossier</h2>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 text-xs font-mono-code font-bold">
                        Re-ID Confidence: {selectedTrack.reIdConfidence}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      First spotted: {selectedTrack.firstSeen} • Last seen: {selectedTrack.lastSeen}
                    </p>
                  </div>

                  <button
                    onClick={() => selectIncident('INC-26187-01')}
                    className="px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/70 border border-red-500/40 text-red-300 text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>View Correlated Incident (91/100)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Extracted Biometric / Appearance Fingerprint Features */}
                <div>
                  <h4 className="text-xs font-tactical font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Visual Re-ID Feature Embeddings (Privacy-Preserving)</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-code">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">UPPER TORSO</span>
                      <strong className="text-slate-200">{selectedTrack.features.upperClothing}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">LOWER TORSO</span>
                      <strong className="text-slate-200">{selectedTrack.features.lowerClothing}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">ACCESSORIES</span>
                      <strong className="text-slate-200">{selectedTrack.features.hasBackpack ? 'Tactical Pack Yes' : 'None'}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">VELOCITY & GAIT</span>
                      <strong className="text-cyan-400">{selectedTrack.speedKmh} km/h • {selectedTrack.features.gaitPace}</strong>
                    </div>
                  </div>
                </div>

                {/* Multi-Camera Visual Re-ID Trail */}
                <div>
                  <h4 className="text-xs font-tactical font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Cross-Camera Detection Sequence ({selectedTrack.detections.length} Node Sightings)
                  </h4>

                  <div className="space-y-2">
                    {selectedTrack.detections.map((det, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 text-xs font-mono-code font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono-code font-bold text-slate-200">{det.cameraId}</span>
                              <span className="text-[10px] font-mono-code text-slate-500">[{det.timestamp}]</span>
                            </div>
                            <span className="text-[11px] text-slate-400">Direction: {det.direction}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono-code text-emerald-400 font-bold">
                            {det.confidence}% AI CONF
                          </span>
                          <button
                            onClick={() => selectCamera(det.cameraId)}
                            className="text-xs font-mono-code text-cyan-400 hover:text-cyan-300"
                          >
                            Inspect Cam →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ANPR Vehicles Consensus Table */
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">
              Automated Number Plate Recognition (ANPR) Multi-Camera Consensus
            </h3>
            <span className="text-xs font-mono-code text-slate-400">
              Multi-View License Consensus Engine
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Track ID</th>
                  <th className="p-3">Detected Plate</th>
                  <th className="p-3">Consensus Agreement</th>
                  <th className="p-3">Vehicle Details</th>
                  <th className="p-3">Speed / Direction</th>
                  <th className="p-3">Watchlist Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {vehicles.map(v => (
                  <tr key={v.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="p-3 font-bold text-slate-200">{v.id}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded bg-black border border-slate-700 text-yellow-300 font-bold tracking-widest text-xs">
                        {v.licensePlate}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{v.consensusCount} agreed ({v.confidence}%)</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">
                      {v.color} {v.makeModel}
                    </td>
                    <td className="p-3 text-slate-400">
                      {v.speedKmh} km/h • {v.direction}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.isWatchlistFlagged
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {v.isWatchlistFlagged ? 'FLAGGED: BORDER WATCH' : 'CLEAN'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => selectIncident('INC-26187-01')}
                        className="text-cyan-400 hover:text-cyan-300 font-bold"
                      >
                        Investigate →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
