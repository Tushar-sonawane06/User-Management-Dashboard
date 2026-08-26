import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const getUsers = (signal) =>
  api.get('/users', { signal }).then((r) => r.data);

export const getUser = (id, signal) =>
  api.get(`/users/${id}`, { signal }).then((r) => r.data);

export const createUser = (data) =>
  api.post('/users', data).then((r) => r.data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data).then((r) => r.data);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`).then((r) => r.data);

export const getUserPosts = (userId, signal) =>
  api.get('/posts', { params: { userId }, signal }).then((r) => r.data);
