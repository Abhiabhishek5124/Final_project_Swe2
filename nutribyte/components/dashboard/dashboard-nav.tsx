"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Activity, Home, LogOut, Settings, Utensils } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      <Link href="/dashboard">
        <Button variant={pathname === "/dashboard" ? "default" : "ghost"} className="w-full justify-start">
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/dashboard/nutrition">
        <Button variant={pathname === "/dashboard/nutrition" ? "default" : "ghost"} className="w-full justify-start">
          <Utensils className="mr-2 h-4 w-4" />
          Nutrition Plan
        </Button>
      </Link>
      <Link href="/dashboard/workouts">
        <Button variant={pathname === "/dashboard/workouts" ? "default" : "ghost"} className="w-full justify-start">
          <Activity className="mr-2 h-4 w-4" />
          Workout Plan
        </Button>
      </Link>
      <Link href="/dashboard/profile">
        <Button variant={pathname === "/dashboard/profile" ? "default" : "ghost"} className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </Link>
      <Link href="/api/auth/signout">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </Link>
    </nav>
  )
}
