import { createServerClient } from "@/lib/supabase/server"
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
    
    const supabase = createServerClient()
    
    // Check if user has completed onboarding
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
    
    // Return whether onboarding is completed
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