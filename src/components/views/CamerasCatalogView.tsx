import React, { useState } from 'react';
import { Camera } from '../../types';
import { 
  Camera as CameraIcon, Shield, AlertTriangle, Radio, 
  Search, Filter, Activity, CheckCircle2, ChevronRight, Video, Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoResultsState } from '../common/StateContainers';

export const CamerasCatalogView: React.FC = () => {
  const { cameras, selectCamera, setIsAddCameraModalOpen } = useApp();
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'DEGRADED'>('ALL');

  const sectors = ['ALL', 'Sector A', 'Sector B', 'Sector C', 'Sector D'];

  const filteredCameras = cameras.filter(cam => {
    const matchesSearch = cam.id.toLowerCase().includes(search.toLowerCase()) || 
                          cam.name.toLowerCase().includes(search.toLowerCase()) ||
                          cam.ip.includes(search);
    const matchesSector = sectorFilter === 'ALL' || cam.sector.includes(sectorFilter);
    const matchesStatus = statusFilter === 'ALL' || cam.status === statusFilter;
    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name, or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-xs font-mono-code px-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sector Filter */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            {sectors.map(s => (
              <button
                key={s}
                onClick={() => setSectorFilter(s)}
                className={`px-2 py-1 rounded text-xs font-mono-code transition-colors ${
                  sectorFilter === s ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 text-xs font-mono-code px-2.5 py-1.5 rounded-lg text-cyan-300 focus:outline-none"
          >
            <option value="ALL">All Statuses ({cameras.length})</option>
            <option value="ONLINE">Online Only</option>
            <option value="DEGRADED">Degraded / Tamper</option>
          </select>

          {/* Register Camera Button */}
          <button
            onClick={() => setIsAddCameraModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-tactical font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ml-auto sm:ml-0"
          >
            <Plus className="w-3.5 h-3.5 fill-black text-black" />
            <span>Register Camera</span>
          </button>
        </div>
      </div>

      {/* Cameras Grid or No Results */}
      {filteredCameras.length === 0 ? (
        <NoResultsState 
          query={search || sectorFilter}
          onClearFilter={() => {
            setSearch('');
            setSectorFilter('ALL');
            setStatusFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCameras.map(cam => {
          const isTampered = cam.healthStatus === 'TAMPER_ALERT';
          return (
            <div
              key={cam.id}
              onClick={() => selectCamera(cam.id)}
              className={`p-4 rounded-xl border bg-slate-900/80 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group ${
                isTampered 
                  ? 'border-amber-500/60 ring-1 ring-amber-500/20' 
                  : 'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-tactical font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {cam.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                      cam.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {cam.status}
                    </span>
                  </div>

                  {isTampered && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono-code flex items-center gap-1 font-bold animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      TAMPER
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-medium text-slate-300 mt-1">
                  {cam.name}
                </h4>
                <p className="text-[11px] font-mono-code text-slate-500 mt-0.5">
                  {cam.sector}
                </p>

                {/* Telemetry Matrix */}
                <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] font-mono-code">
                  <div>
                    <span className="text-slate-500 text-[10px]">FPS / LATENCY</span>
                    <p className="text-slate-200 font-bold">{cam.fps} FPS / {cam.latencyMs}ms</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">RESOLUTION</span>
                    <p className="text-cyan-400 font-bold truncate">{cam.resolution.split(' ')[0]}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">BEARING / FOV</span>
                    <p className="text-slate-300">{cam.angleDeg}° / {cam.fovDeg}°</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">ACTIVE DETECTIONS</span>
                    <p className={cam.activeDetectionsCount > 0 ? "text-red-400 font-bold" : "text-slate-400"}>
                      {cam.activeDetectionsCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono-code text-slate-400">
                <span>NODE: {cam.edgeNodeId}</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Inspect Feed <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
