import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { planId, planType, updatedContent } = body

    if (!planId || !planType || !updatedContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update the plan based on planType
    const table = planType === "nutrition" ? "nutrition_plans" : "workout_plans"

    const { data, error } = await supabase
      .from(table)
      .update({
        plan_content: updatedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
    }

    return NextResponse.json({ plan: data })
  } catch (error) {
    console.error("Error updating plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
