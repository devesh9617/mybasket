import { useState, useCallback } from 'react';

/**
 * Generic async data fetching hook with loading, error, and data states.
 *
 * @param {Function} asyncFn - The async function to call
 * @returns {{ execute, data, isLoading, error, reset }}
 */
const useAsync = (asyncFn) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await asyncFn(...args);
        setData(result);
        return result;
      } catch (err) {
        const message = err.userMessage || err.message || 'An error occurred';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { execute, data, isLoading, error, reset };
};

export default useAsync;
