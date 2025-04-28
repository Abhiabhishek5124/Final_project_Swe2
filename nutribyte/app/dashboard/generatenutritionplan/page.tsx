import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GenerateNutritionForm } from "@/components/dashboard/generate-nutrition-form"
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function GenerateNutritionPage() {
  const supabase = await createSupabaseServerClient()

  // Check if user is authenticated using getUser()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const { data: fitnessData } = await supabase
    .from("fitness_data")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!fitnessData) {
    redirect("/onboarding")
  }

  const { data: existingPlan } = await supabase
    .from("nutrition_plan")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  // If there's an active plan, redirect to the nutrition page
  if (existingPlan) {
    redirect("/dashboard/nutrition")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Generate Nutrition Plan"
        text="Create a personalized nutrition plan based on your fitness goals and preferences"
      />
      <div className="grid gap-4">
        <GenerateNutritionForm
          userProfile={{ id: user.id }}
          fitnessData={fitnessData}
        />
      </div>
    </DashboardShell>
  )
} 