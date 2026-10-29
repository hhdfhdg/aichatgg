# Cogniflux - Модульный AI Chat

Современный чат с нейросетью с поддержкой размышлений, выполнения кода и инструментов.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
# Установка Python зависимостей
pip install -r requirements.txt

# Установка Node.js зависимостей
npm install
```

### 2. Сборка фронтенда

```bash
npm run build
```

### 3. Запуск сервера

```bash
python app.py
```

Сервер запустится на **http://localhost:8080**

## 🔌 Подключение к реальному API

### OpenAI

1. Получите API ключ на https://platform.openai.com/api-keys
2. Откройте `app.py` и раскомментируйте блок `call_openai_api`
3. Установите переменные окружения:

```bash
export AI_API_KEY="your-openai-api-key"
export AI_ENDPOINT="https://api.openai.com/v1/chat/completions"
```

4. В `app.py` измените:

```python
API_CONFIG = {
    'provider': 'openai',
    'api_key': os.getenv('AI_API_KEY', ''),
    'endpoint': os.getenv('AI_ENDPOINT', ''),
    'model': 'gpt-4',
}
```

5. Раскомментируйте вызов в функции `chat()`:

```python
if API_CONFIG['provider'] == 'openai':
    response = call_openai_api(messages, model, capabilities, system_prompt)
```

### Anthropic (Claude)

1. Получите API ключ на https://console.anthropic.com/
2. Установите переменные окружения:

```bash
export AI_API_KEY="your-anthropic-api-key"
export AI_ENDPOINT="https://api.anthropic.com/v1/messages"
```

3. В `app.py` измените:

```python
API_CONFIG = {
    'provider': 'anthropic',
    'api_key': os.getenv('AI_API_KEY', ''),
    'endpoint': os.getenv('AI_ENDPOINT', ''),
    'model': 'claude-3-opus-20240229',
}
```

4. Раскомментируйте вызов в функции `chat()`:

```python
elif API_CONFIG['provider'] == 'anthropic':
    response = call_anthropic_api(messages, model, capabilities, system_prompt)
```

## 📁 Структура проекта

```
cogniflux/
├── app.py                    # Python сервер (Flask)
├── requirements.txt          # Python зависимости
├── package.json              # Node.js зависимости
├── dist/                     # Собранный фронтенд (после npm run build)
│   ├── index.html
│   └── assets/
├── src/                      # Исходный код фронтенда
│   ├── App.tsx               # Главный компонент
│   ├── api.ts                # API модуль (фронтенд)
│   ├── types.ts              # TypeScript типы
│   ├── data.ts               # Данные: модели, промпты
│   └── components/
│       ├── Profile.tsx           # Профиль пользователя
│       ├── Sidebar.tsx           # Боковая панель
│       ├── ChatArea.tsx          # Область чата
│       ├── ChatMessage.tsx       # Сообщение
│       ├── MessageInput.tsx      # Поле ввода
│       ├── ModelSelector.tsx     # Выбор модели
│       ├── PromptSelector.tsx    # Выбор роли
│       ├── ContextIndicator.tsx  # Индикатор контекста
│       ├── Toggle.tsx            # Переключатель
│       ├── CapabilitiesToolbar.tsx # Панель возможностей
│       ├── CodeBlock.tsx         # Блок кода
│       ├── MarkdownRenderer.tsx  # Рендер markdown
│       ├── ReasoningBlock.tsx    # Размышления
│       └── ToolCallBlock.tsx     # Вызовы инструментов
└── README.md
```

## 🛠️ Возможности

### Тогглы (Capabilities)

- 🧠 **Размышление** - AI показывает ход мыслей перед ответом
- ⚡ **Выполнение кода** - AI может запускать код
- 🔧 **Функции** - доступ к внешним инструментам

### Форматирование

- Markdown (заголовки, списки, таблицы)
- Подсветка синтаксиса кода
- Копирование кода в буфер обмена
- Цитаты, ссылки, жирный/курсив/зачёркнутый

### API Endpoints

- `GET /api/health` - проверка здоровья
- `GET /api/models` - список моделей
- `POST /api/chat` - отправка сообщения
- `POST /api/chat/stream` - streaming ответ (SSE)

## 📝 Пример запроса к API

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Привет!"}
    ],
    "model": "gpt-3.5-turbo",
    "capabilities": {
      "reasoning": true,
      "codeExecution": false,
      "functions": false
    },
    "systemPrompt": "You are a helpful assistant."
  }'
```

## 🔧 Разработка

### Запуск в режиме разработки

```bash
# Терминал 1: Frontend dev server
npm run dev

# Терминал 2: Python backend
python app.py
```

### Сборка для продакшена

```bash
npm run build
python app.py
```

## 📄 Лицензия

MIT
