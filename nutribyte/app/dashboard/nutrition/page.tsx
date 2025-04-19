import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NutritionPlanDisplay } from "@/components/dashboard/nutrition-plan-display"
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function NutritionPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: nutritionPlan } = await supabase
    .from("nutrition_plans")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("is_active", true)
    .single()

  if (!nutritionPlan) {
    redirect("/dashboard/generate")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Nutrition Plan"
        text="Your personalized nutrition plan based on your goals and preferences."
      >
        <Button variant="outline">Edit Plan</Button>
        <Button>Regenerate Plan</Button>
      </DashboardHeader>
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Plan</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          <TabsTrigger value="meals">Meal Database</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-4">
          <NutritionPlanDisplay plan={nutritionPlan.plan_content} view="daily" />
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <NutritionPlanDisplay plan={nutritionPlan.plan_content} view="weekly" />
        </TabsContent>
        <TabsContent value="meals" className="space-y-4">
          <NutritionPlanDisplay plan={nutritionPlan.plan_content} view="meals" />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
