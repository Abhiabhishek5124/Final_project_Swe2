import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GeneratePlanForm } from "@/components/dashboard/generate-plan-form"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function GeneratePage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: fitnessData } = await supabase.from("fitness_data").select("*").eq("user_id", session.user.id).single()

  if (!fitnessData) {
    redirect("/onboarding")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Generate Plans"
        text="Generate personalized nutrition and workout plans based on your goals."
      />
      <div className="grid gap-8">
        <GeneratePlanForm fitnessData={fitnessData} />
      </div>
    </DashboardShell>
  )
}
