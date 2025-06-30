import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ntrmhpmoxeflcznrdzfk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cm1ocG1veGVmbGN6bnJkemZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwODI1MzQsImV4cCI6MjA2NjY1ODUzNH0.RYiUR_Ap0JHchso4xve9HVQNbtSbSST53vQJHi6MwA4"
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
