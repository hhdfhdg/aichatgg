# 🚀 Запуск Cogniflux

## Быстрый старт

### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

### Windows:
```bash
start.bat
```

### Вручную:
```bash
# 1. Установить зависимости
pip install -r requirements.txt
npm install

# 2. Собрать фронтенд
npm run build

# 3. Запустить сервер
python app.py
```

Откройте браузер: **http://localhost:8080**

## Подключение реального API

### OpenAI:
```bash
export AI_API_KEY="sk-..."
```

В `app.py` раскомментируйте:
```python
if API_CONFIG['provider'] == 'openai':
    response = call_openai_api(messages, model, capabilities, system_prompt)
```

### Anthropic:
```bash
export AI_API_KEY="sk-ant-..."
```

В `app.py` раскомментируйте:
```python
elif API_CONFIG['provider'] == 'anthropic':
    response = call_anthropic_api(messages, model, capabilities, system_prompt)
```

## Структура

```
cogniflux/
├── app.py              # Python сервер (Flask)
├── requirements.txt    # Python зависимости
├── start.sh           # Скрипт запуска (Linux/Mac)
├── start.bat          # Скрипт запуска (Windows)
├── src/               # Фронтенд (React)
└── dist/              # Собранный фронтенд
```

## API Endpoints

- `GET /api/health` - проверка здоровья
- `GET /api/models` - список моделей
- `POST /api/chat` - отправка сообщения
- `POST /api/chat/stream` - streaming ответ

## Возможности

- 🧠 Размышление (thinking)
- ⚡ Выполнение кода
- 🔧 Функции/инструменты
- 📝 Markdown форматирование
- 💻 Подсветка кода
- 🔄 Streaming ответы
