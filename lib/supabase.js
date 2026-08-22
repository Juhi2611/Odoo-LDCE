import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxyixxpaksifehbpaatf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94eWl4eHBha3NpZmVoYnBhYXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODY4ODEsImV4cCI6MjEwMjk2Mjg4MX0.83Zjmj78crEZ2V8z7gXiPOHfoZKyklRP3Y0Kl2niKlc';

// Safe initialized Supabase client: only active if valid credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
