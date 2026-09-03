import { User, UserRole } from '../../types';
import { MOCK_USERS } from '../mockData';

export const authService = {
  async login(role: UserRole, _email?: string, _password?: string): Promise<User> {
    // Simulated API delay
    await new Promise((res) => setTimeout(res, 200));
    const user = MOCK_USERS[role];
    if (!user) {
      throw new Error('Invalid user role selected');
    }
    return user;
  },

  async getCurrentUser(role: UserRole = 'trainee'): Promise<User> {
    return MOCK_USERS[role] || MOCK_USERS.trainee;
  },

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    const roleKey = Object.keys(MOCK_USERS).find((k) => MOCK_USERS[k].id === userId);
    if (roleKey) {
      MOCK_USERS[roleKey] = { ...MOCK_USERS[roleKey], ...updates };
      return MOCK_USERS[roleKey];
    }
    throw new Error('User not found');
  }
};
