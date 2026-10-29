// ============================================
// ТИПЫ - Все типы данных для чата с нейросетью
// ============================================

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
  prompt: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  provider: string;
}

export interface SystemPrompt {
  id: string;
  name: string;
  description: string;
  content: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  plan: string;
}

export interface ContextInfo {
  usedTokens: number;
  maxTokens: number;
  messageCount: number;
}

export interface APIConfig {
  endpoint: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}
