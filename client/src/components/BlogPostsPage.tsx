import { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import type { BlogPost } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPostsPageProps {
  onBack: () => void;
}

const POSTS_PER_PAGE = 5;

const BlogPostsPage: React.FC<BlogPostsPageProps> = ({ onBack }) => {
  const { state, deletePost } = useBlog();
  const { posts } = state;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Pagination logic
  const totalPosts = posts.data.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.data.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      if (expandedPostId === id) {
        setExpandedPostId(null);
      }
      // Adjust page if current page becomes empty
      if (currentPosts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Post content copied to clipboard!');
  };

  const toggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Saved Blog Posts</h1>
            <p className="text-gray-300">
              {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} saved
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Commits
          </button>
        </div>

        {/* Loading State */}
        {posts.status === 'loading' && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error State */}
        {posts.status === 'error' && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-red-200">
            {posts.error}
          </div>
        )}

        {/* Empty State */}
        {posts.status === 'success' && totalPosts === 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">No saved posts yet</h2>
            <p className="text-gray-400">Generate and save summaries from commits to see them here</p>
          </div>
        )}

        {/* Posts List */}
        {posts.status === 'success' && totalPosts > 0 && (
          <div className="space-y-6">
            {currentPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        {post.repository}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content Preview */}
                <div className="mb-4">
                  <div
                    className={`prose prose-invert prose-sm max-w-none ${
                      expandedPostId === post.id ? '' : 'line-clamp-3'
                    }`}
                  >
                    {expandedPostId === post.id ? (
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
                        }}
                      >
                        {post.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-gray-300">{post.content.substring(0, 200)}...</p>
                    )}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-sm rounded-lg transition duration-200"
                  >
                    {expandedPostId === post.id ? 'Show Less' : 'Read More'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(post.content)}
                    className="px-4 py-2 bg-gray-600/80 hover:bg-gray-600 text-white text-sm rounded-lg transition duration-200"
                  >
                    Copy Content
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-sm rounded-lg transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition duration-200"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition duration-200"
            >
              Next
            </button>
          </div>
        )}

        {/* Page Info */}
        {totalPages > 1 && (
          <div className="mt-4 text-center text-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostsPage;
