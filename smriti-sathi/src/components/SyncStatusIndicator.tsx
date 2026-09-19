/**
 * SMRITI SATHI — Sync Status Indicator
 * 
 * Visible but unobtrusive indicator showing synchronization state.
 * 
 * States:
 * - Offline: "Data saved locally"
 * - Pending: "Sync pending • N records"
 * - Syncing: "Syncing..."
 * - Synced: "All data synchronized"
 * - Error: "Sync failed • N records"
 */

import { useSyncState } from '../services/sync/useSync';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Cloud,
  CloudOff,
  Clock
} from 'lucide-react';

interface SyncStatusIndicatorProps {
  compact?: boolean;
  showDetails?: boolean;
  onSyncClick?: () => void;
}

export default function SyncStatusIndicator({ 
  compact = false, 
  showDetails = false,
  onSyncClick,
}: SyncStatusIndicatorProps) {
  const { 
    status, 
    pendingCount, 
    failedCount, 
    syncedCount,
    isSyncing,
    connectivityState,
    triggerSync,
  } = useSyncState();

  const handleClick = () => {
    if (onSyncClick) {
      onSyncClick();
    } else if (status === 'pending' || status === 'error') {
      triggerSync();
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'offline':
        return {
          icon: <CloudOff size={compact ? 14 : 16} />,
          label: 'Offline',
          detail: 'Data saved locally',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-200',
          pulseColor: '',
        };
      
      case 'idle':
        return {
          icon: <Wifi size={compact ? 14 : 16} />,
          label: 'Online',
          detail: 'Ready to sync',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          pulseColor: '',
        };
      
      case 'pending':
        return {
          icon: <Clock size={compact ? 14 : 16} />,
          label: 'Sync pending',
          detail: `${pendingCount} record${pendingCount !== 1 ? 's' : ''}`,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          pulseColor: '',
        };
      
      case 'syncing':
        return {
          icon: <RefreshCw size={compact ? 14 : 16} className="animate-spin" />,
          label: 'Syncing...',
          detail: `${pendingCount} record${pendingCount !== 1 ? 's' : ''} remaining`,
          bgColor: 'bg-indigo-50',
          textColor: 'text-indigo-800',
          borderColor: 'border-indigo-200',
          pulseColor: 'animate-pulse',
        };
      
      case 'synced':
        return {
          icon: <CheckCircle2 size={compact ? 14 : 16} />,
          label: 'Synced',
          detail: 'All data synchronized',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          pulseColor: '',
        };
      
      case 'error':
        return {
          icon: <AlertTriangle size={compact ? 14 : 16} />,
          label: 'Sync failed',
          detail: `${failedCount} record${failedCount !== 1 ? 's' : ''} need retry`,
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          pulseColor: '',
        };
      
      default:
        return {
          icon: <Cloud size={compact ? 14 : 16} />,
          label: 'Unknown',
          detail: '',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          pulseColor: '',
        };
    }
  };

  const config = getStatusConfig();
  const isClickable = status === 'pending' || status === 'error' || status === 'idle';

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={!isClickable || isSyncing}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          ${config.bgColor} ${config.textColor} border ${config.borderColor}
          ${isClickable ? 'cursor-pointer hover:opacity-80 active:scale-95' : 'cursor-default'}
          transition-all duration-200`}
        title={`${config.label}${config.detail ? ` — ${config.detail}` : ''}`}
      >
        {config.icon}
        <span>{config.label}</span>
        {(status === 'pending' || status === 'error') && (
          <span className="font-bold">{pendingCount + failedCount}</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!isClickable || isSyncing}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border
        ${config.bgColor} ${config.borderColor}
        ${isClickable ? 'cursor-pointer hover:opacity-90 active:scale-[0.98]' : 'cursor-default'}
        transition-all duration-200 ${config.pulseColor}`}
    >
      <div className={`${config.textColor}`}>
        {config.icon}
      </div>
      <div className="flex flex-col items-start">
        <span className={`text-sm font-semibold ${config.textColor}`}>
          {config.label}
        </span>
        {showDetails && config.detail && (
          <span className={`text-xs ${config.textColor} opacity-75`}>
            {config.detail}
          </span>
        )}
      </div>
      {(status === 'pending' || status === 'error') && (
        <div className={`ml-auto text-lg font-bold ${config.textColor}`}>
          {pendingCount + failedCount}
        </div>
      )}
    </button>
  );
}
