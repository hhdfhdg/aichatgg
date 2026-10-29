// ============================================
// БОКОВАЯ ПАНЕЛЬ - Список чатов и навигация
// ============================================

import React from 'react';
import { Chat } from '../types';
import Profile from './Profile';
import { UserProfile } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  profile: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  profile,
  isOpen,
  onToggle,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Вчера';
    if (days < 7) return `${days} дн. назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      {/* Overlay для мобильных */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />
      )}

      {/* Сайдбар */}
      <aside className={`fixed lg:relative z-50 h-full w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Шапка с логотипом */}
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/20">
              C
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Cogniflux</span>
          </div>
          <Profile profile={profile} />
        </div>

        {/* Кнопка нового чата */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Новый чат
          </button>
        </div>

        {/* Список чатов */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">Диалоги</p>
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Нет чатов</p>
              <p className="text-gray-600 text-xs mt-1">Создайте первый чат</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                    chat.id === activeChatId
                      ? 'bg-violet-500/15 border border-violet-500/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <span className="text-sm flex-shrink-0">💬</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(chat.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="p-3 border-t border-gray-800/50">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Система активна</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
