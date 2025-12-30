import { createBrowserClient } from '@supabase/ssr'

/**
 * Create a Supabase client for client-side operations
 * This client is used in React components and client-side code
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Provide placeholder values during build time
  if (!url || !key) {
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }
  
  return createBrowserClient(url, key)
}
