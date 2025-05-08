import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
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
    console.log("Received POST request:", {
      userId: user.id,
      fitnessDataId: body.fitness_data_id,
      planContent: body.plan_content
    })

    const { plan_content, fitness_data_id, time_of_day, country_preference, additional_requirements } = body

    if (!plan_content || !fitness_data_id) {
      console.error("Missing required fields:", { plan_content, fitness_data_id })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // First, deactivate all existing plans for this user
    const { error: deactivateError } = await supabase
      .from('nutrition_plan')
      .update({ is_active: false })
      .eq('user_id', user.id)

    if (deactivateError) {
      console.error("Error deactivating existing plans:", deactivateError)
      return NextResponse.json({ error: "Failed to deactivate existing plans" }, { status: 500 })
    }

    // Then insert the new plan
    const { data: insertedPlan, error: insertError } = await supabase
      .from('nutrition_plan')
      .insert([{
        user_id: user.id,
        plan_content,
        fitness_data_id,
        time_of_day,
        country_preference,
        additional_requirements,
        is_active: true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting plan:", insertError)
      return NextResponse.json({ error: "Failed to save nutrition plan" }, { status: 500 })
    }

    console.log("Successfully inserted plan:", insertedPlan)
    return NextResponse.json(insertedPlan)
  } catch (error) {
    console.error("Unexpected error in nutrition plan creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
    console.log("Received PUT request:", {
      userId: user.id,
      planId: body.planId,
      planContent: body.updatedPlan
    })

    const { planId, updatedPlan, is_active } = body

    if (!planId) {
      console.error("Missing required field: planId")
      return NextResponse.json({ error: "Missing required field: planId" }, { status: 400 })
    }

    // If is_active is provided, this is a deactivation request
    if (typeof is_active === 'boolean') {
      const { error } = await supabase
        .from('nutrition_plan')
        .update({ is_active })
        .eq('id', planId)
        .eq('user_id', user.id)

      if (error) {
        console.error("Error deactivating plan:", error)
        return NextResponse.json({ error: "Failed to deactivate nutrition plan" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    // Otherwise, this is a plan update request
    if (updatedPlan) {
      const { error } = await supabase
        .from('nutrition_plan')
        .update({ plan_content: updatedPlan })
        .eq('id', planId)
        .eq('user_id', user.id)

      if (error) {
        console.error("Error updating plan:", error)
        return NextResponse.json({ error: "Failed to update nutrition plan" }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request: missing required fields" }, { status: 400 })
  } catch (error) {
    console.error("Unexpected error in nutrition plan update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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

    const url = new URL(request.url)
    const planId = url.searchParams.get('planId')

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from('nutrition_plan')
      .delete()
      .eq('id', planId)
      .eq('user_id', user.id)

    if (error) {
      console.error("Error deleting plan:", error)
      return NextResponse.json({ error: "Failed to delete nutrition plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error in nutrition plan deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 