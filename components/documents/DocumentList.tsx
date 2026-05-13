'use client';

import { formatDate } from '@/lib/utils';
import { Document } from '@/types';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { set } from 'zod';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
}

export default function DocumentList({ documents, onDelete }: DocumentListProps) {

  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    onDelete(id);
    setOpenDialogId(null);
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          No documents yet
        </h2>
        <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
          Create your first documentation to get started
        </p>
        <Link
          href="/editor"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium"
        >
          + Create Document
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Documents
        </h2>
        <Link
          href="/editor"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium mt-6 sm:mt-0"
        >
          + Create Document
        </Link>
      </div>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="rounded-lg p-4 border border-border transition hover:scale-[1.03]"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Link href={`/editor?id=${doc.id}`}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer">
                  {doc.title}
                </h2>
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Updated {formatDate(doc.updated_at)}
              </p>
            </div>
            <Dialog open={openDialogId === doc.id} onOpenChange={(open) => setOpenDialogId(open ? doc.id : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 cursor-pointer hover:bg-background">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the document.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleDelete(doc.id)} className="bg-red-600 text-white hover:bg-red-700 hover:text-white cursor-pointer">
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
}