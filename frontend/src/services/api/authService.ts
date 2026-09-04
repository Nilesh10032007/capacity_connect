import { User, UserRole } from '../../types';
import { fetchApi } from './apiClient';

export const authService = {
  async login(email?: string, password?: string): Promise<{user: User, token: string, role: UserRole}> {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return data; // { token, user, role }
  },

  async getCurrentUser(): Promise<User> {
    return fetchApi('/users/me');
  },

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    return fetchApi('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }
};
