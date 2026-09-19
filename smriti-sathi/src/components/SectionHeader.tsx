import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export default function SectionHeader({ title, icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 mb-3">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[var(--color-text-secondary)]">{icon}</span>}
        <h2 className="text-xl font-bold text-[var(--color-text)]">{title}</h2>
      </div>
      {action && (
        <button
          onClick={action.onPress}
          className="text-base font-semibold text-[#10B981] px-3 py-1 rounded-xl hover:bg-[#10B981]/15 transition-colors min-h-[44px] flex items-center"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
