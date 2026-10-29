// ============================================
// КОМПОНЕНТ ВЫБОРА СИСТЕМНЫХ ПРОМПТОВ / "УЧИЛИЙ"
// ============================================

import React, { useState } from 'react';
import { SystemPrompt } from '../types';

interface PromptSelectorProps {
  prompts: SystemPrompt[];
  selectedPrompt: string;
  onSelectPrompt: (promptId: string) => void;
}

const PromptSelector: React.FC<PromptSelectorProps> = ({ prompts, selectedPrompt, onSelectPrompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPrompt = prompts.find(p => p.id === selectedPrompt);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-gray-700/50 rounded-lg transition-all duration-200"
      >
        <span className="text-sm">{currentPrompt?.icon || '📋'}</span>
        <span className="text-sm text-gray-200 font-medium">{currentPrompt?.name || 'Училие'}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-700/50">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Выберите училю (роль)</p>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => { onSelectPrompt(prompt.id); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-150 mb-1 ${
                    prompt.id === selectedPrompt
                      ? 'bg-violet-500/20 border border-violet-500/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{prompt.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{prompt.name}</p>
                      <p className="text-xs text-gray-400">{prompt.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PromptSelector;
