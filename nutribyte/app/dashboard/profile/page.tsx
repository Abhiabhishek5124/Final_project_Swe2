import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/supabase/queries"

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const userProfile = await getUserProfile(supabase, session.user.id)

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
