import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingForm } from "@/components/onboarding/onboarding-form"

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }
  // Check if user has already completed onboarding
  const { data: fitnessData } = await supabase.from("fitness_data").select("*").eq("user_id", data.user.id).single();
  if (fitnessData) {
    redirect("/dashboard");
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
  );
}
