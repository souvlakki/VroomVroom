// src/stores/authStore.ts

import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { signIn, signUp, signOut, forgotPassword } from '../services/authService';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, role: 'parent' | 'child') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  signUp: async (email, password, role) => {
    set({ loading: true, error: null });
    try {
      const response = await signUp(email, password, role);
      if (!response.success) throw new Error(response.error);
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await signIn(email, password);
      if (!response.success) throw new Error(response.error);
      set({ user: response.user, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const response = await signOut();
      if (!response.success) throw new Error(response.error);
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await forgotPassword(email);
      if (!response.success) throw new Error(response.error);
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
}));
