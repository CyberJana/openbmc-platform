import { useCallback, useState } from 'react';

export function useFetch<T>(request: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request();
      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [request]);

  return { data, loading, error, execute };
}
