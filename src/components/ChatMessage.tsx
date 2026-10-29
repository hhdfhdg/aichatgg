// ============================================
// КОМПОНЕНТ СООБЩЕНИЯ - Отображение одного сообщения
// ============================================

import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  userName?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, userName = 'Вы' }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) return null;

  const formatContent = (content: string) => {
    // Простая обработка markdown
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Заголовки
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-3 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-3 mb-1">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-3 mb-1">{line.slice(2)}</h1>;
      // Код
      if (line.startsWith('```')) return <div key={i} className="font-mono text-xs text-gray-400">{'---'}</div>;
      // Списки
      if (line.startsWith('- ') || line.startsWith('• ')) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
      // Пустая строка
      if (line.trim() === '') return <br key={i} />;
      // Обычный текст
      return <p key={i} className="leading-relaxed">{line}</p>;
    });
  };

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
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm' 
            : 'bg-gray-800/80 border border-gray-700/50 text-gray-100 rounded-tl-sm'
        }`}>
          <div className="text-sm whitespace-pre-wrap">
            {formatContent(message.content)}
          </div>
        </div>
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
