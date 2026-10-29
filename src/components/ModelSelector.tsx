// ============================================
// КОМПОНЕНТ ВЫБОРА МОДЕЛИ
// ============================================

import React, { useState } from 'react';
import { Model } from '../types';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, onSelectModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-gray-700/50 rounded-lg transition-all duration-200"
      >
        <span className="text-sm">🧠</span>
        <span className="text-sm text-gray-200 font-medium">{currentModel?.name || 'Выбрать модель'}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-700/50">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Выберите модель</p>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => { onSelectModel(model.id); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-150 mb-1 ${
                    model.id === selectedModel
                      ? 'bg-violet-500/20 border border-violet-500/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{model.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300">{model.provider}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{model.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Макс. токенов: {model.maxTokens.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;
