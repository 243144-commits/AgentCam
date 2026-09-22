import React, { useState, useEffect, useRef } from 'react';
import { Search, Camera, ShieldAlert, Users, Car, X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, setIsSearchModalOpen, cameras, incidents, 
    tracks, vehicles, selectCamera, selectIncident, setActiveView 
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchModalOpen]);

  // Global '/' keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchModalOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const matchedCameras = cameras.filter(c => 
    c.id.toLowerCase().includes(query.toLowerCase()) ||
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.sector.toLowerCase().includes(query.toLowerCase()) ||
    c.ip.includes(query)
  ).slice(0, 3);

  const matchedIncidents = incidents.filter(i =>
    i.id.toLowerCase().includes(query.toLowerCase()) ||
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.sector.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedVehicles = vehicles.filter(v =>
    v.licensePlate.toLowerCase().includes(query.toLowerCase()) ||
    v.id.toLowerCase().includes(query.toLowerCase()) ||
    v.makeModel.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedTracks = tracks.filter(t =>
    t.id.toLowerCase().includes(query.toLowerCase()) ||
    t.features.upperClothing.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-4 space-y-4 shadow-2xl">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-cyan-400 absolute left-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search cameras, incidents, P-104, license plates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-sm font-mono-code pl-10 pr-10 py-2.5 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="absolute right-3 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs font-mono-code">
          {/* Incidents */}
          {matchedIncidents.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3 text-red-400" />
                <span>Threat Incidents</span>
              </div>
              <div className="space-y-1">
                {matchedIncidents.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      selectIncident(inc.id);
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2 rounded bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-red-400">{inc.id}</span>
                      <span className="text-slate-300 ml-2">{inc.title}</span>
                    </div>
                    <span className="text-cyan-400">View Dossier →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cameras */}
          {matchedCameras.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-1 flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-cyan-400" />
                <span>Cameras</span>
              </div>
              <div className="space-y-1">
                {matchedCameras.map(cam => (
                  <div
                    key={cam.id}
                    onClick={() => {
                      selectCamera(cam.id);
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2 rounded bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-cyan-400">{cam.id}</span>
                      <span className="text-slate-300 ml-2">{cam.name}</span>
                      <span className="text-slate-500 text-[10px] ml-2">[{cam.sector}]</span>
                    </div>
                    <span className="text-slate-400">Inspect →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicles */}
          {matchedVehicles.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-1 flex items-center gap-1.5">
                <Car className="w-3 h-3 text-amber-400" />
                <span>ANPR Vehicles</span>
              </div>
              <div className="space-y-1">
                {matchedVehicles.map(veh => (
                  <div
                    key={veh.id}
                    onClick={() => {
                      setActiveView('intelligence');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2 rounded bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-yellow-300 bg-black px-1 py-0.5 rounded border border-slate-700">{veh.licensePlate}</span>
                      <span className="text-slate-300 ml-2">{veh.makeModel}</span>
                    </div>
                    <span className="text-slate-400">Intelligence →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracks */}
          {matchedTracks.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-1 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-blue-400" />
                <span>Re-ID Anonymous Tracks</span>
              </div>
              <div className="space-y-1">
                {matchedTracks.map(trk => (
                  <div
                    key={trk.id}
                    onClick={() => {
                      setActiveView('intelligence');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2 rounded bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-cyan-300">{trk.id}</span>
                      <span className="text-slate-400 ml-2">{trk.features.upperClothing}</span>
                    </div>
                    <span className="text-slate-400">View Path →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedCameras.length === 0 && matchedIncidents.length === 0 && matchedVehicles.length === 0 && matchedTracks.length === 0 && (
            <div className="p-6 text-center text-slate-500 italic">
              No tactical entities match "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
