// src/services/authService.ts

import type { AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export const signUp = async (
  email: string,
  password: string,
  role: 'parent' | 'child',
  captchaToken: string
) => {
  try {
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        data: {
          role,
        },
      },
    });

    if (authError) throw authError;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError, 'Signup failed'),
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError, 'Sign in failed'),
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'Google sign-in failed'),
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError, 'Sign out failed'),
    };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError, 'Password reset failed'),
    };
  }
};
