import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase env vars missing: EXPO_PUBLIC_SUPABASE_URL / KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
