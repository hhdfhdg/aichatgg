// ============================================
// API МОДУЛЬ - Легко заменить на реальный API
// ============================================
// Для подключения к реальному API:
// 1. Замените sendMessage на fetch к вашему endpoint
// 2. Укажите правильный формат запроса/ответа
// 3. Добавьте обработку streaming если нужно

import { Message, APIConfig } from './types';

// Конфигурация API (легко изменить)
export const apiConfig: APIConfig = {
  endpoint: 'https://api.openai.com/v1/chat/completions', // Замените на ваш endpoint
  apiKey: '', // Вставьте ваш API ключ
  model: 'gpt-3.5-turbo',
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7,
  maxTokens: 2048,
};

// Отправка сообщения в API
export async function sendMessage(
  messages: Message[],
  config: Partial<APIConfig> = {}
): Promise<string> {
  const finalConfig = { ...apiConfig, ...config };

  // =============================================
  // РЕАЛЬНЫЙ API ВЫЗОВ (раскомментируйте и настройте):
  // =============================================
  /*
  const response = await fetch(finalConfig.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${finalConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: finalConfig.model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: finalConfig.temperature,
      max_tokens: finalConfig.maxTokens,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
  */

  // =============================================
  // ДЕМО-РЕЖИМ (удалите при подключении реального API)
  // =============================================
  return new Promise((resolve) => {
    setTimeout(() => {
      const lastMessage = messages[messages.length - 1]?.content || '';
      const responses = [
        `Я получил ваш запрос: "${lastMessage}". Это демо-ответ. Подключите реальный API в файле api.ts для полноценной работы.`,
        `Отличный вопрос! Вот что я думаю по поводу "${lastMessage}":\n\nЭто заглушка ответа. Для работы с реальными ответами нейросети, настройте API модуль.`,
        `Обрабатываю запрос... Вот предварительный ответ на "${lastMessage}".\n\nПодключите API в src/api.ts чтобы получать реальные ответы от нейросети.`,
        `Интересный запрос! "${lastMessage}"\n\nДемо-режим активен. Настройте api.ts для подключения к OpenAI, Anthropic, или другому провайдеру.`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(randomResponse);
    }, 1000 + Math.random() * 2000);
  });
}

// Streaming версия (для посимвольного вывода)
export async function sendMessageStream(
  messages: Message[],
  config: Partial<APIConfig> = {},
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await sendMessage(messages, config);
  
  // Симуляция streaming
  const words = response.split(' ');
  for (const word of words) {
    onChunk(word + ' ');
    await new Promise(r => setTimeout(r, 50));
  }
}
