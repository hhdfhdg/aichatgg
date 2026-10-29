// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ - Собирает всё вместе
// ============================================

import React, { useState, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import ModelSelector from './components/ModelSelector';
import PromptSelector from './components/PromptSelector';
import ContextIndicator from './components/ContextIndicator';
import CapabilitiesToolbar from './components/CapabilitiesToolbar';
import { sendMessageStream } from './api';
import { models, systemPrompts, defaultProfile, createNewChat } from './data';
import { Chat, Message, ContextInfo, ChatCapabilities } from './types';

function App() {
  // Состояние чатов
  const [chats, setChats] = useState<Chat[]>([createNewChat()]);
  const [activeChatId, setActiveChatId] = useState<string>(chats[0].id);
  
  // Состояние UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingReasoning, setStreamingReasoning] = useState('');

  // Состояние настроек
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [selectedPrompt, setSelectedPrompt] = useState('assistant');

  // Capabilities (тогглы)
  const [capabilities, setCapabilities] = useState<ChatCapabilities>({
    reasoning: false,
    codeExecution: false,
    functions: false,
  });

  // Ref для прерывания
  const abortRef = useRef(false);

  // Текущий активный чат
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const currentModel = models.find(m => m.id === selectedModel);

  // Подсчёт контекста
  const contextInfo: ContextInfo = {
    usedTokens: activeChat.messages.reduce((acc, m) => acc + Math.ceil(m.content.length / 4), 0),
    maxTokens: currentModel?.maxTokens || 4096,
    messageCount: activeChat.messages.length,
  };

  // Создание нового чата
  const handleNewChat = useCallback(() => {
    const newChat = createNewChat(selectedModel, selectedPrompt, capabilities);
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  }, [selectedModel, selectedPrompt, capabilities]);

  // Удаление чата
  const handleDeleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      if (filtered.length === 0) {
        const newChat = createNewChat(selectedModel, selectedPrompt, capabilities);
        setActiveChatId(newChat.id);
        return [newChat];
      }
      if (chatId === activeChatId) {
        setActiveChatId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeChatId, selectedModel, selectedPrompt, capabilities]);

  // Переключение capability
  const handleToggleCapability = useCallback((key: keyof ChatCapabilities) => {
    setCapabilities(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Отправка сообщения
  const handleSend = useCallback(async (content: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Обновляем чат с новым сообщением
    setChats(prev => prev.map(chat => {
      if (chat.id !== activeChatId) return chat;
      const updatedMessages = [...chat.messages, userMessage];
      const title = chat.messages.length === 0 ? content.slice(0, 40) + (content.length > 40 ? '...' : '') : chat.title;
      return { ...chat, messages: updatedMessages, title, updatedAt: Date.now(), model: selectedModel, prompt: selectedPrompt, capabilities };
    }));

    setIsLoading(true);
    setStreamingContent('');
    setStreamingReasoning('');
    abortRef.current = false;

    try {
      // Получаем все сообщения текущего чата + новое
      const currentChat = chats.find(c => c.id === activeChatId);
      const allMessages = [...(currentChat?.messages || []), userMessage];

      // Получаем системный промпт
      const prompt = systemPrompts.find(p => p.id === selectedPrompt);
      const systemMessage: Message = {
        id: 'system',
        role: 'system',
        content: prompt?.content || '',
        timestamp: Date.now(),
      };

      let fullResponse = '';
      let fullReasoning = '';
      
      await sendMessageStream(
        [systemMessage, ...allMessages],
        { model: selectedModel, capabilities },
        // onChunk - основной ответ
        (chunk) => {
          if (abortRef.current) return;
          fullResponse += chunk;
          setStreamingContent(fullResponse);
        },
        // onReasoning - размышление
        (chunk) => {
          if (abortRef.current) return;
          fullReasoning += chunk;
          setStreamingReasoning(fullReasoning);
        },
      );

      // Добавляем ответ в чат
      if (!abortRef.current && fullResponse) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullResponse,
          timestamp: Date.now(),
          model: selectedModel,
          reasoning: fullReasoning || undefined,
        };

        setChats(prev => prev.map(chat => {
          if (chat.id !== activeChatId) return chat;
          return { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: Date.now() };
        }));
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
      setStreamingReasoning('');
    }
  }, [activeChatId, chats, isLoading, selectedModel, selectedPrompt, capabilities]);

  // Остановка генерации
  const handleStop = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
  }, []);

  // Смена модели
  const handleModelChange = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    setChats(prev => prev.map(chat => {
      if (chat.id !== activeChatId) return chat;
      return { ...chat, model: modelId };
    }));
  }, [activeChatId]);

  // Смена промпта
  const handlePromptChange = useCallback((promptId: string) => {
    setSelectedPrompt(promptId);
    setChats(prev => prev.map(chat => {
      if (chat.id !== activeChatId) return chat;
      return { ...chat, prompt: promptId };
    }));
  }, [activeChatId]);

  return (
    <div className="h-screen w-screen flex bg-gray-950 text-white overflow-hidden">
      {/* Боковая панель */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { setActiveChatId(id); setSidebarOpen(false); }}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        profile={defaultProfile}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Основная область */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Верхняя панель */}
        <header className="flex items-center gap-2 px-4 py-3 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
          {/* Кнопка меню (мобильная) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Логотип Cogniflux */}
          <div className="flex items-center gap-2 mr-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/20">
              C
            </div>
            <span className="text-sm font-semibold text-white hidden sm:block">Cogniflux</span>
          </div>

          {/* Селекторы */}
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onSelectModel={handleModelChange}
            />
            <PromptSelector
              prompts={systemPrompts}
              selectedPrompt={selectedPrompt}
              onSelectPrompt={handlePromptChange}
            />
            <CapabilitiesToolbar
              capabilities={capabilities}
              onToggleCapability={handleToggleCapability}
              currentModel={currentModel}
            />
          </div>

          {/* Индикатор контекста */}
          <div className="hidden md:block w-56">
            <ContextIndicator context={contextInfo} />
          </div>
        </header>

        {/* Мобильный индикатор контекста */}
        <div className="md:hidden px-4 pt-2">
          <ContextIndicator context={contextInfo} />
        </div>

        {/* Область чата */}
        <ChatArea
          messages={activeChat.messages}
          isLoading={isLoading}
          streamingContent={streamingContent}
          streamingReasoning={streamingReasoning}
          userName={defaultProfile.name}
        />

        {/* Поле ввода */}
        <div className="p-4 border-t border-gray-800/50 bg-gray-900/30">
          <div className="max-w-4xl mx-auto">
            <MessageInput
              onSend={handleSend}
              isLoading={isLoading}
              onStop={handleStop}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
