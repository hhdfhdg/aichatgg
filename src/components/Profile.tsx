// ============================================
// КОМПОНЕНТ ПРОФИЛЯ - Аватар и информация
// ============================================

import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onProfileUpdate?: (profile: Partial<UserProfile>) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onProfileUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 w-full"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-white truncate">{profile.name}</p>
          <p className="text-xs text-gray-400 truncate">{profile.plan} план</p>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-2xl z-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{profile.name}</p>
              <p className="text-xs text-gray-400">{profile.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
              <span>⚙️</span> Настройки
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
              <span>🔑</span> API Ключи
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2">
              <span>🚪</span> Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
