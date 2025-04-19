// lib/cookies.ts
import { cookies } from 'next/headers'

export const getRawCookie = (name: string) => {
  return cookies().get(name)?.value || ''
}

export const setRawCookie = (
  name: string,
  value: string,
  options: { path?: string; maxAge?: number } = {}
) => {
  cookies().set({
    name,
    value,
    path: options.path || '/',
    maxAge: options.maxAge || 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
}

// Safely parse a JSON cookie, ignoring Supabase cookies
export const getSafeJsonCookie = (name: string): any | undefined => {
  if (name.startsWith('sb-')) return undefined;
  const value = getRawCookie(name);
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}