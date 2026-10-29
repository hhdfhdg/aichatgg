// ============================================
// ОСНОВНАЯ ОБЛАСТЬ ЧАТА
// ============================================

import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  userName?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, streamingContent, userName }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-white mb-2">Начните диалог</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Выберите модель и училю, затем напишите сообщение. 
            Нейросеть готова помочь вам с любыми задачами.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 border border-gray-700/50 rounded-xl text-left">
              <p className="text-xs text-gray-400 mb-1">💡 Совет</p>
              <p className="text-xs text-gray-300">Будьте конкретны в запросах для лучших результатов</p>
            </div>
            <div className="p-3 bg-white/5 border border-gray-700/50 rounded-xl text-left">
              <p className="text-xs text-gray-400 mb-1">🎯 Контекст</p>
              <p className="text-xs text-gray-300">Модель помнит историю текущего диалога</p>
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

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="flex gap-3 animate-fadeIn">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm">
            🤖
          </div>
          <div className="px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-2xl rounded-tl-sm">
            {streamingContent ? (
              <p className="text-sm text-gray-100 whitespace-pre-wrap">
                {streamingContent}
                <span className="inline-block w-1.5 h-4 bg-violet-400 animate-pulse ml-0.5" />
              </p>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatArea;
