import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { RecommendedFoods } from "@/components/dashboard/recommended-foods"
import { FoodCaloriesDisplay } from "@/components/dashboard/food-calories-display"
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
        heading={`Welcome back, ${userProfile?.first_name || 'there'}! 👋`}
        text="Here's your personalized nutrition and fitness overview for today."
      />
      
      {/* Quick Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fitnessData.weight} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              Goal: {fitnessData.fitness_goal}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,000 kcal</div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: 2,200 kcal
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nutrition Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionPlan ? "Active" : "Not Generated"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {nutritionPlan
                ? `Updated: ${new Date(nutritionPlan.updated_at).toLocaleDateString()}`
                : "Generate your plan now"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutPlan ? "Active" : "Not Generated"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {workoutPlan
                ? `Updated: ${new Date(workoutPlan.updated_at).toLocaleDateString()}`
                : "Generate your plan now"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Calories Graph</CardTitle>
              <CardDescription>Your calorie intake over the past week</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <RecommendedFoods />
        </div>

        <div className="col-span-3 space-y-4">
          <Card className="border-l-4 border-l-secondary">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest nutrition and fitness updates</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
          <FoodCaloriesDisplay />
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-4">
        <Card className="bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your journey towards your fitness goals</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center p-4 text-center">
              <div className="text-3xl font-bold text-primary">-2.5 kg</div>
              <p className="text-sm text-muted-foreground">Weight Lost</p>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <div className="text-3xl font-bold text-primary">85%</div>
              <p className="text-sm text-muted-foreground">Goal Progress</p>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <div className="text-3xl font-bold text-primary">28 days</div>
              <p className="text-sm text-muted-foreground">Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
