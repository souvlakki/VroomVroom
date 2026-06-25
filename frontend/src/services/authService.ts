// src/services/authService.ts

import type { AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export const signUp = async (email: string, password: string, role: 'parent' | 'child') => {
  try {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{ user_id: data.user.id, role }])
        .select();

      if (profileError) throw profileError;
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as AuthError).message };
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
    return { success: false, error: (error as AuthError).message };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as AuthError).message };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as AuthError).message };
  }
};
