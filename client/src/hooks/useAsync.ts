import { useState, useCallback } from 'react';
import type { AsyncStatus } from '../types';

interface UseAsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}

interface UseAsyncReturn<T, Args extends unknown[]> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({ status: 'loading', data: null, error: null });
      try {
        const result = await asyncFunction(...args);
        setState({ status: 'success', data: result, error: null });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState({ status: 'error', data: null, error: errorMessage });
        return null;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  return {
    ...state,
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    execute,
    reset,
  };
}
