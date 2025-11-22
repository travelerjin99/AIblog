import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { BlogState, BlogAction, BlogPost, AsyncState } from '../types';

const STORAGE_KEY = 'smartblog_posts';

// Initial state
const initialPostsState: AsyncState<BlogPost[]> = {
  status: 'idle',
  data: [],
  error: null,
};

// central storage for anything related to the blog.
const initialState: BlogState = {
  posts: initialPostsState,
  selectedPostId: null,
};

// Reducer
function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'SET_POSTS_LOADING':
      return {
        ...state,
        posts: { ...state.posts, status: 'loading', error: null },
      };
    case 'SET_POSTS_SUCCESS':
      return {
        ...state,
        posts: { status: 'success', data: action.payload, error: null },
      };
    case 'SET_POSTS_ERROR':
      return {
        ...state,
        posts: { ...state.posts, status: 'error', error: action.payload },
      };
    case 'ADD_POST':
      return {
        ...state,
        posts: {   //replace post field of the state with updated post
          ...state.posts,
          data: [action.payload, ...state.posts.data],  //replace element of the posts with updated data
        },
      };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: {
          ...state.posts,
          data: state.posts.data.map((post) =>
            post.id === action.payload.id ? action.payload : post
          ),
        },
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: {
          ...state.posts,
          data: state.posts.data.filter((post) => post.id !== action.payload),
        },
        selectedPostId:
          state.selectedPostId === action.payload ? null : state.selectedPostId,
      };
    case 'SELECT_POST':
      return {
        ...state,
        selectedPostId: action.payload,
      };
    default:
      return state;
  }
}

// Context
interface BlogContextValue {
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
  loadPosts: () => void;
  savePost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => BlogPost;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;
  getPostById: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextValue | undefined>(undefined);

// Provider
export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Load posts from localStorage on mount
  const loadPosts = useCallback(() => {
    dispatch({ type: 'SET_POSTS_LOADING' });
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const posts: BlogPost[] = stored ? JSON.parse(stored) : [];
      dispatch({ type: 'SET_POSTS_SUCCESS', payload: posts });
    } catch (error) {
      dispatch({ type: 'SET_POSTS_ERROR', payload: 'Failed to load posts from storage' });
    }
  }, []);

  // Sync to localStorage whenever posts change
  useEffect(() => {
    if (state.posts.status === 'success') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.posts.data));
    }
  }, [state.posts.data, state.posts.status]);

  // Load on mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Save new post
  const savePost = useCallback(
    (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost => {
      const now = new Date().toISOString();
      const newPost: BlogPost = {
        ...postData,
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_POST', payload: newPost });
      return newPost;
    },
    []
  );

  // Update existing post
  const updatePost = useCallback((post: BlogPost) => {
    const updatedPost = {
      ...post,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_POST', payload: updatedPost });
  }, []);

  // Delete post
  const deletePost = useCallback((id: string) => {
    dispatch({ type: 'DELETE_POST', payload: id });
  }, []);

  // Get post by ID
  const getPostById = useCallback(
    (id: string) => state.posts.data.find((post) => post.id === id),
    [state.posts.data]
  );

  // make the state, dispatch, functions available to children consumers
  const value: BlogContextValue = {
    state,
    dispatch,
    loadPosts,
    savePost,
    updatePost,
    deletePost,
    getPostById,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

// Hook to use blog context
export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
