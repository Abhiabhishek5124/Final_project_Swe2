import { createClient } from '@supabase/supabase-js'
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { id, firstName, lastName, email } = await request.json()
    const authHeader = request.headers.get("Authorization") || ""

    if (!id || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        }
      }
    )

    const { data: user, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error("Auth failed:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from('user_profiles')
      .insert({ 
        id, 
        first_name: firstName,
        last_name: lastName,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error creating user profile:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create user profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error creating user profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user profile' },
      { status: 500 }
    )
  }
}
