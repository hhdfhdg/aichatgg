// ============================================
// БЛОК ВЫЗОВА ИНСТРУМЕНТОВ
// ============================================

import React from 'react';
import { ToolCall } from '../types';

interface ToolCallBlockProps {
  toolCalls: ToolCall[];
}

const ToolCallBlock: React.FC<ToolCallBlockProps> = ({ toolCalls }) => {
  if (!toolCalls || toolCalls.length === 0) return null;

  const getStatusIcon = (status: ToolCall['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '⚙️';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  const getStatusColor = (status: ToolCall['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'running': return 'text-amber-400';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
    }
  };

  const getToolIcon = (name: string) => {
    if (name.includes('search')) return '🔍';
    if (name.includes('calc')) return '🧮';
    if (name.includes('time')) return '🕐';
    if (name.includes('code')) return '💻';
    return '🔧';
  };

  return (
    <div className="my-3 space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Вызовы инструментов
        </span>
        <span className="px-1.5 py-0.5 text-[10px] bg-gray-700/50 text-gray-300 rounded-full">
          {toolCalls.length}
        </span>
      </div>

      {toolCalls.map((tc) => (
        <div
          key={tc.id}
          className="rounded-xl border border-gray-700/50 bg-gray-800/50 overflow-hidden"
        >
          {/* Заголовок вызова */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700/30">
            <span className="text-sm">{getToolIcon(tc.name)}</span>
            <span className="text-xs font-medium text-gray-200 font-mono">{tc.name}</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className={`text-xs ${getStatusColor(tc.status)}`}>
                {getStatusIcon(tc.status)}
              </span>
              {tc.status === 'running' && (
                <span className="text-[10px] text-amber-400 animate-pulse">выполняется...</span>
              )}
            </div>
          </div>

          {/* Аргументы */}
          <div className="px-3 py-2 border-b border-gray-700/30">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Аргументы</p>
            <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
              {JSON.stringify(tc.arguments, null, 2)}
            </pre>
          </div>

          {/* Результат */}
          {tc.result && (
            <div className="px-3 py-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Результат</p>
              <pre className={`text-xs font-mono overflow-x-auto ${
                tc.status === 'error' ? 'text-red-300' : 'text-emerald-300'
              }`}>
                {tc.result}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToolCallBlock;
