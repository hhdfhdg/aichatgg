// ============================================
// MARKDOWN РЕНДЕРЕР - Красивое отображение markdown
// ============================================

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components: Components = {
    // Блоки кода
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');

      // Блочный код (с языком)
      if (match) {
        return <CodeBlock code={codeString} language={match[1]} />;
      }

      // Блочный код (без языка, но с переносами строк)
      if (codeString.includes('\n')) {
        return <CodeBlock code={codeString} language="text" />;
      }

      // Инлайн-код
      return (
        <code
          className="px-1.5 py-0.5 bg-gray-700/50 text-violet-300 rounded text-[0.85em] font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Заголовки
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-white mt-4 mb-2">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold text-white mt-3 mb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-white mt-3 mb-1.5">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-semibold text-white mt-2 mb-1">{children}</h4>
    ),

    // Параграф
    p: ({ children }) => (
      <p className="leading-relaxed mb-2 last:mb-0">{children}</p>
    ),

    // Ссылки
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),

    // Списки
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 my-2 ml-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 my-2 ml-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),

    // Цитаты
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-violet-500/50 pl-3 my-2 text-gray-300 italic">
        {children}
      </blockquote>
    ),

    // Таблицы
    table: ({ children }) => (
      <div className="my-3 overflow-x-auto rounded-lg border border-gray-700/50">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-800/80">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 border-b border-gray-700/50">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 text-gray-200 border-b border-gray-700/30">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-white/5 transition-colors">{children}</tr>
    ),

    // Горизонтальная линия
    hr: () => (
      <hr className="my-4 border-gray-700/50" />
    ),

    // Жирный
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),

    // Курсив
    em: ({ children }) => (
      <em className="italic text-gray-200">{children}</em>
    ),

    // Зачёркнутый
    del: ({ children }) => (
      <del className="text-gray-500">{children}</del>
    ),
  };

  return (
    <div className="markdown-content text-sm text-gray-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
