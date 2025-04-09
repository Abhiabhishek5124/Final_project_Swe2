import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Create a Supabase client with the anon key
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

    // Test the connection by getting the server timestamp
    const { data, error } = await supabase.from("user_profiles").select("count(*)").limit(1)

    if (error) {
      throw error
    }

    // Return success response with connection info
    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      url: process.env.SUPABASE_URL,
      data,
    })
  } catch (error: any) {
    console.error("Supabase connection error:", error)

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Supabase connection failed",
        error: error.message,
        url: process.env.SUPABASE_URL,
      },
      { status: 500 },
    )
  }
}
