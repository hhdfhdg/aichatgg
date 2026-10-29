#!/bin/bash

# Cogniflux - Start Script
# Автоматически собирает фронтенд и запускает сервер

echo "⚡ Cogniflux - Starting..."
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo "   Установите: https://nodejs.org/"
    exit 1
fi

# Проверка Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 не установлен!"
    echo "   Установите: https://www.python.org/"
    exit 1
fi

# Установка Python зависимостей
echo "📦 Установка Python зависимостей..."
pip3 install -r requirements.txt -q

# Установка Node.js зависимостей (если нужно)
if [ ! -d "node_modules" ]; then
    echo "📦 Установка Node.js зависимостей..."
    npm install
fi

# Сборка фронтенда
echo "🔨 Сборка фронтенда..."
npm run build

# Запуск сервера
echo ""
echo "🚀 Запуск сервера на порту 8080..."
echo ""
python3 app.py
