import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NutritionPlanDisplay } from "@/components/dashboard/nutrition-plan-display"
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function NutritionPage() {
  const supabase = await createSupabaseServerClient()

  // Check if user is authenticated using getUser()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.log('Authentication error or no user found')
    redirect("/login")
  }

  // Get active nutrition plan
  const { data: nutritionPlan, error: planError } = await supabase
    .from("nutrition_plan")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  // If there's an error fetching the plan or no plan exists, redirect to generate
  if (planError || !nutritionPlan) {
    console.log('No active plan found or error fetching plan, redirecting to generate')
    redirect("/dashboard/generatenutritionplan")
  }

  // Validate plan content
  if (!nutritionPlan.plan_content) {
    console.log('Invalid plan content, redirecting to generate')
    redirect("/dashboard/generatenutritionplan")
  }

  // If we have a valid plan, display it
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
