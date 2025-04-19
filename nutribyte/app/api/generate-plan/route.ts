import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { generateAIPlan } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { fitnessDataId, regenerate = false } = body

    const { data: fitnessData, error: fitnessError } = await supabase
      .from("fitness_data")
      .select("*")
      .eq("id", fitnessDataId)
      .eq("user_id", session.user.id)
      .single()

    if (fitnessError || !fitnessData) {
      return NextResponse.json({ error: "Fitness data not found" }, { status: 404 })
    }

    if (!regenerate) {
      const { data: existingNutritionPlan } = await supabase
        .from("nutrition_plans")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("fitness_data_id", fitnessDataId)
        .eq("is_active", true)
        .single()

      const { data: existingWorkoutPlan } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("fitness_data_id", fitnessDataId)
        .eq("is_active", true)
        .single()

      if (existingNutritionPlan && existingWorkoutPlan) {
        return NextResponse.json({
          nutritionPlan: existingNutritionPlan,
          workoutPlan: existingWorkoutPlan,
        })
      }
    }

    const { nutritionPlan, workoutPlan } = await generateAIPlan(fitnessData)

    if (regenerate) {
      await supabase
        .from("nutrition_plans")
        .update({ is_active: false })
        .eq("user_id", session.user.id)
        .eq("is_active", true)

      await supabase
        .from("workout_plans")
        .update({ is_active: false })
        .eq("user_id", session.user.id)
        .eq("is_active", true)
    }

    const { data: newNutritionPlan, error: nutritionError } = await supabase
      .from("nutrition_plans")
      .insert({
        user_id: session.user.id,
        fitness_data_id: fitnessDataId,
        plan_content: nutritionPlan,
        is_active: true,
      })
      .select()
      .single()

    if (nutritionError) {
      return NextResponse.json({ error: "Failed to save nutrition plan" }, { status: 500 })
    }

    const { data: newWorkoutPlan, error: workoutError } = await supabase
      .from("workout_plans")
      .insert({
        user_id: session.user.id,
        fitness_data_id: fitnessDataId,
        plan_content: workoutPlan,
        is_active: true,
      })
      .select()
      .single()

    if (workoutError) {
      return NextResponse.json({ error: "Failed to save workout plan" }, { status: 500 })
    }

    return NextResponse.json({
      nutritionPlan: newNutritionPlan,
      workoutPlan: newWorkoutPlan,
    })
  } catch (error) {
    console.error("Error generating plan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
