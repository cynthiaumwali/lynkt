'use client';

import { useEffect, useState } from 'react';
import { Document } from '@/types';
import DocumentList from '../components/documents/DocumentList';
import Profile from '@/components/auth/Profile';
import * as Sentry from '@sentry/nextjs';

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
      Sentry.captureException(error, {
        tags: {section: "dashboard", feature: "fetch-documents"},
      });
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/docs?id=${id}`, { method: 'DELETE' });

      //to be optimized by using websockets or optimistic updates
      fetchDocuments();
    } catch (error) {
      Sentry.captureException(error, {
        tags: {section: "dashboard", feature: "delete-document"},
        extra: {documentId: id}
      });
      console.error('Error deleting document:', error);
    } 
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="px-6 md:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Lynkt
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Documentation that stays in sync with code
              </p>
            </div>
            <Profile />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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