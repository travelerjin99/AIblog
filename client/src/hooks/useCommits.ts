import { useState, useCallback } from 'react';
import type { Commit, AsyncStatus } from '../types';

const API_BASE = 'http://localhost:3000/api';

interface UseCommitsReturn {
  commits: Commit[];
  status: AsyncStatus;
  error: string | null;
  fetchCommits: (owner: string, repo: string) => Promise<void>;
}

export function useCommits(): UseCommitsReturn {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchCommits = useCallback(async (owner: string, repo: string) => {
    if (!repo) {
      setError('Please enter a repository name');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/github/repos/${owner}/${repo}/commits?limit=10`
      );
      const data = await response.json();

      if (data.success) {
        setCommits(data.data);
        setStatus('success');
      } else {
        setError(data.error || 'Failed to fetch commits');
        setStatus('error');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running on port 3000.');
      setStatus('error');
    }
  }, []);

  return { commits, status, error, fetchCommits };
}
