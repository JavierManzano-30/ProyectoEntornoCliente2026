const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

if (process.env.NODE_ENV !== 'production') {
  const keyPrefix = supabaseKey.startsWith('eyJ') ? 'eyJ' : supabaseKey.slice(0, 4);
  // eslint-disable-next-line no-console
  console.log(`[supabase] using key prefix: ${keyPrefix}`);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

module.exports = supabase;
