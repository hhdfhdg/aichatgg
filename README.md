# Cogniflux — Модульный чат с нейросетью

## 🏗️ Структура проекта

```
src/
├── App.tsx                    # Главный компонент (собирает всё)
├── api.ts                     # API модуль (легко заменить)
├── types.ts                   # Все TypeScript типы
├── data.ts                    # Данные: модели, промпты, начальные данные
├── index.css                  # Глобальные стили
├── main.tsx                   # Точка входа
└── components/
    ├── Profile.tsx            # Профиль пользователя
    ├── Sidebar.tsx            # Боковая панель со списком чатов
    ├── ChatArea.tsx           # Область отображения сообщений
    ├── ChatMessage.tsx        # Одно сообщение
    ├── MessageInput.tsx       # Поле ввода сообщения
    ├── ModelSelector.tsx      # Выбор модели
    ├── PromptSelector.tsx     # Выбор "училия" (системного промпта)
    └── ContextIndicator.tsx   # Индикатор использования контекста
```

## 🔌 Подключение к реальному API

### Шаг 1: Откройте `src/api.ts`

### Шаг 2: Настройте конфигурацию:
```typescript
export const apiConfig: APIConfig = {
  endpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: 'ваш-api-ключ',
  model: 'gpt-3.5-turbo',
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7,
  maxTokens: 2048,
};
```

### Шаг 3: Раскомментируйте реальный API вызов в функции `sendMessage`

### Примеры endpoint'ов:

| Провайдер | Endpoint |
|-----------|----------|
| OpenAI | `https://api.openai.com/v1/chat/completions` |
| Anthropic | `https://api.anthropic.com/v1/messages` |
| Together AI | `https://api.together.xyz/v1/chat/completions` |
| Ollama (локально) | `http://localhost:11434/api/chat` |
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` |

## 🎨 Кастомизация

### Добавить новую модель
Откройте `src/data.ts` и добавьте в массив `models`:
```typescript
{
  id: 'your-model-id',
  name: 'Название модели',
  description: 'Описание',
  maxTokens: 4096,
  provider: 'Provider Name',
}
```

### Добавить новое "училие" (системный промпт)
Откройте `src/data.ts` и добавьте в массив `systemPrompts`:
```typescript
{
  id: 'unique-id',
  name: 'Название',
  description: 'Описание роли',
  content: 'Системный промпт на английском...',
  icon: '🎯',
}
```

## 📦 Каждый компонент независим

Каждый компонент:
- Принимает данные через props
- Эмитит события через callback'и
- Не зависит от глобального состояния
- Легко тестируется изолированно

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

## 📝 Лицензия

MIT
