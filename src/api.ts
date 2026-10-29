// ============================================
// API МОДУЛЬ - Легко заменить на реальный API
// ============================================
// Для подключения к реальному API:
// 1. Замените sendMessage на fetch к вашему endpoint
// 2. Укажите правильный формат запроса/ответа
// 3. Добавьте обработку streaming если нужно
// 4. Обработайте tool_calls в ответе

import { Message, APIConfig, ChatCapabilities, ToolCall } from './types';

// Конфигурация API (легко изменить)
export const apiConfig: APIConfig = {
  endpoint: 'https://api.openai.com/v1/chat/completions', // Замените на ваш endpoint
  apiKey: '', // Вставьте ваш API ключ
  model: 'gpt-3.5-turbo',
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7,
  maxTokens: 2048,
  capabilities: {
    reasoning: false,
    codeExecution: false,
    functions: false,
  },
};

// Построение параметров запроса в зависимости от capabilities
function buildRequestParams(messages: Message[], config: Partial<APIConfig>) {
  const finalConfig = { ...apiConfig, ...config };
  const caps = finalConfig.capabilities;

  const params: Record<string, unknown> = {
    model: finalConfig.model,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
    temperature: finalConfig.temperature,
    max_tokens: finalConfig.maxTokens,
  };

  // Размышление (reasoning) — для моделей, поддерживающих extended thinking
  if (caps.reasoning) {
    params.thinking = { type: 'enabled', budget_tokens: 4000 };
    // Для Anthropic: params.thinking = { type: 'enabled', budget_tokens: 4000 }
    // Для OpenAI o1/o3: reasoning_effort: 'medium'
  }

  // Функции / инструменты
  if (caps.functions) {
    params.tools = getAvailableTools();
    params.tool_choice = 'auto';
  }

  // Выполнение кода — через code_interpreter tool
  if (caps.codeExecution) {
    const existingTools = (params.tools as unknown[]) || [];
    params.tools = [
      ...existingTools,
      {
        type: 'code_interpreter',
        // или для Anthropic: { type: 'computer_use' }
      },
    ];
  }

  return params;
}

// Список доступных инструментов (легко расширить)
function getAvailableTools() {
  return [
    {
      type: 'function',
      function: {
        name: 'web_search',
        description: 'Поиск информации в интернете',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Поисковый запрос' },
          },
          required: ['query'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'calculator',
        description: 'Выполнение математических вычислений',
        parameters: {
          type: 'object',
          properties: {
            expression: { type: 'string', description: 'Математическое выражение' },
          },
          required: ['expression'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_current_time',
        description: 'Получить текущее время и дату',
        parameters: {
          type: 'object',
          properties: {
            timezone: { type: 'string', description: 'Часовой пояс (например, Europe/Moscow)' },
          },
        },
      },
    },
  ];
}

// Отправка сообщения в API
export async function sendMessage(
  messages: Message[],
  config: Partial<APIConfig> = {}
): Promise<{ content: string; reasoning?: string; toolCalls?: ToolCall[] }> {
  const finalConfig = { ...apiConfig, ...config };

  // =============================================
  // РЕАЛЬНЫЙ API ВЫЗОВ (раскомментируйте и настройте):
  // =============================================
  /*
  const params = buildRequestParams(messages, finalConfig);

  const response = await fetch(finalConfig.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${finalConfig.apiKey}`,
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  const choice = data.choices[0].message;

  // Обработка reasoning (thinking)
  const reasoning = choice.reasoning_content || choice.thinking;

  // Обработка tool calls
  const toolCalls: ToolCall[] = (choice.tool_calls || []).map((tc: any) => ({
    id: tc.id,
    name: tc.function.name,
    arguments: JSON.parse(tc.function.arguments),
    status: 'pending' as const,
  }));

  return {
    content: choice.content || '',
    reasoning,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
  };
  */

  // =============================================
  // ДЕМО-РЕЖИМ (удалите при подключении реального API)
  // =============================================
  return new Promise((resolve) => {
    setTimeout(() => {
      const lastMessage = messages[messages.length - 1]?.content || '';
      const caps = finalConfig.capabilities;

      // Размышление
      const reasoning = caps.reasoning
        ? `Анализирую запрос пользователя: "${lastMessage.slice(0, 50)}..."\n\nРассматриваю возможные подходы:\n1. Прямой ответ на вопрос\n2. Предоставление примеров\n3. Структурированное объяснение\n\nВыбираю наиболее подходящий формат ответа с учётом контекста.`
        : undefined;

      // Tool calls
      const toolCalls: ToolCall[] | undefined = caps.functions
        ? [
            {
              id: 'call_' + Date.now(),
              name: 'web_search',
              arguments: { query: lastMessage.slice(0, 30) },
              status: 'success',
              result: 'Найдено 5 релевантных результатов по запросу.',
            },
          ]
        : undefined;

      // Основной ответ
      const response = buildDemoResponse(lastMessage, caps);
      resolve({ content: response, reasoning, toolCalls });
    }, 1000 + Math.random() * 1500);
  });
}

// Демо-ответ с markdown форматированием
function buildDemoResponse(query: string, caps: ChatCapabilities): string {
  const parts: string[] = [];

  parts.push(`Отличный вопрос! Вот мой ответ на: **"${query}"**`);
  parts.push('');

  if (caps.codeExecution) {
    parts.push('### 🖥️ Выполнение кода');
    parts.push('```python');
    parts.push('# Анализ данных');
    parts.push('import pandas as pd');
    parts.push('');
    parts.push('data = {"values": [1, 2, 3, 4, 5]}');
    parts.push('df = pd.DataFrame(data)');
    parts.push('print(f"Среднее: {df[\'values\'].mean()}")');
    parts.push('```');
    parts.push('');
    parts.push('> **Результат:** `Среднее: 3.0`');
    parts.push('');
  }

  parts.push('### 📋 Основные моменты');
  parts.push('');
  parts.push('- Первый важный пункт с **жирным текстом**');
  parts.push('- Второй пункт с `инлайн-кодом`');
  parts.push('- Третий пункт со [ссылкой](https://example.com)');
  parts.push('');

  parts.push('### 💡 Дополнительная информация');
  parts.push('');
  parts.push('| Параметр | Значение |');
  parts.push('|----------|----------|');
  parts.push('| Модель | GPT-4 |');
  parts.push('| Точность | 95% |');
  parts.push('| Скорость | Быстрая |');
  parts.push('');

  parts.push('~~Зачёркнутый текст~~ и *курсив* для примера форматирования.');

  return parts.join('\n');
}

// Streaming версия
export async function sendMessageStream(
  messages: Message[],
  config: Partial<APIConfig> = {},
  onChunk: (chunk: string) => void,
  onReasoning?: (chunk: string) => void,
  onToolCall?: (toolCall: ToolCall) => void
): Promise<void> {
  const result = await sendMessage(messages, config);

  // Симулируем reasoning stream
  if (result.reasoning && onReasoning) {
    const words = result.reasoning.split(' ');
    for (const word of words) {
      onReasoning(word + ' ');
      await new Promise(r => setTimeout(r, 30));
    }
    await new Promise(r => setTimeout(r, 300));
  }

  // Симулируем tool calls
  if (result.toolCalls && onToolCall) {
    for (const tc of result.toolCalls) {
      onToolCall({ ...tc, status: 'running' });
      await new Promise(r => setTimeout(r, 800));
      onToolCall({ ...tc, status: 'success' });
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Симулируем streaming основного ответа
  const words = result.content.split(' ');
  for (const word of words) {
    onChunk(word + ' ');
    await new Promise(r => setTimeout(r, 30));
  }
}
