"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProgressLoader } from "@/components/loaders/progress-loader"
import { Spinner } from "@/components/loaders/spinner"
import { useLoadingState } from "@/hooks/useLoadingState"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const { loading, stage, error, withLoading } = useLoadingState()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    withLoading(
      async () => {
        // Sign up with email and password
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          // Create user profile via server API
          const response = await fetch("/api/create-user-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.session.access_token}`
            },
            body: JSON.stringify({
              id: data.user.id,
              firstName,
              lastName,
              email,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create user profile")
          }

          toast({
            title: "Account created",
            description: "Your account has been created successfully. Please login to continue.",
          })
  
          console.log("✅ Profile created, redirecting to login...")
  
          // ✅ Step 6: Redirect to login
          router.push("/login")
        }
      },
      {
        stages: {
          start: "Creating account",
          auth: "Registering user",
          profile: "Creating profile",
          success: "Account created",
          redirect: "Redirecting to login",
          error: "Registration failed"
        },
        onError: (error) => {
          console.error("Signup error:", error)
          toast({
            title: "Signup failed",
            description: error.message || "An error occurred during signup.",
            variant: "destructive",
          })
        }
      }
    )
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading && (
            <ProgressLoader 
              loading={loading} 
              text={stage || "Creating account"} 
              className="mb-4" 
            />
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </Button>
        </div>
      </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
      <div className="text-center">
        <Link href="/">
          <Button variant="outline" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
