'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Document } from '@/types';
import DocumentList from '../components/pages/DocumentList';

export default function HomePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/docs');
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/docs?id=${id}`, { method: 'DELETE' });
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    } 
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Linkt
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Documentation that stays in sync with code
              </p>
            </div>
            <Link
              href="/editor"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm"
            >
              + Add New Document
            </Link>   
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-border border-t-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading...</p>
          </div>
        ) : (
          <DocumentList documents={documents} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}