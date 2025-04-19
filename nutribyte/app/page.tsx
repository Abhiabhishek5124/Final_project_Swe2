// import { createSupabaseServerClient } from '@/lib/supabase/server'
// import Link from 'next/link'

// export default async function HomePage() {
//   const supabase = await createSupabaseServerClient();
//   const { data, error } = await supabase.auth.getUser();
//   const isLoggedIn = !error && data?.user;
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold">Welcome to Nutribyte</h1>
//       {isLoggedIn ? (
//         <Link href="/dashboard">
//           <button className="mt-6 px-6 py-2 rounded bg-blue-600 text-white text-lg hover:bg-blue-700 transition">Go to Dashboard</button>
//         </Link>
//       ) : (
//         <p className="mt-4">Please <a href="/login" className="underline text-blue-600">log in</a> to continue.</p>
//       )}
//     </main>
//   );
// }


import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const isLoggedIn = !error && data?.user;
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
