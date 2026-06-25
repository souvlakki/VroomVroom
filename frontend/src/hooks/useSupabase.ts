// src/hooks/useSupabase.ts
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = 'https://lxywrtmcmfbncqnmwamt.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'sb_publishable_-jsEWk3SaMVy2hxNgP0iOg_tYa93C1Z'; // Replace with your Supabase key

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing.');
}

export const useSupabase = () => {
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseKey));

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Handle authentication state changes
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [supabase]);

  return supabase;
};
