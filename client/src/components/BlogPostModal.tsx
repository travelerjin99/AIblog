import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogPost: string;
  commit: Commit | null;
  loading: boolean;
  error: string;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({
  isOpen,
  onClose,
  blogPost,
  commit,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blogPost);
    alert('Blog post copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 px-8 py-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">Generated Blog Post</h2>
            {commit && (
              <p className="text-gray-400 text-sm">
                Commit: {commit.sha.slice(0, 7)} by {commit.commit.author.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-3xl font-light leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-8 py-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
              <p className="text-white text-lg">Generating your blog post...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-200">
              <h3 className="font-semibold mb-2">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && blogPost && (
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-bold text-white mb-6 mt-8 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold text-white mb-4 mt-8 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-semibold text-white mb-3 mt-6">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-200 mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-200 mb-4 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-200 mb-4 space-y-2">
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
                  em: ({ children }) => (
                    <em className="text-blue-300">
                      {children}
                    </em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-4">
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
                {blogPost}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && blogPost && (
          <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/10 px-8 py-4 flex items-center justify-end gap-3">
            <button
              onClick={copyToClipboard}
              className="px-6 py-2 bg-blue-600/80 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200"
            >
              Copy Content
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700/80 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostModal;
