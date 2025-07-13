import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  email: string;
  friendCode: string;
  coins: number;
  unlockedLevels: number;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        });
        return true;
      } else {
        set({ 
          error: data.error || 'Login failed', 
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: 'Could not connect to server', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null 
        });
        return true;
      } else {
        set({ 
          error: data.error || 'Registration failed', 
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: 'Could not connect to server', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    fetch('/api/auth/logout', { 
      method: 'POST',
      credentials: 'include'
    }).catch(console.error);
    
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  },

  checkUsernameAvailable: async (username: string) => {
    try {
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`, {
        credentials: 'include'
      });
      const data = await response.json();
      return data.available;
    } catch (error) {
      return false;
    }
  }
}));