import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Safe initialized Supabase client: only active if valid credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
