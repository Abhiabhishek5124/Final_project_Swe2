"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash
    if (hash) {
      // Remove the # character
      const id = hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        // Scroll to the element
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }, [searchParams])

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
  )
}
