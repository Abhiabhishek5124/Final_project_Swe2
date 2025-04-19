// lib/supabase/server.ts
import { cookies as nextCookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export async function createSupabaseServerClient() {
  const cookieStore = await nextCookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        getAll: () => cookieStore.getAll(),
        set: (name: string, value: string, options?: any) => cookieStore.set({ name, value, ...options }),
        remove: (name: string, options?: any) => cookieStore.delete({ name, ...options })
      }
    }
  )
}