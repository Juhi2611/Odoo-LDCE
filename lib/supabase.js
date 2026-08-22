import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bicexhghtaudttjznwzg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Jxf9xcc1PDnnXLCcaLP5Jw_M7SPSlWb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
