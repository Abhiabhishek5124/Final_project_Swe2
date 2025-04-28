import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NutritionPlanDisplay } from "@/components/dashboard/nutrition-plan-display"
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function NutritionPage() {
  const supabase = await createSupabaseServerClient()

  // Check if user is authenticated using getUser()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Get active nutrition plan
  const { data: nutritionPlan, error: nutritionError } = await supabase
    .from("nutrition_plan")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (nutritionError) {
    console.error("Error fetching nutrition plan:", nutritionError)
    redirect("/dashboard/generatenutritionplan")
  }

  // If no plan exists, redirect to generate plan
  if (!nutritionPlan) {
    redirect("/dashboard/generatenutritionplan")
  }

  // Validate plan content
  if (!nutritionPlan.plan_content || !nutritionPlan.plan_content.meals) {
    console.error("Invalid nutrition plan content:", nutritionPlan.plan_content)
    redirect("/dashboard/generatenutritionplan")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Your Meal Plan"
        text="Your personalized meal recommendation"
      />
      <div className="space-y-4">
        <NutritionPlanDisplay 
          plan={nutritionPlan.plan_content} 
          planId={nutritionPlan.id}
        />
      </div>
    </DashboardShell>
  )
}
