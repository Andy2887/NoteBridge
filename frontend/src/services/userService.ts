import { api } from '../lib/api';
import type { User } from '../types/api';

export const userService = {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    return api.get<User[]>('/users');
  },

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  // Register new user
  async register(userData: Omit<User, 'id'>): Promise<string> {
    return api.post<string>('/users/register', userData);
  },

  // Upload profile picture
  async uploadProfilePicture(userId: number, file: File): Promise<string> {
    return api.uploadFile<string>(`/files/upload/profile/${userId}`, file);
  },
};