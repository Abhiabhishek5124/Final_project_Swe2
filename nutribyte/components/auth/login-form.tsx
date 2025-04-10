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

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
        // Sign in with email and password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          throw signInError
        }

        // Get the current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          throw new Error("User not authenticated")
        }

        // Check if the user has completed onboarding
        const { data: fitnessData, error: fitnessError } = await supabase
          .from("fitness_data")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (fitnessError && fitnessError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error, which is expected if user hasn't completed onboarding
          console.error("Error checking fitness data:", fitnessError)
        }

        toast({
          title: "Success",
          description: "You have been logged in successfully.",
        })

        // If first-time login (no fitness data), redirect to onboarding
        // Otherwise, redirect to dashboard
        if (!fitnessData) {
          router.push("/onboarding")
        } else {
          router.push("/dashboard")
        }
        
        router.refresh()
      },
      {
        stages: {
          start: "Authenticating",
          auth: "Verifying credentials",
          user: "Getting user data",
          profile: "Checking profile",
          success: "Login successful",
          redirect: "Redirecting",
          error: "Login failed"
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          })
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading && (
        <ProgressLoader 
          loading={loading} 
          text={stage || "Logging in"} 
          className="mb-4" 
        />
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center">
            <Spinner size="sm" className="mr-2" />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  )
}
