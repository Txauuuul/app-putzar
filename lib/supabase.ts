import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = () => {
  return supabase;
};

// Get current user ID (anonymous)
export const getCurrentUserId = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user) {
    return null;
  }
  return data.session.user.id;
};

// Ensure anonymous authentication
export const ensureAnonymousAuth = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      console.error('Error with anonymous auth:', authError);
      return null;
    }
    return authData.user?.id;
  }
  
  return data.session.user.id;
};
