// app/components/ui/DocumentList.tsx

'use client';

import { Document } from '@/types';
import Link from 'next/link';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
}

export default function DocumentList({ documents, onDelete }: DocumentListProps) {
  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      onDelete(id);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
          No documents yet
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
          Create your first documentation to get started
        </p>
        <Link
          href="/editor"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Create Document
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Link href={`/editor?id=${doc.id}`}>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  {doc.title}
                </h2>
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Updated {new Date(doc.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(doc.id, doc.title)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
            >
              
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}