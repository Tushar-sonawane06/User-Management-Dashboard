import { useState, useEffect, useCallback, useRef } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userApi';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const usersRef = useRef([]);          // always mirrors users state synchronously
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(signal);
      usersRef.current = data;
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
      id: Date.now(),   // unique local key (JSONPlaceholder always echoes id: 11)
      _localOnly: true, // this user has no real server record — skip PUT/DELETE
      company: { name: data.companyName || data.company?.name || '' },
    };
    usersRef.current = [newUser, ...usersRef.current];
    setUsers(usersRef.current);
    return newUser;
  }, []);

  const editUser = useCallback(async (id, data) => {
    // Check _localOnly synchronously before any async work
    const isLocalOnly = usersRef.current.find((u) => u.id === id)?._localOnly;

    // Optimistic update
    const next = usersRef.current.map((u) =>
      u.id === id
        ? { ...u, ...data, company: { ...u.company, name: data.companyName || u.company?.name } }
        : u
    );
    const snapshot = usersRef.current;
    usersRef.current = next;
    setUsers(next);

    // Locally-created users have no server record — skip the API call
    if (isLocalOnly) return data;

    try {
      const updated = await updateUser(id, data);
      // Reconcile with server response
      const reconciled = usersRef.current.map((u) =>
        u.id === id
          ? { ...u, ...updated, company: { ...u.company, name: data.companyName || u.company?.name } }
          : u
      );
      usersRef.current = reconciled;
      setUsers(reconciled);
      return updated;
    } catch (err) {
      // Roll back
      usersRef.current = snapshot;
      setUsers(snapshot);
      throw err;
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    // Check _localOnly synchronously before any async work
    const isLocalOnly = usersRef.current.find((u) => u.id === id)?._localOnly;

    // Optimistic removal
    const snapshot = usersRef.current;
    const next = usersRef.current.filter((u) => u.id !== id);
    usersRef.current = next;
    setUsers(next);

    // Locally-created users have no server record — skip the API call
    if (isLocalOnly) return;

    try {
      await deleteUser(id);
    } catch (err) {
      // Roll back
      usersRef.current = snapshot;
      setUsers(snapshot);
      throw err;
    }
  }, []);

  return { users, loading, error, retry, addUser, editUser, removeUser };
}
