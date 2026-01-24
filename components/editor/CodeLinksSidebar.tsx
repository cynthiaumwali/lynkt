
'use client';

import { CodeLink } from '@/types';
import { AlertCircle, Check, Lamp, Paperclip } from 'lucide-react';

interface CodeLinksSidebarProps {
  codeLinks: CodeLink[];
  onCheckChanges: () => void;
  isChecking: boolean;
}

export default function CodeLinksSidebar({
  codeLinks,
  onCheckChanges,
  isChecking
}: CodeLinksSidebarProps) {
  const staleCount = codeLinks.filter(link => link.isStale).length;
  const upToDateCount = codeLinks.length - staleCount;

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-750">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          <Paperclip className="inline size-4" /> Linked Code
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {codeLinks.length} file{codeLinks.length !== 1 ? 's' : ''} linked
        </p>
      </div>

      {/* Check Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onCheckChanges}
          disabled={isChecking || codeLinks.length === 0}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2 text-sm"
        >
          {isChecking ? (
            <>
              <span className="animate-spin">⏳</span>
              Checking...
            </>
          ) : (
            <>
              Check for Changes
            </>
          )}
        </button>
      </div>

      {/* Code Links List */}
      <div className="p-4 space-y-3 max-h-150 overflow-y-auto">
        {codeLinks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No code links yet.
            <br />
            <span className="text-xs">Use syntax: github:repo/file.js#L10-20</span>
          </div>
        ) : (
          codeLinks.map((link) => (
            <div
              key={link.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 hover:shadow-md transition"
            >
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{link.isStale ? (
                  <AlertCircle className="text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <Check className="text-green-600 dark:text-green-400" />
                )}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${link.isStale
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                  {link.isStale ? 'STALE' : 'UP TO DATE'}
                </span>
              </div>

              {/* File Info */}
              <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all mb-1">
                {link.filePath}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Lines {link.lineStart}-{link.lineEnd}
              </p>

              {/* Last Checked */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Checked {getTimeSince(link.lastChecked)}
                </span>
              </div>

              {/* Stale Warning */}
              {link.isStale && (
                <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-400">
                  <Lamp className="text-yellow-200" /> Code changed - review needed
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {codeLinks.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
          <div className="flex items-center justify-between text-xs">
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
              {staleCount} stale
            </span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              {upToDateCount} up to date
            </span>
          </div>
        </div>
      )}
    </div>
  );
}