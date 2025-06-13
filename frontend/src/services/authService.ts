import { api } from '../lib/api';
import type { User } from '../types/api';

export const authService = {
  // Login (you'll need to implement this endpoint in backend)
  async login(username: string, password: string): Promise<User> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return api.request<User>('/login', {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  },

  // Logout
  async logout(): Promise<void> {
    return api.post<void>('/logout');
  },

  // Get current user profile (you'll need this endpoint)
  async getCurrentUser(): Promise<User> {
    return api.get<User>('/users/profile');
  },
};