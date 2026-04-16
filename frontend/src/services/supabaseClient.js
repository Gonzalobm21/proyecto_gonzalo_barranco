import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jpeuehsttjjvkjcwkkrx.supabase.co';          // URL del proyecto
const supabaseAnonKey = 'sb_publishable_SSNoH9KveUHCAKJsTLTbEg_OdaPInSp';  // Publishable key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);