const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')
require('dotenv').config()

// IMPORTANTE: El backend usa SERVICE_ROLE_KEY, no ANON_KEY.

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,  // era SUPABASE_ANON_KEY
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    realtime: {
      transport: ws
    }
  }
)

module.exports = supabase
