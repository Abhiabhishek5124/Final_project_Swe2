import { redirect } from "next/navigation"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { createServerClient } from "@/lib/supabase/server"

export default async function OnboardingPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user has already completed onboarding
  const { data: fitnessData } = await supabase.from("fitness_data").select("*").eq("user_id", session.user.id).single()

  // If user has already completed onboarding, redirect to dashboard
  if (fitnessData) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Nutribyte</h1>
          <p className="text-sm text-muted-foreground">Let's get to know you better to create your personalized plan</p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  )
}
