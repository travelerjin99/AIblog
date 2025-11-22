import { useState, useCallback } from 'react';
import type { Commit, AsyncStatus } from '../types';

const API_BASE = 'http://localhost:3000/api';

interface UseSummaryGeneratorReturn {
  summary: string;
  status: AsyncStatus;
  error: string | null;
  generateSummary: (commit: Commit, owner: string, repo: string) => Promise<void>;
  setSummary: (summary: string) => void;
  reset: () => void;
}

export function useSummaryGenerator(): UseSummaryGeneratorReturn {
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const generateSummary = useCallback(
    async (commit: Commit, owner: string, repo: string) => {
      setStatus('loading');
      setError(null);
      setSummary('');

      try {
        const response = await fetch(`${API_BASE}/llm/generate/commit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commit, owner, repo }),
        });
        const data = await response.json();

        if (data.success) {
          setSummary(data.data.blogPost);
          setStatus('success');
        } else {
          setError(data.error || 'Failed to generate summary');
          setStatus('error');
        }
      } catch (err) {
        setError('Failed to connect to server. Make sure the backend is running on port 3000.');
        setStatus('error');
      }
    },
    []
  );

  const reset = useCallback(() => {
    setSummary('');
    setStatus('idle');
    setError(null);
  }, []);

  return {
    summary,
    status,
    error,
    generateSummary,
    setSummary,
    reset,
  };
}
