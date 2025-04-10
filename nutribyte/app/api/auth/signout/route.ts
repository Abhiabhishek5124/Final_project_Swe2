import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createServerClient()

  // Sign out the user
  await supabase.auth.signOut()
  
  // Clear all auth cookies
  const cookieStore = cookies()
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('sb-')) {
      cookieStore.delete(cookie.name)
    }
  })

  // Redirect to the login page
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
