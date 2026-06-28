// src/stores/authStore.ts

import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import {
  signIn,
  signUp,
  signOut,
  forgotPassword,
  signInWithGoogle,
} from '../services/authService';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initializeSession: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role: 'parent' | 'child',
    captchaToken: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  initializeSession: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      set({
        user: data.session?.user ?? null,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        error: getErrorMessage(error, 'Session initialization failed'),
        loading: false,
      });
    }
  },

  signUp: async (email, password, role, captchaToken) => {
    set({ loading: true, error: null });

    try {
      const response = await signUp(email, password, role, captchaToken);

      if (!response.success) {
        throw new Error(response.error);
      }

      set({ loading: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Sign up failed'),
        loading: false,
      });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await signIn(email, password);

      if (!response.success) {
        throw new Error(response.error);
      }

      set({
        user: response.user ?? null,
        loading: false,
      });

      return true;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Sign in failed'),
        loading: false,
      });

      return false;
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });

    try {
      const response = await signInWithGoogle();

      if (!response.success) {
        throw new Error(response.error);
      }

      set({ loading: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Google sign-in failed'),
        loading: false,
      });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });

    try {
      const response = await signOut();

      if (!response.success) {
        throw new Error(response.error);
      }

      set({ user: null, loading: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Sign out failed'),
        loading: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });

    try {
      const response = await forgotPassword(email);

      if (!response.success) {
        throw new Error(response.error);
      }

      set({ loading: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Password reset failed'),
        loading: false,
      });
    }
  },
}));
