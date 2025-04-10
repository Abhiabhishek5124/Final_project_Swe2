import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// This middleware will run on all routes
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check auth status
  const { data: { session } } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/']

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/onboarding']
  
  // Check if the current route is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  )
  
  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If logged in user tries to access login/signup pages, redirect to dashboard
  if (session && publicRoutes.includes(path) && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and _next system paths
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
} 