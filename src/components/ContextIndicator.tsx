// ============================================
// ИНДИКАТОР КОНТЕКСТА - Показывает использование токенов
// ============================================

import React from 'react';
import { ContextInfo } from '../types';

interface ContextIndicatorProps {
  context: ContextInfo;
}

const ContextIndicator: React.FC<ContextIndicatorProps> = ({ context }) => {
  const percentage = Math.min((context.usedTokens / context.maxTokens) * 100, 100);
  
  const getColor = () => {
    if (percentage < 50) return 'from-emerald-500 to-green-500';
    if (percentage < 75) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getTextColor = () => {
    if (percentage < 50) return 'text-emerald-400';
    if (percentage < 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-gray-700/50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Контекст</span>
          <span className={`text-xs font-medium ${getTextColor()}`}>
            {context.usedTokens.toLocaleString()} / {context.maxTokens.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getColor()} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400">Сообщений</p>
        <p className="text-sm font-bold text-white">{context.messageCount}</p>
      </div>
    </div>
  );
};

export default ContextIndicator;
