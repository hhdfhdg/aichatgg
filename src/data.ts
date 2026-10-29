// ============================================
// ДАННЫЕ - Модели, промпты, начальные данные
// ============================================

import { Model, SystemPrompt, UserProfile, Chat, ChatCapabilities } from './types';

// Доступные модели (легко расширить)
export const models: Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Самая мощная модель OpenAI',
    maxTokens: 8192,
    provider: 'OpenAI',
    supportsReasoning: false,
    supportsCodeExecution: true,
    supportsFunctions: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Быстрая и экономичная модель',
    maxTokens: 4096,
    provider: 'OpenAI',
    supportsReasoning: false,
    supportsCodeExecution: false,
    supportsFunctions: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Мощная модель от Anthropic',
    maxTokens: 4096,
    provider: 'Anthropic',
    supportsReasoning: true,
    supportsCodeExecution: true,
    supportsFunctions: true,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Баланс скорости и качества',
    maxTokens: 4096,
    provider: 'Anthropic',
    supportsReasoning: true,
    supportsCodeExecution: true,
    supportsFunctions: true,
  },
  {
    id: 'o1-preview',
    name: 'o1 Preview',
    description: 'Модель с глубоким размышлением',
    maxTokens: 8192,
    provider: 'OpenAI',
    supportsReasoning: true,
    supportsCodeExecution: true,
    supportsFunctions: true,
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    description: 'Открытая модель Meta',
    maxTokens: 8192,
    provider: 'Meta',
    supportsReasoning: false,
    supportsCodeExecution: false,
    supportsFunctions: true,
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    description: 'Мощная европейская модель',
    maxTokens: 4096,
    provider: 'Mistral',
    supportsReasoning: false,
    supportsCodeExecution: false,
    supportsFunctions: true,
  },
];

// Системные промпты / "Училии"
export const systemPrompts: SystemPrompt[] = [
  {
    id: 'assistant',
    name: 'Помощник',
    description: 'Универсальный AI помощник',
    content: 'You are a helpful, creative, and friendly AI assistant. You provide clear and accurate responses.',
    icon: '🤖',
  },
  {
    id: 'coder',
    name: 'Программист',
    description: 'Эксперт в программировании',
    content: 'You are an expert software developer. You write clean, efficient code and explain technical concepts clearly. Always provide code examples when relevant.',
    icon: '💻',
  },
  {
    id: 'writer',
    name: 'Писатель',
    description: 'Креативный писатель',
    content: 'You are a creative writer with expertise in storytelling, poetry, and various literary styles. Help users with creative writing tasks.',
    icon: '✍️',
  },
  {
    id: 'teacher',
    name: 'Учитель',
    description: 'Терпеливый преподаватель',
    content: 'You are a patient and knowledgeable teacher. You explain concepts step by step, use analogies, and check for understanding. Adapt your explanations to the student\'s level.',
    icon: '📚',
  },
  {
    id: 'translator',
    name: 'Переводчик',
    description: 'Профессиональный переводчик',
    content: 'You are a professional translator fluent in many languages. Provide accurate translations with cultural context when needed.',
    icon: '🌍',
  },
  {
    id: 'analyst',
    name: 'Аналитик',
    description: 'Бизнес-аналитик',
    content: 'You are a business analyst. You analyze data, identify trends, and provide actionable insights. Use structured approaches and frameworks.',
    icon: '📊',
  },
];

// Профиль пользователя
export const defaultProfile: UserProfile = {
  name: 'Пользователь',
  avatar: '',
  email: 'user@example.com',
  plan: 'Pro',
};

// Начальные capabilities
export const defaultCapabilities: ChatCapabilities = {
  reasoning: false,
  codeExecution: false,
  functions: false,
};

// Начальный чат
export const createNewChat = (
  model: string = 'gpt-3.5-turbo',
  prompt: string = 'assistant',
  capabilities: ChatCapabilities = defaultCapabilities
): Chat => ({
  id: Date.now().toString(),
  title: 'Новый чат',
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  model,
  prompt,
  capabilities,
});
