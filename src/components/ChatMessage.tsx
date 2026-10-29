// ============================================
// КОМПОНЕНТ СООБЩЕНИЯ - С поддержкой markdown, reasoning, tools
// ============================================

import React from 'react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import ReasoningBlock from './ReasoningBlock';
import ToolCallBlock from './ToolCallBlock';

interface ChatMessageProps {
  message: Message;
  userName?: string;
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, userName = 'Вы', isStreaming = false }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) return null;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fadeIn`}>
      {/* Аватар */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
          : 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white'
      }`}>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Сообщение */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Reasoning (только для assistant) */}
        {!isUser && message.reasoning && (
          <ReasoningBlock content={message.reasoning} isStreaming={isStreaming && !message.content} />
        )}

        {/* Tool calls (только для assistant) */}
        {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
          <ToolCallBlock toolCalls={message.toolCalls} />
        )}

        {/* Основной контент */}
        {message.content && (
          <div className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm' 
              : 'bg-gray-800/80 border border-gray-700/50 text-gray-100 rounded-tl-sm'
          }`}>
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
            {isStreaming && isUser === false && (
              <span className="inline-block w-1.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        )}

        {/* Мета-информация */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${isUser ? 'justify-end' : ''}`}>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.model && !isUser && (
            <span className="text-xs text-gray-600 bg-gray-800/50 px-1.5 py-0.5 rounded">
              {message.model}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
