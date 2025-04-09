import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutPlanDisplay } from "@/components/dashboard/workout-plan-display"
import { createServerClient } from "@/lib/supabase/server"

export default async function WorkoutsPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get active workout plan
  const { data: workoutPlan } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("is_active", true)
    .single()

  // If no plan exists, redirect to generate plan
  if (!workoutPlan) {
    redirect("/dashboard/generate")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Workout Plan"
        text="Your personalized workout plan based on your goals and available time."
      >
        <Button variant="outline">Edit Plan</Button>
        <Button>Regenerate Plan</Button>
      </DashboardHeader>
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Workout</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Database</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-4">
          <WorkoutPlanDisplay plan={workoutPlan.plan_content} view="daily" />
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <WorkoutPlanDisplay plan={workoutPlan.plan_content} view="weekly" />
        </TabsContent>
        <TabsContent value="exercises" className="space-y-4">
          <WorkoutPlanDisplay plan={workoutPlan.plan_content} view="exercises" />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
