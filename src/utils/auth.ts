import users from '../data/users.json';
import type { User } from '../types';

export const loginUser = (username: string, password: string): string | null => {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return null;

  const token = btoa(JSON.stringify(user));
  return token;
};

export const getUserFromToken = (): User | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const userData = JSON.parse(atob(token));
    return userData as User;
  } catch {
    return null;
  }
};
