#!/usr/bin/env python3
"""
Cogniflux - AI Chat Server
Запускает фронтенд на порту 8080 и предоставляет API для чата с AI
"""

import os
import json
import time
import random
from pathlib import Path
from typing import Optional, Dict, List, Any
from flask import Flask, send_from_directory, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)

# ============================================
# КОНФИГУРАЦИЯ
# ============================================

# Путь к собранному фронтенду
DIST_DIR = Path(__file__).parent / 'dist'

# API конфигурация (замените на реальные значения)
API_CONFIG = {
    'provider': 'demo',  # 'openai', 'anthropic', 'demo'
    'api_key': os.getenv('AI_API_KEY', ''),
    'endpoint': os.getenv('AI_ENDPOINT', ''),
    'model': 'gpt-3.5-turbo',
}

# ============================================
# СТАТИЧЕСКИЕ ФАЙЛЫ (Фронтенд)
# ============================================

@app.route('/')
def serve_index():
    """Главная страница"""
    return send_from_directory(DIST_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Обслуживание статических файлов"""
    return send_from_directory(DIST_DIR, path)

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка здоровья сервера"""
    return jsonify({
        'status': 'ok',
        'service': 'Cogniflux',
        'version': '1.0.0',
        'timestamp': time.time()
    })

@app.route('/api/models', methods=['GET'])
def get_models():
    """Получить список доступных моделей"""
    models = [
        {
            'id': 'gpt-4',
            'name': 'GPT-4',
            'description': 'Самая мощная модель OpenAI',
            'maxTokens': 8192,
            'provider': 'OpenAI',
            'supportsReasoning': False,
            'supportsCodeExecution': True,
            'supportsFunctions': True,
        },
        {
            'id': 'gpt-3.5-turbo',
            'name': 'GPT-3.5 Turbo',
            'description': 'Быстрая и экономичная модель',
            'maxTokens': 4096,
            'provider': 'OpenAI',
            'supportsReasoning': False,
            'supportsCodeExecution': False,
            'supportsFunctions': True,
        },
        {
            'id': 'claude-3-opus',
            'name': 'Claude 3 Opus',
            'description': 'Мощная модель от Anthropic',
            'maxTokens': 4096,
            'provider': 'Anthropic',
            'supportsReasoning': True,
            'supportsCodeExecution': True,
            'supportsFunctions': True,
        },
        {
            'id': 'claude-3-sonnet',
            'name': 'Claude 3 Sonnet',
            'description': 'Баланс скорости и качества',
            'maxTokens': 4096,
            'provider': 'Anthropic',
            'supportsReasoning': True,
            'supportsCodeExecution': True,
            'supportsFunctions': True,
        },
        {
            'id': 'o1-preview',
            'name': 'o1 Preview',
            'description': 'Модель с глубоким размышлением',
            'maxTokens': 8192,
            'provider': 'OpenAI',
            'supportsReasoning': True,
            'supportsCodeExecution': True,
            'supportsFunctions': True,
        },
    ]
    return jsonify({'models': models})

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Отправка сообщения в AI
    
    Request body:
    {
        "messages": [
            {"role": "user", "content": "Привет"},
            {"role": "assistant", "content": "Здравствуйте!"}
        ],
        "model": "gpt-3.5-turbo",
        "capabilities": {
            "reasoning": false,
            "codeExecution": false,
            "functions": false
        },
        "systemPrompt": "You are a helpful assistant."
    }
    
    Response:
    {
        "content": "Ответ AI",
        "reasoning": "Ход мыслей (если включено)",
        "toolCalls": [...]
    }
    """
    try:
        data = request.get_json()
        
        messages = data.get('messages', [])
        model = data.get('model', 'gpt-3.5-turbo')
        capabilities = data.get('capabilities', {
            'reasoning': False,
            'codeExecution': False,
            'functions': False
        })
        system_prompt = data.get('systemPrompt', 'You are a helpful assistant.')
        
        # ============================================
        # РЕАЛЬНЫЙ API ВЫЗОВ (раскомментируйте и настройте)
        # ============================================
        """
        if API_CONFIG['provider'] == 'openai':
            response = call_openai_api(messages, model, capabilities, system_prompt)
        elif API_CONFIG['provider'] == 'anthropic':
            response = call_anthropic_api(messages, model, capabilities, system_prompt)
        else:
            response = generate_demo_response(messages, capabilities)
        """
        
        # ============================================
        # ДЕМО-РЕЖИМ (удалите при подключении реального API)
        # ============================================
        response = generate_demo_response(messages, capabilities)
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    """
    Streaming версия чата (Server-Sent Events)
    """
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        capabilities = data.get('capabilities', {})
        
        def generate():
            # Симуляция streaming
            response = generate_demo_response(messages, capabilities)
            
            # Отправляем reasoning
            if response.get('reasoning'):
                reasoning_words = response['reasoning'].split()
                for word in reasoning_words:
                    yield f"data: {json.dumps({'type': 'reasoning', 'content': word + ' '})}\n\n"
                    time.sleep(0.03)
            
            # Отправляем tool calls
            if response.get('toolCalls'):
                for tc in response['toolCalls']:
                    yield f"data: {json.dumps({'type': 'toolCall', 'data': tc})}\n\n"
                    time.sleep(0.5)
            
            # Отправляем основной ответ
            content_words = response['content'].split()
            for word in content_words:
                yield f"data: {json.dumps({'type': 'content', 'content': word + ' '})}\n\n"
                time.sleep(0.03)
            
            # Завершение
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        
        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ============================================

def generate_demo_response(messages: List[Dict], capabilities: Dict) -> Dict[str, Any]:
    """Генерация демо-ответа"""
    
    last_message = messages[-1]['content'] if messages else ''
    
    # Размышление
    reasoning = None
    if capabilities.get('reasoning'):
        reasoning = f"""Анализирую запрос пользователя: "{last_message[:50]}..."

Рассматриваю возможные подходы:
1. Прямой ответ на вопрос
2. Предоставление примеров
3. Структурированное объяснение

Выбираю наиболее подходящий формат ответа с учётом контекста."""
    
    # Tool calls
    tool_calls = None
    if capabilities.get('functions'):
        tool_calls = [
            {
                'id': f'call_{int(time.time())}',
                'name': 'web_search',
                'arguments': {'query': last_message[:30]},
                'status': 'success',
                'result': 'Найдено 5 релевантных результатов по запросу.'
            }
        ]
    
    # Основной ответ с markdown
    content_parts = [
        f"Отличный вопрос! Вот мой ответ на: **\"{last_message}\"**",
        "",
    ]
    
    if capabilities.get('codeExecution'):
        content_parts.extend([
            "### 🖥️ Выполнение кода",
            "```python",
            "# Анализ данных",
            "import pandas as pd",
            "",
            "data = {\"values\": [1, 2, 3, 4, 5]}",
            "df = pd.DataFrame(data)",
            "print(f\"Среднее: {df['values'].mean()}\")",
            "```",
            "",
            "> **Результат:** `Среднее: 3.0`",
            "",
        ])
    
    content_parts.extend([
        "### 📋 Основные моменты",
        "",
        "- Первый важный пункт с **жирным текстом**",
        "- Второй пункт с `инлайн-кодом`",
        "- Третий пункт со [ссылкой](https://example.com)",
        "",
        "### 💡 Дополнительная информация",
        "",
        "| Параметр | Значение |",
        "|----------|----------|",
        "| Модель | GPT-4 |",
        "| Точность | 95% |",
        "| Скорость | Быстрая |",
        "",
        "~~Зачёркнутый текст~~ и *курсив* для примера форматирования.",
    ])
    
    content = '\n'.join(content_parts)
    
    return {
        'content': content,
        'reasoning': reasoning,
        'toolCalls': tool_calls,
    }

# ============================================
# ПРИМЕРЫ РЕАЛЬНЫХ API ВЫЗОВОВ (закомментированы)
# ============================================

"""
def call_openai_api(messages, model, capabilities, system_prompt):
    import openai
    
    client = openai.OpenAI(api_key=API_CONFIG['api_key'])
    
    # Подготовка сообщений
    api_messages = [{'role': 'system', 'content': system_prompt}]
    api_messages.extend(messages)
    
    # Параметры запроса
    params = {
        'model': model,
        'messages': api_messages,
        'temperature': 0.7,
        'max_tokens': 2048,
    }
    
    # Размышление (для o1 моделей)
    if capabilities.get('reasoning') and 'o1' in model:
        params['reasoning_effort'] = 'medium'
    
    # Функции
    if capabilities.get('functions'):
        params['tools'] = get_openai_tools()
        params['tool_choice'] = 'auto'
    
    # Выполнение кода
    if capabilities.get('codeExecution'):
        if 'tools' not in params:
            params['tools'] = []
        params['tools'].append({'type': 'code_interpreter'})
    
    response = client.chat.completions.create(**params)
    
    choice = response.choices[0].message
    
    # Обработка reasoning
    reasoning = getattr(choice, 'reasoning_content', None)
    
    # Обработка tool calls
    tool_calls = None
    if choice.tool_calls:
        tool_calls = [
            {
                'id': tc.id,
                'name': tc.function.name,
                'arguments': json.loads(tc.function.arguments),
                'status': 'pending',
            }
            for tc in choice.tool_calls
        ]
    
    return {
        'content': choice.content or '',
        'reasoning': reasoning,
        'toolCalls': tool_calls,
    }


def call_anthropic_api(messages, model, capabilities, system_prompt):
    import anthropic
    
    client = anthropic.Anthropic(api_key=API_CONFIG['api_key'])
    
    # Подготовка сообщений
    api_messages = []
    for msg in messages:
        if msg['role'] != 'system':
            api_messages.append({
                'role': msg['role'],
                'content': msg['content']
            })
    
    # Параметры запроса
    params = {
        'model': model,
        'messages': api_messages,
        'system': system_prompt,
        'max_tokens': 4096,
    }
    
    # Размышление (extended thinking)
    if capabilities.get('reasoning'):
        params['thinking'] = {
            'type': 'enabled',
            'budget_tokens': 4000
        }
    
    # Инструменты
    if capabilities.get('functions'):
        params['tools'] = get_anthropic_tools()
    
    response = client.messages.create(**params)
    
    # Обработка ответа
    content = ''
    reasoning = None
    tool_calls = None
    
    for block in response.content:
        if block.type == 'text':
            content += block.text
        elif block.type == 'thinking':
            reasoning = block.thinking
        elif block.type == 'tool_use':
            if tool_calls is None:
                tool_calls = []
            tool_calls.append({
                'id': block.id,
                'name': block.name,
                'arguments': block.input,
                'status': 'pending',
            })
    
    return {
        'content': content,
        'reasoning': reasoning,
        'toolCalls': tool_calls,
    }


def get_openai_tools():
    return [
        {
            'type': 'function',
            'function': {
                'name': 'web_search',
                'description': 'Поиск информации в интернете',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'query': {
                            'type': 'string',
                            'description': 'Поисковый запрос'
                        }
                    },
                    'required': ['query']
                }
            }
        },
        {
            'type': 'function',
            'function': {
                'name': 'calculator',
                'description': 'Выполнение математических вычислений',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'expression': {
                            'type': 'string',
                            'description': 'Математическое выражение'
                        }
                    },
                    'required': ['expression']
                }
            }
        }
    ]


