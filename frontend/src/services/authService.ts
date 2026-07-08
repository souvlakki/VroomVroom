// src/services/authService.ts

import { supabase } from '../lib/supabaseClient';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

const getAppRedirectUrl = (path = '/profile') => {
  return `${window.location.origin}${path}`;
};

export const signUp = async (
  email: string,
  password: string,
  role: 'parent' | 'child',
  captchaToken: string
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        emailRedirectTo: getAppRedirectUrl('/profile'),
        data: {
          role,
        },
      },
    });

    if (error) throw error;

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'Signup failed'),
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
      error: getErrorMessage(error, 'Sign in failed'),
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    const redirectTo = getAppRedirectUrl('/profile');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
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
      error: getErrorMessage(error, 'Sign out failed'),
    };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAppRedirectUrl('/profile'),
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'Password reset failed'),
    };
  }
};
