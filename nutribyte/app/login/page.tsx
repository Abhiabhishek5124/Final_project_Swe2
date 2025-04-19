// app/login/page.tsx
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function LoginPage({ searchParams }: { searchParams: { redirectedFrom?: string } }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (!error && data?.user) {
    redirect('/dashboard');
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Login</h1>
      <LoginForm redirectTo={params.redirectedFrom} />
    </main>
  );
}
