import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutPlanDisplay } from "@/components/dashboard/workout-plan-display"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function WorkoutsPage() {
  const supabase = await createSupabaseServerClient()

  // Check if user is authenticated using getUser()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Get active workout plan
  const { data: workoutPlan, error: workoutError } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (workoutError) {
    console.error("Error fetching workout plan:", workoutError)
    redirect("/dashboard/generate")
  }

  // If no plan exists, redirect to generate plan
  if (!workoutPlan) {
    redirect("/dashboard/generate")
  }

  // Validate plan content
  if (!workoutPlan.plan_content || !workoutPlan.plan_content.weeklySchedule) {
    console.error("Invalid workout plan content:", workoutPlan.plan_content)
    redirect("/dashboard/generate")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Workout Plan"
        text="Your personalized workout routines and exercise recommendations"
      />
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Workout</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Database</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-4">
          <WorkoutPlanDisplay 
            plan={{ ...workoutPlan.plan_content, fitness_data_id: workoutPlan.fitness_data_id }} 
            view="daily" 
            planId={workoutPlan.id} 
          />
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <WorkoutPlanDisplay 
            plan={{ ...workoutPlan.plan_content, fitness_data_id: workoutPlan.fitness_data_id }} 
            view="weekly" 
            planId={workoutPlan.id} 
          />
        </TabsContent>
        <TabsContent value="exercises" className="space-y-4">
          <WorkoutPlanDisplay 
            plan={{ ...workoutPlan.plan_content, fitness_data_id: workoutPlan.fitness_data_id }} 
            view="exercises" 
            planId={workoutPlan.id} 
          />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
