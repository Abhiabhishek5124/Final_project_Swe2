import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createServerClient()

  // Sign out the user
  await supabase.auth.signOut()

  // Redirect to the home page
  return NextResponse.redirect(`${requestUrl.origin}/`)
}
