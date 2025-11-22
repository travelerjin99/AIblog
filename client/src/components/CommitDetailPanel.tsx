import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Commit, AsyncStatus } from '../types';

interface CommitDetailPanelProps {
  commit: Commit | null;
  summary: string;
  status: AsyncStatus;
  error: string | null;
  onGenerateSummary: (commit: Commit) => void;
  onSaveAsBlogPost: (title: string, content: string) => void;
}

const CommitDetailPanel: React.FC<CommitDetailPanelProps> = ({
  commit,
  summary,
  status,
  error,
  onGenerateSummary,
  onSaveAsBlogPost,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(summary);

  useEffect(() => {
    setEditedContent(summary);
    setIsEditing(false);
  }, [summary]);

  if (!commit) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p className="text-lg">Select a commit to view details</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const title = commit.commit.message.split('\n')[0];
    onSaveAsBlogPost(title, editedContent);
  };

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const hasSummary = summary && status === 'success';

  return (
    <div className="h-full flex flex-col">
      {/* Selected Commit Header */}
      <div className="border-b border-white/10 pb-4 mb-4">
        <h2 className="text-xl font-bold text-white mb-3">Selected Commit</h2>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white font-medium mb-2 line-clamp-2">
            {commit.commit.message.split('\n')[0]}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>{commit.commit.author.name}</span>
            <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">AI Summary</h3>
          <div className="flex gap-2">
            {!hasSummary && !isLoading && (
              <button
                onClick={() => onGenerateSummary(commit)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition duration-200"
              >
                Generate Summary
              </button>
            )}
            {hasSummary && !isLoading && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition duration-200"
                >
                  {isEditing ? 'Preview' : 'Edit'}
                </button>
                <button
                  onClick={() => onGenerateSummary(commit)}
                  className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white text-sm rounded-lg transition duration-200"
                >
                  Regenerate
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white/5 rounded-lg p-4 min-h-0">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p className="text-white">Generating summary...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          )}

          {isError && error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              <h4 className="font-semibold mb-2">Error</h4>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !isError && !hasSummary && (
            <div className="text-center text-gray-400 py-12">
              <p>Click "Generate Summary" to create an AI summary for this commit</p>
            </div>
          )}

          {!isLoading && !isError && hasSummary && (
            isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-full min-h-[300px] bg-gray-800/50 text-gray-200 p-4 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-mono text-sm"
                placeholder="Edit your blog post content..."
              />
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold text-white mb-3 mt-6 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-white mb-2 mt-4">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-200 mb-3 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-200 mb-3 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-gray-200 mb-3 space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-200 leading-relaxed">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-800 text-gray-200 p-3 rounded-lg overflow-x-auto mb-3 text-sm">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-3">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-blue-400 hover:text-blue-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {editedContent}
                </ReactMarkdown>
              </div>
            )
          )}
        </div>

        {/* Save Button */}
        {hasSummary && !isLoading && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Save as Blog Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitDetailPanel;
