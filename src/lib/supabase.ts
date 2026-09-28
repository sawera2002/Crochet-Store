import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ogfapocufuxzrvpckpfc.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_scsErn1N24X1TO5-BHIOEw_df7uvFbP';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
