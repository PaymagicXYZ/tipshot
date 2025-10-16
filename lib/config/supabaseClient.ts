import { createClient } from '@supabase/supabase-js';
import { env } from './env';
import { Database } from '../types/supabase';

export const supabaseClient = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);
