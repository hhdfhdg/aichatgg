// ============================================
// КОМПОНЕНТ TOGGLE - Переключатель
// ============================================

import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
  icon: string;
  color?: 'violet' | 'emerald' | 'amber' | 'blue';
  disabled?: boolean;
}

const colorMap = {
  violet: {
    bg: 'bg-violet-500',
    bgActive: 'bg-violet-500',
    shadow: 'shadow-violet-500/30',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    hoverBg: 'hover:bg-violet-500/10',
  },
  emerald: {
    bg: 'bg-emerald-500',
    bgActive: 'bg-emerald-500',
    shadow: 'shadow-emerald-500/30',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    hoverBg: 'hover:bg-emerald-500/10',
  },
  amber: {
    bg: 'bg-amber-500',
    bgActive: 'bg-amber-500',
    shadow: 'shadow-amber-500/30',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    hoverBg: 'hover:bg-amber-500/10',
  },
  blue: {
    bg: 'bg-blue-500',
    bgActive: 'bg-blue-500',
    shadow: 'shadow-blue-500/30',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    hoverBg: 'hover:bg-blue-500/10',
  },
};

const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onToggle,
  label,
  description,
  icon,
  color = 'violet',
  disabled = false,
}) => {
  const colors = colorMap[color];

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`group flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
        enabled
          ? `${colors.border} ${colors.hoverBg} bg-white/5`
          : 'border-gray-700/50 hover:bg-white/5'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={description}
    >
      {/* Иконка */}
      <span className={`text-sm transition-transform duration-200 ${enabled ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </span>

      {/* Текст */}
      <div className="text-left hidden sm:block">
        <p className={`text-xs font-medium ${enabled ? colors.text : 'text-gray-400'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-gray-500 leading-tight">{description}</p>
        )}
      </div>

      {/* Переключатель */}
      <div className={`relative w-8 h-[18px] rounded-full transition-all duration-300 ${
        enabled ? `${colors.bg} shadow-md ${colors.shadow}` : 'bg-gray-700'
      }`}>
        <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all duration-300 ${
          enabled ? 'left-[16px]' : 'left-[2px]'
        }`} />
      </div>
    </button>
  );
};

export default Toggle;
