"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import { ProgressLoader } from "@/components/loaders/progress-loader"
import { Spinner } from "@/components/loaders/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLoadingState } from "@/hooks/useLoadingState"

export function OnboardingForm() {
  const { loading, stage, error, withLoading } = useLoadingState()
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    fitnessGoal: "",
    timeframe: "",
    availableTime: "",
    dietaryPreferences: "",
  })
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    withLoading(
      async () => {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error("User not authenticated")
        }

        // Insert fitness data
        const { error } = await supabase.from("fitness_data").insert({
          user_id: user.id,
          height: formData.height,
          weight: formData.weight,
          fitness_goal: formData.fitnessGoal,
          timeframe: formData.timeframe,
          available_time: formData.availableTime,
          dietary_preferences: formData.dietaryPreferences,
        })

        if (error) throw error

        toast({
          title: "Onboarding complete",
          description: "Your information has been saved successfully.",
        })

        // Redirect to dashboard
        router.push("/dashboard")
        router.refresh()
      },
      {
        stages: {
          start: "Processing",
          user: "Getting user data",
          save: "Saving profile information",
          success: "Setup complete",
          redirect: "Redirecting to dashboard",
          error: "Failed to save information"
        },
        onError: (error) => {
          console.error("Error saving onboarding data:", error)
          toast({
            title: "Error",
            description: "Failed to save your information. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Tell us about yourself</CardTitle>
          <CardDescription>We'll use this information to create your personalized plans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading && (
            <ProgressLoader 
              loading={loading} 
              text={stage || "Saving information"} 
              className="mb-4" 
            />
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="175"
                required
                value={formData.height}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="70"
                required
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fitnessGoal">Fitness Goal</Label>
            <Select required onValueChange={(value) => handleSelectChange("fitnessGoal", value)}>
              <SelectTrigger id="fitnessGoal">
                <SelectValue placeholder="Select a fitness goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose_weight">Lose Weight</SelectItem>
                <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                <SelectItem value="maintain">Maintain</SelectItem>
                <SelectItem value="improve_fitness">Improve Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select required onValueChange={(value) => handleSelectChange("timeframe", value)}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select a timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="3_months">3 Months</SelectItem>
                <SelectItem value="6_months">6 Months</SelectItem>
                <SelectItem value="12_months">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableTime">Available Time for Exercise</Label>
            <Select required onValueChange={(value) => handleSelectChange("availableTime", value)}>
              <SelectTrigger id="availableTime">
                <SelectValue placeholder="Select available time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15_min_daily">15 minutes daily</SelectItem>
                <SelectItem value="30_min_daily">30 minutes daily</SelectItem>
                <SelectItem value="1_hour_3x_week">1 hour, 3x per week</SelectItem>
                <SelectItem value="1_hour_5x_week">1 hour, 5x per week</SelectItem>
                <SelectItem value="2_hours_3x_week">2 hours, 3x per week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dietaryPreferences">Dietary Preferences (Optional)</Label>
            <Textarea
              id="dietaryPreferences"
              name="dietaryPreferences"
              placeholder="E.g., vegetarian, vegan, gluten-free, etc."
              value={formData.dietaryPreferences}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                Saving...
              </span>
            ) : (
              "Continue"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