def get_anthropic_tools():
    return [
        {
            'name': 'web_search',
            'description': 'Поиск информации в интернете',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'query': {
                        'type': 'string',
                        'description': 'Поисковый запрос'
                    }
                },
                'required': ['query']
            }
        },
        {
            'name': 'calculator',
            'description': 'Выполнение математических вычислений',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'expression': {
                        'type': 'string',
                        'description': 'Математическое выражение'
                    }
                },
                'required': ['expression']
            }
        }
    ]
"""

# ============================================
# ЗАПУСК СЕРВЕРА
# ============================================

if __name__ == '__main__':
    # Проверка наличия dist директории
    if not DIST_DIR.exists():
        print("⚠️  Директория dist/ не найдена!")
        print("   Сначала соберите фронтенд: npm run build")
        print("")
    
    print("=" * 60)
    print("  ⚡ Cogniflux - AI Chat Server")
    print("=" * 60)
    print("")
    print(f"  🌐 Сервер запущен на: http://localhost:8080")
    print(f"  📁 Статические файлы: {DIST_DIR}")
    print(f"  🔌 API endpoint: http://localhost:8080/api/chat")
    print(f"  📊 Health check: http://localhost:8080/api/health")
    print("")
    print("  Для остановки нажмите Ctrl+C")
    print("=" * 60)
    print("")
    
    # Запуск сервера
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=False,
        threaded=True
    )
