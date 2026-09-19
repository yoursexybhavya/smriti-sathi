import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';

interface StatusIndicatorProps {
  type: 'online' | 'offline' | 'success' | 'warning';
  label?: string;
  compact?: boolean;
}

export default function StatusIndicator({
  type,
  label,
  compact = false,
}: StatusIndicatorProps) {
  const config = {
    online: {
      icon: <Wifi size={compact ? 12 : 14} />,
      bg: 'bg-emerald-100 dark:bg-emerald-950/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      defaultLabel: 'Online',
    },
    offline: {
      icon: <WifiOff size={compact ? 12 : 14} />,
      bg: 'bg-slate-200 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      defaultLabel: 'Offline',
    },
    success: {
      icon: <CheckCircle size={compact ? 12 : 14} />,
      bg: 'bg-emerald-100 dark:bg-emerald-950/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      defaultLabel: 'Complete',
    },
    warning: {
      icon: <AlertCircle size={compact ? 12 : 14} />,
      bg: 'bg-amber-100 dark:bg-amber-950/60',
      text: 'text-amber-800 dark:text-amber-300',
      defaultLabel: 'Attention',
    },
  };

  const { icon, bg, text, defaultLabel } = config[type];

  return (
    <div className={`inline-flex items-center gap-1.5 ${bg} ${text} px-2.5 py-1 rounded-full font-medium ${
      compact ? 'text-xs' : 'text-sm'
    }`}>
      {icon}
      <span>{label || defaultLabel}</span>
    </div>
  );
}
