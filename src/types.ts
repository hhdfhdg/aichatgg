// ============================================
// ТИПЫ - Все типы данных для чата с нейросетью
// ============================================

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  model?: string;
  // reasoning (размышление модели)
  reasoning?: string;
  // вызовы инструментов
  toolCalls?: ToolCall[];
  // результат выполнения кода
  codeExecution?: CodeExecutionResult;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: string;
}

export interface CodeExecutionResult {
  code: string;
  language: string;
  output: string;
  error?: string;
  status: 'running' | 'success' | 'error';
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
  prompt: string;
  // Состояние возможностей
  capabilities: ChatCapabilities;
}

export interface ChatCapabilities {
  reasoning: boolean;      // Размышление (thinking)
  codeExecution: boolean;  // Выполнение кода
  functions: boolean;      // Использование функций/инструментов
}

export interface Model {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  provider: string;
  supportsReasoning?: boolean;
  supportsCodeExecution?: boolean;
  supportsFunctions?: boolean;
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
  capabilities: ChatCapabilities;
}
