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
        {icon && <span className="text-[#4A4A4A]">{icon}</span>}
        <h2 className="text-xl font-bold text-[#1A1A1A]">{title}</h2>
      </div>
      {action && (
        <button
          onClick={action.onPress}
          className="text-base font-medium text-[#1B5E20] px-3 py-1 rounded-lg hover:bg-[#E8F5E9] transition-colors min-h-[44px] flex items-center"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
