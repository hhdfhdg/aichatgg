// ============================================
// ПАНЕЛЬ ВОЗМОЖНОСТЕЙ - Тогглы: Размышление, Код, Функции
// ============================================

import React, { useState } from 'react';
import { ChatCapabilities, Model } from '../types';
import Toggle from './Toggle';

interface CapabilitiesToolbarProps {
  capabilities: ChatCapabilities;
  onToggleCapability: (key: keyof ChatCapabilities) => void;
  currentModel?: Model;
}

const CapabilitiesToolbar: React.FC<CapabilitiesToolbarProps> = ({
  capabilities,
  onToggleCapability,
  currentModel,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeCount = Object.values(capabilities).filter(Boolean).length;

  return (
    <div className="relative">
      {/* Кнопка открытия */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-gray-700/50 rounded-lg transition-all duration-200"
      >
        <span className="text-sm">🛠️</span>
        <span className="text-sm text-gray-200 font-medium">Инструменты</span>
        {activeCount > 0 && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-violet-500/20 text-violet-300 rounded-full">
            {activeCount}
          </span>
        )}
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Выпадающая панель */}
      {isExpanded && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsExpanded(false)} />
          <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Заголовок */}
            <div className="p-3 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Возможности AI</p>
                <span className="text-[10px] text-gray-500">
                  {currentModel?.name || 'Модель'}
                </span>
              </div>
            </div>

            {/* Тогглы */}
            <div className="p-3 space-y-2">
              {/* Размышление */}
              <Toggle
                enabled={capabilities.reasoning}
                onToggle={() => onToggleCapability('reasoning')}
                label="Размышление"
                description="Модель показывает ход мыслей"
                icon="🧠"
                color="violet"
                disabled={currentModel && !currentModel.supportsReasoning}
              />

              {/* Выполнение кода */}
              <Toggle
                enabled={capabilities.codeExecution}
                onToggle={() => onToggleCapability('codeExecution')}
                label="Выполнение кода"
                description="AI может запускать код"
                icon="⚡"
                color="emerald"
                disabled={currentModel && !currentModel.supportsCodeExecution}
              />

              {/* Функции / Инструменты */}
              <Toggle
                enabled={capabilities.functions}
                onToggle={() => onToggleCapability('functions')}
                label="Функции"
                description="Доступ к внешним инструментам"
                icon="🔧"
                color="amber"
                disabled={currentModel && !currentModel.supportsFunctions}
              />
            </div>

            {/* Подсказка */}
            <div className="px-3 pb-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-[10px] text-blue-300 leading-relaxed">
                  💡 Включённые возможности расширяют способности AI, но могут увеличить время ответа.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CapabilitiesToolbar;
