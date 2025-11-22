import type React from 'react';
import { useBlog } from '../context/BlogContext';
import type { BlogPost } from '../types';

interface SavedPostsListProps {
  onSelectPost: (post: BlogPost) => void;
  onClose: () => void;
}

const SavedPostsList: React.FC<SavedPostsListProps> = ({ onSelectPost, onClose }) => {
  const { state, deletePost } = useBlog();
  const { posts } = state;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Saved Posts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl font-light"
          >
            x
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-6">
          {posts.status === 'loading' && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {posts.status === 'error' && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              {posts.error}
            </div>
          )}

          {posts.status === 'success' && posts.data.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p>No saved posts yet</p>
              <p className="text-sm mt-2">Generate and save summaries to see them here</p>
            </div>
          )}

          {posts.status === 'success' && posts.data.length > 0 && (
            <div className="space-y-3">
              {posts.data.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-1 truncate">{post.title}</h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{post.repository}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, post.id)}
                      className="px-3 py-1.5 bg-red-600/50 hover:bg-red-600 text-white text-sm rounded-lg transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPostsList;
