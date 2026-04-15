import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase credentials missing! Admin features and data fetching will fail.');
}

// In production, we should fail fast if keys are missing
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
