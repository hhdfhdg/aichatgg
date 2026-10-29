// ============================================
// ОСНОВНАЯ ОБЛАСТЬ ЧАТА
// ============================================

import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import ReasoningBlock from './ReasoningBlock';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  streamingReasoning: string;
  userName?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, streamingContent, streamingReasoning, userName }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, streamingReasoning]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">Cogniflux</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Выберите модель и училю, затем напишите сообщение. 
            AI готов помочь вам с любыми задачами.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 border border-gray-700/50 rounded-xl text-left">
              <p className="text-xs text-gray-400 mb-1">💡 Совет</p>
              <p className="text-xs text-gray-300">Будьте конкретны в запросах для лучших результатов</p>
            </div>
            <div className="p-3 bg-white/5 border border-gray-700/50 rounded-xl text-left">
              <p className="text-xs text-gray-400 mb-1">🛠️ Инструменты</p>
              <p className="text-xs text-gray-300">Включите размышление, код или функции для расширения возможностей</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} userName={userName} />
      ))}

      {/* Индикатор загрузки / streaming */}
      {isLoading && (
        <div className="flex gap-3 animate-fadeIn">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm">
            🤖
          </div>
          <div className="max-w-[85%]">
            {/* Streaming reasoning */}
            {streamingReasoning && (
              <ReasoningBlock content={streamingReasoning} isStreaming={!streamingContent} />
            )}

            {/* Streaming content */}
            <div className="px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-2xl rounded-tl-sm">
              {streamingContent ? (
                <div className="text-sm text-gray-100">
                  <MarkdownRenderer content={streamingContent} />
                  <span className="inline-block w-1.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle" />
                </div>
              ) : !streamingReasoning ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

// Импортируем для использования в streaming
import MarkdownRenderer from './MarkdownRenderer';

export default ChatArea;
