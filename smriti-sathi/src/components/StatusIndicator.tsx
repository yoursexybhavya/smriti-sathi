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
      bg: 'bg-[#E8F5E9]',
      text: 'text-[#2E7D32]',
      defaultLabel: 'Online',
    },
    offline: {
      icon: <WifiOff size={compact ? 12 : 14} />,
      bg: 'bg-[#EFEBE9]',
      text: 'text-[#5D4037]',
      defaultLabel: 'Offline',
    },
    success: {
      icon: <CheckCircle size={compact ? 12 : 14} />,
      bg: 'bg-[#E8F5E9]',
      text: 'text-[#2E7D32]',
      defaultLabel: 'Complete',
    },
    warning: {
      icon: <AlertCircle size={compact ? 12 : 14} />,
      bg: 'bg-[#FFF3E0]',
      text: 'text-[#E65100]',
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
