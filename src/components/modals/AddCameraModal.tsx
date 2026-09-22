import React, { useState } from 'react';
import { 
  X, Camera as CameraIcon, Plus, CheckCircle2, 
  AlertTriangle, Cpu, Globe, MapPin 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Camera } from '../../types';

export const AddCameraModal: React.FC = () => {
  const { 
    isAddCameraModalOpen, setIsAddCameraModalOpen, 
    addCamera, edgeNodes 
  } = useApp();

  const [id, setId] = useState('CAM-17');
  const [name, setName] = useState('Sector Alpha - Riverbank Watchtower');
  const [sector, setSector] = useState('Sector Alpha - North Riverline');
  const [ip, setIp] = useState('192.168.10.117');
  const [rtspUrl, setRtspUrl] = useState('rtsp://edge-sih26187.border.internal:554/cam17/h264');
  const [resolution, setResolution] = useState('3840x2160 (4K)');
  const [angleDeg, setAngleDeg] = useState(85);
  const [fovDeg, setFovDeg] = useState(90);
  const [edgeNodeId, setEdgeNodeId] = useState('EDGE-NODE-01');
  const [lat, setLat] = useState('27.0245');
  const [lng, setLng] = useState('71.1870');
  const [posX, setPosX] = useState(48);
  const [posY, setPosY] = useState(40);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAddCameraModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCamera: Camera = {
      id: id.trim(),
      name: name.trim(),
      sector,
      ip: ip.trim(),
      rtspUrl: rtspUrl.trim(),
      status: 'ONLINE',
      fps: 30,
      latencyMs: 14,
      resolution,
      healthStatus: 'HEALTHY',
      tamperStatus: { isTampered: false },
      lastHeartbeat: 'Just now',
      aiStatus: 'ACTIVE',
      angleDeg: Number(angleDeg),
      fovDeg: Number(fovDeg),
      mapLocation: {
        x: Number(posX),
        y: Number(posY),
        lat: Number(lat),
        lng: Number(lng)
      },
      zones: [],
      activeDetectionsCount: 0,
      isRecording: true,
      edgeNodeId
    };

    addCamera(newCamera);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsAddCameraModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-[#090f1a] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-cyan-400">
              <CameraIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-tactical font-bold text-slate-100">
                Register New Tactical Camera
              </h2>
              <p className="text-xs text-slate-400">
                Integrate existing border CCTV stream with edge AI inference pipeline
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCameraModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-tactical font-bold text-slate-100">
              Camera Stream Registered Successfully
            </h3>
            <p className="text-xs font-mono-code text-slate-400">
              {id} connected to {edgeNodeId} • YOLOv10 TensorRT pipeline initialized.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                  Camera Identifier (ID)
                </label>
                <input
                  type="text"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. CAM-17"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                  Operational Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Sector Alpha - North Riverline">Sector Alpha - North Riverline</option>
                  <option value="Sector Bravo - Ridge Line">Sector Bravo - Ridge Line</option>
                  <option value="Sector Charlie - Highway Corridor">Sector Charlie - Highway Corridor</option>
                  <option value="Sector Delta - Salt Flats">Sector Delta - Salt Flats</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                Display Location Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Sector Alpha - Riverbank Watchtower"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                  LAN IP Address
                </label>
                <input
                  type="text"
                  required
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="192.168.10.xxx"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                  Resolution Profile
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="3840x2160 (4K)">3840x2160 (4K UHD)</option>
                  <option value="2560x1440 (2K)">2560x1440 (2K QHD)</option>
                  <option value="1920x1080 (1080p)">1920x1080 (1080p FHD)</option>
                  <option value="1920x1080 (Thermal Dual)">1920x1080 (Thermal / Optical Dual)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                RTSP Stream URL
              </label>
              <input
                type="text"
                required
                value={rtspUrl}
                onChange={(e) => setRtspUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="rtsp://edge-host:554/cam/stream"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                  Assigned Edge Node
                </label>
                <select
                  value={edgeNodeId}
                  onChange={(e) => setEdgeNodeId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {edgeNodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.name} ({node.ip})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                    Bearing (°)
                  </label>
                  <input
                    type="number"
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                    FOV (°)
                  </label>
                  <input
                    type="number"
                    value={fovDeg}
                    onChange={(e) => setFovDeg(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono-code text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Simulated Coordinates: {lat}° N, {lng}° E</span>
              </span>
              <span>Grid Pos: ({posX}%, {posY}%)</span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddCameraModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-mono-code text-xs hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-tactical font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Register Camera Feed</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
