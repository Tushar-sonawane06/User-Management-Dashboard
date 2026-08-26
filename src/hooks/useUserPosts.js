import { useState, useEffect } from 'react';
import { getUserPosts } from '../services/userApi';

export function useUserPosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setPosts([]);

    getUserPosts(userId, controller.signal)
      .then((data) => setPosts(data))
      .catch((err) => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError('Failed to load posts');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [userId]);

  return { posts, loading, error };
}
