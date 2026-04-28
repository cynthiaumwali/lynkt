'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
}

export default function MarkdownEditor({
  initialContent = '',
  onContentChange
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  const handleChange = (value: string) => {
    setContent(value);
    onContentChange(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-750 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          {showPreview ? 'Preview' : 'Editor'}
        </h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Content */}
      {showPreview ? (
        <div className="p-8 prose dark:prose-invert max-w-none min-h-150">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || '*No content yet*'}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full h-150 p-6 bg-transparent focus:outline-none resize-none font-mono text-sm text-gray-900 dark:text-gray-100"
          placeholder={
            `Write your documentation in Markdown...

                Example:
                # Authentication System

                Our app uses JWT tokens for authentication.

                Implementation: github:username/reponame/src/auth.js#L10-20

                ## How it works
                - User logs in
                - Server generates JWT
                - Token stored in localStorage`
          }
        />
      )}
    </div>
  );
}