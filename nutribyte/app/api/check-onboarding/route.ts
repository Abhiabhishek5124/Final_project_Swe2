import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }
    
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("fitness_data")
      .select("*")
      .eq("user_id", userId)
      .single()
    
    if (error && error.code !== "PGRST116") {
      console.error("Error checking onboarding status:", error)
      return NextResponse.json(
        { error: error.message || "Failed to check onboarding status" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      onboardingCompleted: !!data,
      fitnessData: data || null
    })
  } catch (error: any) {
    console.error("Error checking onboarding status:", error)
    return NextResponse.json(
      { error: error.message || "Failed to check onboarding status" },
      { status: 500 }
    )
  }
} 