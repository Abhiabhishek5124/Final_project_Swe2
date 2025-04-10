import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { id, fullName, email } = await request.json()
    
    if (!id || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    const supabase = createServerClient()
    
    // Create a profile in the profiles table
    const { error } = await supabase
      .from('profiles')
      .insert({ 
        id, 
        full_name: fullName, 
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