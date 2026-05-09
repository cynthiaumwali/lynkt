'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CodeLink } from '@/types';
import CodeLinksSidebar from '@/components/editor/CodeLinksSidebar';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import { toast } from 'sonner';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';


export default function EditorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get('id');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [codeLinks, setCodeLinks] = useState<CodeLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (docId) {
      fetchDocument(docId);
    }
  }, [docId]);

  const fetchDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/docs?id=${id}`);
      const doc = await res.json();
      setTitle(doc.title);
      setContent(doc.content);
      setCodeLinks(doc.codeLinks || []);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {section: "editor", feature: "fetch-document"},
        extra: {documentId: id}
      });
      toast.error('Error fetching document');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      const method = docId ? 'PUT' : 'POST';
      const res = await fetch('/api/docs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: docId,
          title,
          content,
        }),
      });

      if (res.ok) {
        const savedDoc = await res.json();
        setCodeLinks(savedDoc.codeLinks || []);
        
        if (!docId) {
          router.push(`/editor?id=${savedDoc.id}`);
        } else {
          toast.success('Document saved successfully');
          router.push('/')
        }
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {section: "editor", feature: "save-document"},
        extra: {documentId: docId}
      });
      toast.error('Error saving document');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckChanges = async () => {
    if (!docId) {
      toast.error('Save the document first');
      return;
    }

    setChecking(true);
    try {
      const res = await fetch('/api/github/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId }),
      });

      if (res.ok) {
        const result = await res.json();
        const docRes = await fetch(`/api/docs?id=${docId}`);
        const doc = await docRes.json();
        setCodeLinks(doc.codeLinks || []);

        toast.success(`Checked ${result.totalLinks} files. ${result.staleLinks} are stale.`);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {section: "editor", feature: "check-changes"},
        extra: {documentId: docId}
      });
      toast.error('Error checking for changes');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">← Back to Docs</Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
          className="w-full px-6 py-4 mb-6 text-2xl font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MarkdownEditor
              initialContent={content}
              onContentChange={setContent}
            />

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> Link to code using syntax:{' '}
                <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded font-mono text-xs">
                  github:username/reponame/src/file.js#L10-20
                </code>
              </p>
            </div>
          </div>

          {/* Links + Status Sidebar */}
          <div className="lg:col-span-1">
            <CodeLinksSidebar
              codeLinks={codeLinks}
              onCheckChanges={handleCheckChanges}
              isChecking={checking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}