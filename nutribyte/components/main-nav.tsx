"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()

    // If we're not on the home page, navigate to home page with the hash
    if (pathname !== "/") {
      router.push(`/${hash}`)
      return
    }

    // If we're already on the home page, just scroll to the element
    const element = document.getElementById(hash.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Dumbbell className="h-6 w-6 text-primary" />
        <span className="inline-block font-bold">Nutribyte</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        <a
          href="#features"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          onClick={(e) => handleHashLinkClick(e, "#features")}
        >
          Features
        </a>
        <a
          href="#testimonials"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          onClick={(e) => handleHashLinkClick(e, "#testimonials")}
        >
          Testimonials
        </a>
        <a
          href="#pricing"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          onClick={(e) => handleHashLinkClick(e, "#pricing")}
        >
          Pricing
        </a>
      </nav>
    </div>
  )
}
