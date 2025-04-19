import { redirect } from "next/navigation"
import { SignUpForm } from "@/components/auth/signup-form"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

export default async function SignUpPage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
