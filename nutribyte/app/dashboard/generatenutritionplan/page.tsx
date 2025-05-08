import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GenerateNutritionForm } from "@/components/dashboard/generate-nutrition-form"
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function GenerateNutritionPage() {
  try {
    const supabase = await createSupabaseServerClient()

    // Check if user is authenticated using getUser()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('Authentication error or no user found')
      redirect("/login")
    }

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      redirect("/dashboard/profile")
    }

    if (!userProfile) {
      console.log('No user profile found')
      redirect("/dashboard/profile")
    }

    // Fetch fitness data
    const { data: fitnessData, error: fitnessError } = await supabase
      .from("fitness_data")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (fitnessError) {
      console.error('Error fetching fitness data:', fitnessError)
      redirect("/dashboard/profile")
    }

    if (!fitnessData) {
      console.log('No fitness data found')
      redirect("/dashboard/profile")
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Generate Nutrition Plan"
          text="Create a personalized nutrition plan based on your fitness goals and preferences"
        />
        <div className="grid gap-4">
          <GenerateNutritionForm
            userProfile={userProfile}
            fitnessData={fitnessData}
          />
        </div>
      </DashboardShell>
    )
  } catch (error) {
    console.error('Unexpected error in generate nutrition page:', error)
    redirect("/dashboard/profile")
  }
} 