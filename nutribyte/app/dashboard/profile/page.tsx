import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { createServerClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/supabase/queries"

export default async function ProfilePage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const userProfile = await getUserProfile(supabase, session.user.id)

  // Get user's fitness data
  const { data: fitnessData } = await supabase.from("fitness_data").select("*").eq("user_id", session.user.id).single()

  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" text="Manage your profile and fitness information." />
      <div className="grid gap-8">
        <ProfileForm userProfile={userProfile} fitnessData={fitnessData} />
      </div>
    </DashboardShell>
  )
}
