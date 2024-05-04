const { SUPABASE_URL, SUPABASE_SECRET_KEY } = require("./constants");
const { createClient } = require("@supabase/supabase-js");

const supabaseOptions = {
  auth: {
    persistSession: false
  }
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, supabaseOptions);
module.exports = supabase;
