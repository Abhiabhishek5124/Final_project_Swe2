import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { createServerClient } from "@/lib/supabase/server"

export default async function LoginPage() {
  const supabase = createServerClient()

  // Check if user is already authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is already authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
