import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userApi';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(signal);
      setUsers(data);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [fetchUsers]);

  const retry = useCallback(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
  }, [fetchUsers]);

  const addUser = useCallback(async (data) => {
    const response = await createUser(data);
    const newUser = {
      ...response,
      id: Date.now(), // ensure unique id since JSONPlaceholder always returns id 11
      company: { name: data.companyName || data.company?.name || '' },
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  }, []);

  const editUser = useCallback(async (id, data) => {
    // Capture snapshot before optimistic update for rollback
    let snapshot;
    setUsers((prev) => {
      snapshot = prev;
      return prev.map((u) =>
        u.id === id
          ? { ...u, ...data, company: { ...u.company, name: data.companyName || u.company?.name } }
          : u
      );
    });
    try {
      const updated = await updateUser(id, data);
      // Reconcile with server response (JSONPlaceholder echoes back)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, ...updated, company: { ...u.company, name: data.companyName || u.company?.name } }
            : u
        )
      );
      return updated;
    } catch (err) {
      // Roll back to pre-optimistic state
      if (snapshot) setUsers(snapshot);
      throw err;
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    // Capture snapshot before optimistic removal for rollback
    let snapshot;
    setUsers((prev) => {
      snapshot = prev;
      return prev.filter((u) => u.id !== id);
    });
    try {
      await deleteUser(id);
    } catch (err) {
      // Roll back to pre-optimistic state
      if (snapshot) setUsers(snapshot);
      throw err;
    }
  }, []);

  return { users, loading, error, retry, addUser, editUser, removeUser };
}
