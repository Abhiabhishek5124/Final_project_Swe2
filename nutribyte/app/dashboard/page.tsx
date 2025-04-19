import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUserProfile } from "@/lib/supabase/queries"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const sessionUser = data.user;
  const userProfile = await getUserProfile(supabase, sessionUser.id);

  const { data: fitnessData } = await supabase.from("fitness_data").select("*").eq("user_id", sessionUser.id).single()

  if (!fitnessData) {
    redirect("/onboarding")
  }

  const { data: nutritionPlan } = await supabase
    .from("nutrition_plans")
    .select("*")
    .eq("user_id", sessionUser.id)
    .eq("is_active", true)
    .single()

  const { data: workoutPlan } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", sessionUser.id)
    .eq("is_active", true)
    .single()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome back! Here's an overview of your nutrition and fitness plans."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fitnessData.weight} kg</div>
            <p className="text-xs text-muted-foreground">Goal: {fitnessData.fitness_goal}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeframe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fitnessData.timeframe}</div>
            <p className="text-xs text-muted-foreground">To achieve your fitness goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nutrition Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionPlan ? "Active" : "Not Generated"}</div>
            <p className="text-xs text-muted-foreground">
              {nutritionPlan
                ? `Last updated: ${new Date(nutritionPlan.updated_at).toLocaleDateString()}`
                : "Generate your plan now"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutPlan ? "Active" : "Not Generated"}</div>
            <p className="text-xs text-muted-foreground">
              {workoutPlan
                ? `Last updated: ${new Date(workoutPlan.updated_at).toLocaleDateString()}`
                : "Generate your plan now"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
