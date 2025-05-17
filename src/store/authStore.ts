import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      logout: () => {
        set({ user: null, error: null, isLoading: false });
        localStorage.removeItem('auth-storage'); // Clear from localStorage
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage, // Required for SSR compatibility
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);

export default useAuthStore;