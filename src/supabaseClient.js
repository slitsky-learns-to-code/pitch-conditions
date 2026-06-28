import { createClient } from '@supabase/supabase-js'

// Read the keys Vite injected from .env.local at build time. Only variables
// prefixed with VITE_ are exposed to the browser — that's intentional.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail loudly in dev if the env file is missing, instead of a confusing
// "fetch failed" later on.
if (!url || !anonKey) {
  console.error(
    'Missing Supabase env vars. Copy .env.example to .env.local and fill them in.',
  )
}

// A single shared client for the whole app. It persists the session in
// localStorage and automatically picks up the session from the URL after a
// magic-link redirect (detectSessionInUrl defaults to true).
export const supabase = createClient(url, anonKey)
