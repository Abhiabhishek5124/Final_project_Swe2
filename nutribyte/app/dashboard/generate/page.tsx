import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GeneratePlanForm } from "@/components/dashboard/generate-plan-form"
import { createServerClient } from "@/lib/supabase/server"

export default async function GeneratePage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user's fitness data
  const { data: fitnessData } = await supabase.from("fitness_data").select("*").eq("user_id", session.user.id).single()

  // If user hasn't completed onboarding, redirect to onboarding
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
