import React, { useState } from 'react';
import { 
  X, Map, ShieldAlert, Plus, CheckCircle2, 
  Layers, AlertTriangle, Crosshair, Palette 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SurveillanceZone } from '../../types';

export const CreateZoneModal: React.FC = () => {
  const { 
    isCreateZoneModalOpen, setIsCreateZoneModalOpen, 
    cameras, addZone 
  } = useApp();

  const [selectedCameraId, setSelectedCameraId] = useState<string>(cameras[0]?.id || 'CAM-09');
  const [zoneName, setZoneName] = useState('Prohibited Breach Corridor Zone');
  const [zoneType, setZoneType] = useState<SurveillanceZone['type']>('RESTRICTED');
  const [color, setColor] = useState('#dc2626');
  const [sensitivity, setSensitivity] = useState(85);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCreateZoneModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newZone: SurveillanceZone = {
      id: `zn-${Date.now()}`,
      name: zoneName.trim(),
      type: zoneType,
      color,
      points: [
        { x: 15, y: 35 },
        { x: 85, y: 35 },
        { x: 85, y: 75 },
        { x: 15, y: 75 }
      ]
    };

    addZone(selectedCameraId, newZone);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsCreateZoneModalOpen(false);
    }, 1200);
  };

  const zonePresets = [
    { type: 'RESTRICTED' as const, name: 'Restricted Lethal Zone', color: '#dc2626', desc: 'Immediate lethal intercept zone; trigger alert on single frame' },
    { type: 'BORDER_LINE' as const, name: 'Zero-Line Boundary Virtual Fence', color: '#ef4444', desc: 'International zero boundary demarcation; bidirectional crossing rule' },
    { type: 'BUFFER' as const, name: 'Approach Buffer Zone', color: '#f59e0b', desc: 'Pre-perimeter warning band; tracks loitering >45s' },
    { type: 'PATROL' as const, name: 'Designated Friendly Patrol Road', color: '#10b981', desc: 'Exempts recognized BSF patrol vehicles and friendly units' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-[#090f1a] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-tactical font-bold text-slate-100">
                Configure Virtual Surveillance Zone
              </h2>
              <p className="text-xs text-slate-400">
                Define geofenced tripwire boundary and AI threat escalation trigger
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateZoneModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-tactical font-bold text-slate-100">
              Virtual Tripwire Zone Created
            </h3>
            <p className="text-xs font-mono-code text-slate-400">
              Zone &apos;{zoneName}&apos; deployed to {selectedCameraId} FOV overlay.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                Target Camera Feed
              </label>
              <select
                value={selectedCameraId}
                onChange={(e) => setSelectedCameraId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {cameras.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} • {c.name} ({c.sector})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                Zone Designation Name
              </label>
              <input
                type="text"
                required
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Intermediate Barbed Buffer Strip"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-code text-slate-400 block mb-1.5 uppercase">
                Select Zone Category & Escalation Rule
              </label>
              <div className="space-y-2">
                {zonePresets.map(preset => (
                  <div
                    key={preset.type}
                    onClick={() => {
                      setZoneType(preset.type);
                      setColor(preset.color);
                    }}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      zoneType === preset.type 
                        ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/30' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div 
                      className="w-3.5 h-3.5 rounded-full mt-0.5 shrink-0" 
                      style={{ backgroundColor: preset.color }} 
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 leading-tight">{preset.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                  Alert Sensitivity ({sensitivity}%)
                </label>
                <input
                  type="range"
                  min="40"
                  max="99"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase">
                  Overlay Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono-code text-slate-300">{color}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] font-mono-code text-slate-400">
              Tripwire geometry: 4-point polygon anchored to camera {selectedCameraId} FOV space.
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateZoneModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-mono-code text-xs hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-tactical font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-red-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Deploy Virtual Zone</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
