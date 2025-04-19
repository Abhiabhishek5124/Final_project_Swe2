import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()
  
  const cookieStore = cookies()
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('sb-')) {
      cookieStore.delete(cookie.name)
    }
  })

  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
