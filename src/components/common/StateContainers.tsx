import React from 'react';
import { 
  Loader2, AlertTriangle, RefreshCw, WifiOff, 
  SearchX, Inbox, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading tactical surveillance feed...', 
  subtext = 'Syncing edge inference node telemetry (YOLOv10 TensorRT)...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[220px] bg-slate-950/60 rounded-xl border border-slate-800/80 text-center space-y-3">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full border border-blue-400/40 animate-ping" />
      </div>
      <div>
        <p className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">{message}</p>
        <p className="text-[11px] font-mono-code text-slate-400 mt-1">{subtext}</p>
      </div>
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  code?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Camera Feed Unavailable',
  message = 'RTSP stream handshake timed out. Edge node may be in power conservation or thermal throttling mode.',
  onRetry,
  code = 'ERR_STREAM_TIMEOUT'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[220px] bg-red-950/20 rounded-xl border border-red-500/30 text-center space-y-3">
      <div className="p-2.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-tactical font-bold text-red-400 uppercase tracking-wider">{title}</span>
          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-mono-code text-[10px]">{code}</span>
        </div>
        <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono-code flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Re-establish RTSP Handshake</span>
        </button>
      )}
    </div>
  );
};

export interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionText,
  onAction,
  icon: Icon = Inbox
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[220px] bg-slate-900/40 rounded-xl border border-slate-800/80 text-center space-y-3">
      <div className="p-3 rounded-full bg-slate-800/80 text-slate-400">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <div className="max-w-md">
        <h4 className="text-xs font-tactical font-bold text-slate-200 uppercase tracking-wider">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-mono-code font-bold transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export interface OfflineStateProps {
  nodeName?: string;
  bufferedCount?: number;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const OfflineState: React.FC<OfflineStateProps> = ({
  nodeName = 'Field Edge Node 02',
  bufferedCount = 14,
  onSync,
  isSyncing = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[220px] bg-amber-950/20 rounded-xl border border-amber-500/40 text-center space-y-3">
      <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400">
        <WifiOff className="w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-tactical font-bold text-amber-400 uppercase tracking-wider">
            Edge Node Operating in Isolated Buffer Mode
          </span>
        </div>
        <p className="text-xs text-slate-300 max-w-md mt-1 leading-relaxed">
          {nodeName} is running autonomous on-device YOLO inference without backhaul connectivity. 
          Local NVMe SQLite buffer is safely preserving <strong>{bufferedCount} threat detections</strong> with zero packet loss.
        </p>
      </div>
      {onSync && (
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black text-xs font-mono-code font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Buffered Telemetry...' : 'Flush Buffer to HQ'}</span>
        </button>
      )}
    </div>
  );
};

export interface NoResultsStateProps {
  searchTerm?: string;
  onClearFilters?: () => void;
}

export const NoResultsState: React.FC<NoResultsStateProps> = ({
  searchTerm,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] bg-slate-900/30 rounded-xl border border-slate-800/80 text-center space-y-2">
      <SearchX className="w-7 h-7 text-slate-500" />
      <h4 className="text-xs font-tactical font-bold text-slate-300 uppercase tracking-wider">
        No Matching Entities Found
      </h4>
      <p className="text-xs text-slate-400 max-w-sm">
        {searchTerm 
          ? `No cameras, incidents, or license plates matched query "${searchTerm}".`
          : 'No items meet the currently active filter criteria.'}
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-2 text-xs font-mono-code text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
};
