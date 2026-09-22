import React from 'react';
import { 
  Activity, Server, Cpu, HardDrive, Wifi, WifiOff, 
  RefreshCw, ShieldCheck, AlertTriangle, Radio, Zap, Layers 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SystemHealthView: React.FC = () => {
  const { 
    isEdgeModeIsolated, offlineBufferedCount, isSyncingEdge, 
    toggleEdgeMode, triggerEdgeSync, cameras 
  } = useApp();

  const edgeNodes = [
    {
      id: 'NODE-01',
      name: 'North Sutlej River Outpost (Sector A)',
      status: 'ONLINE',
      ip: '192.168.10.1',
      cpu: 42,
      gpu: 68,
      ram: 58,
      fps: 30.1,
      latency: '12ms',
      cameras: ['CAM-01', 'CAM-02', 'CAM-03'],
      nvmeStorage: '38% (1.2TB / 4TB)',
      aiEngine: 'YOLOv10-TensorRT FP16',
      inferenceLatency: '13.8ms'
    },
    {
      id: 'NODE-02',
      name: 'Ridge Forward Tactical Post (Sector B)',
      status: isEdgeModeIsolated ? 'ISOLATED_EDGE' : 'ONLINE',
      ip: '192.168.10.2',
      cpu: 64,
      gpu: 88,
      ram: 74,
      fps: 29.8,
      latency: isEdgeModeIsolated ? 'OFFLINE' : '18ms',
      cameras: ['CAM-04', 'CAM-05', 'CAM-07', 'CAM-09'],
      nvmeStorage: '54% (2.1TB / 4TB)',
      aiEngine: 'YOLOv10-TensorRT FP16',
      inferenceLatency: '14.2ms'
    },
    {
      id: 'NODE-03',
      name: 'National Highway Overpass (Sector C)',
      status: 'ONLINE',
      ip: '192.168.10.3',
      cpu: 38,
      gpu: 54,
      ram: 51,
      fps: 30.0,
      latency: '9ms',
      cameras: ['CAM-11', 'CAM-12'],
      nvmeStorage: '29% (0.9TB / 4TB)',
      aiEngine: 'YOLOv10-TensorRT FP16',
      inferenceLatency: '11.5ms'
    },
    {
      id: 'NODE-04',
      name: 'Desert Salt Marsh Tower (Sector D)',
      status: 'DEGRADED',
      ip: '192.168.10.4',
      cpu: 49,
      gpu: 62,
      ram: 60,
      fps: 26.4,
      latency: '34ms',
      cameras: ['CAM-14', 'CAM-16'],
      nvmeStorage: '41% (1.6TB / 4TB)',
      aiEngine: 'YOLOv10-TensorRT FP16',
      inferenceLatency: '17.9ms'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner with Edge Offline Mode Simulator */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-[#080d16] border border-blue-600/30 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-code text-[11px] font-bold border border-emerald-500/40">
                DISTRIBUTED EDGE ARCHITECTURE (SIH26187)
              </span>
              <span className="text-xs font-mono-code text-slate-400">
                Low-Bandwidth & Resilient Edge Computing
              </span>
            </div>
            <h1 className="text-lg font-tactical font-bold text-slate-100 mt-1">
              Edge Processing Nodes & Network Survivability
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              All AI inference runs locally on ruggedized field nodes. Only lightweight JSON metadata (coordinates, embeddings, plates) is sent over backhaul, achieving 99.1% bandwidth savings.
            </p>
          </div>

          {/* Interactive Edge Offline Disconnection Simulation Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleEdgeMode}
              className={`px-3.5 py-2 rounded-lg font-mono-code text-xs font-bold flex items-center gap-2 transition-all border ${
                isEdgeModeIsolated
                  ? 'bg-amber-600 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {isEdgeModeIsolated ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-cyan-400" />}
              <span>{isEdgeModeIsolated ? 'RECONNECT CENTRAL BACKHAUL' : 'SEVER BACKHAUL (SIMULATE OFFLINE)'}</span>
            </button>

            {isEdgeModeIsolated && (
              <button
                onClick={triggerEdgeSync}
                disabled={isSyncingEdge}
                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-mono-code text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingEdge ? 'animate-spin' : ''}`} />
                <span>{isSyncingEdge ? 'SYNCING...' : `SYNC BUFFER (${offlineBufferedCount})`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Offline Buffer Alert Notice if Edge Mode is Active */}
        {isEdgeModeIsolated && (
          <div className="mt-3 p-3 bg-amber-950/60 border border-amber-500/50 rounded-lg flex items-center justify-between text-xs font-mono-code text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 animate-bounce text-amber-400" />
              <span>
                EDGE MODE SIMULATION ACTIVE: Node 02 is disconnected from HQ. Local SQLite buffer holding <strong>{offlineBufferedCount} threat detections</strong> with zero telemetry loss.
              </span>
            </div>
            <span className="text-[10px] text-amber-400/80">RECONNECT TO TRIGGER AUTO RE-SYNCHRONIZATION</span>
          </div>
        )}
      </div>

      {/* Bandwidth Savings Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">RAW RTSP VIDEO BANDWIDTH</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono-code text-red-400">480.0 Mbps</span>
            <span className="text-[10px] text-slate-500 font-mono-code">(16 CAMS × 30MB)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Traditional centralized architecture crashes on satellite or tactical RF links.
          </p>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">AgentC EDGE METADATA BANDWIDTH</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono-code text-emerald-400">4.2 Mbps</span>
            <span className="text-[10px] text-emerald-500 font-mono-code">VECTOR TELEMETRY</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Only JSON coordinates, bounding vectors, and Re-ID embeddings transmitted.
          </p>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[10px] font-mono-code text-slate-400 uppercase">NETWORK EFFICIENCY GAIN</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono-code text-cyan-300">99.1% SAVINGS</span>
            <span className="text-[10px] text-cyan-400 font-mono-code">OPTIMIZED</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Full operational capability preserved even on 2G / HF military radio links.
          </p>
        </div>
      </div>

      {/* 4 Edge Processing Nodes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {edgeNodes.map(node => {
          const isNodeIsolated = node.status === 'ISOLATED_EDGE';
          const isDegraded = node.status === 'DEGRADED';

          return (
            <div
              key={node.id}
              className={`bg-slate-900/80 border rounded-xl p-4 space-y-3 transition-all ${
                isNodeIsolated
                  ? 'border-amber-500/60 ring-1 ring-amber-500/20'
                  : isDegraded
                  ? 'border-amber-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-sm text-slate-100">{node.id}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-mono-code font-bold uppercase ${
                      isNodeIsolated
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isDegraded
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-300 mt-0.5">{node.name}</h3>
                </div>

                <div className="text-right text-[11px] font-mono-code text-slate-400">
                  <span>IP: {node.ip}</span>
                  <p className="text-cyan-400">{node.aiEngine}</p>
                </div>
              </div>

              {/* Resource Utilization Gauges */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono-code">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CPU LOAD</span>
                  <div className="flex items-center justify-between mt-1">
                    <strong className="text-slate-200">{node.cpu}%</strong>
                    <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${node.cpu}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">GPU (TENSOR)</span>
                  <div className="flex items-center justify-between mt-1">
                    <strong className="text-cyan-400">{node.gpu}%</strong>
                    <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${node.gpu}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">RAM MEMORY</span>
                  <div className="flex items-center justify-between mt-1">
                    <strong className="text-slate-300">{node.ram}%</strong>
                    <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400" style={{ width: `${node.ram}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Edge Details Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3 h-3 text-slate-500" />
                  <span>NVMe: {node.nvmeStorage}</span>
                </div>
                <div>
                  AI LATENCY: <strong className="text-emerald-400">{node.inferenceLatency}</strong>
                </div>
                <div>
                  CAMS: <span className="text-cyan-300">{node.cameras.join(', ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
