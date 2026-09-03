import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/api/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (selectedRole: UserRole, email?: string, password?: string) => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('trainee');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Initial default user load
    authService.getCurrentUser(role).then((usr) => {
      setUser(usr);
    });
  }, []);

  const login = async (selectedRole: UserRole, email?: string, password?: string) => {
    const loggedInUser = await authService.login(selectedRole, email, password);
    setRole(selectedRole);
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const switchRole = async (newRole: UserRole) => {
    const newUser = await authService.getCurrentUser(newRole);
    setRole(newRole);
    setUser(newUser);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updated = await authService.updateUserProfile(user.id, updates);
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, switchRole, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
