// ============================================
// БЛОК РАЗМЫШЛЕНИЙ - Показывает ход мыслей AI
// ============================================

import React, { useState } from 'react';

interface ReasoningBlockProps {
  content: string;
  isStreaming?: boolean;
}

const ReasoningBlock: React.FC<ReasoningBlockProps> = ({ content, isStreaming = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!content) return null;

  return (
    <div className="my-3 rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
      {/* Заголовок */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-violet-500/10 transition-colors"
      >
        <span className="text-sm">🧠</span>
        <span className="text-xs font-medium text-violet-300">Размышление</span>
        {isStreaming && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-violet-400">думает...</span>
          </span>
        )}
        <svg
          className={`w-3 h-3 text-violet-400 ml-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Содержимое */}
      {isExpanded && (
        <div className="px-4 pb-3 border-t border-violet-500/10">
          <div className="pt-2 text-xs text-violet-200/80 leading-relaxed whitespace-pre-wrap font-mono">
            {content}
            {isStreaming && (
              <span className="inline-block w-1.5 h-3 bg-violet-400 animate-pulse ml-0.5" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReasoningBlock;
