'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MainNav } from '@/components/main-nav'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/ssr'

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const supabase = createClientComponentClient()
    supabase.auth.getUser().then(({ data, error }) => {
      setIsLoggedIn(!error && !!data?.user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}