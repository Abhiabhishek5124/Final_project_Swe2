import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received update request:", {
      userId: user.id,
      planId: body.planId,
      planContent: body.updatedPlan
    })

    const { planId, updatedPlan } = body

    if (!planId || !updatedPlan) {
      console.error("Missing required fields:", { planId, updatedPlan })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate the plan structure
    if (!updatedPlan.weeklySchedule || !Array.isArray(updatedPlan.weeklySchedule)) {
      console.error("Invalid plan structure:", updatedPlan)
      return NextResponse.json({ error: "Invalid plan structure" }, { status: 400 })
    }

    // Update the workout plan
    const { data, error } = await supabase
      .from("workout_plans")
      .update({
        plan_content: updatedPlan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update workout plan" }, { status: 500 })
    }

    console.log("Successfully updated plan:", data)
    return NextResponse.json({ plan: data })
  } catch (error) {
    console.error("Unexpected error in workout plan update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 