// Commit types
export interface Commit {
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

// Blog post types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  commitSha: string;
  commitMessage: string;
  author: string;
  repository: string;
  createdAt: string;
  updatedAt: string;
}

// Async state pattern
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T;
  error: string | null;
}

// Blog context state
export interface BlogState {
  posts: AsyncState<BlogPost[]>;
  selectedPostId: string | null;
}

// Blog actions
export type BlogAction =
  | { type: 'SET_POSTS_LOADING' }
  | { type: 'SET_POSTS_SUCCESS'; payload: BlogPost[] }
  | { type: 'SET_POSTS_ERROR'; payload: string }
  | { type: 'ADD_POST'; payload: BlogPost }
  | { type: 'UPDATE_POST'; payload: BlogPost }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'SELECT_POST'; payload: string | null };
