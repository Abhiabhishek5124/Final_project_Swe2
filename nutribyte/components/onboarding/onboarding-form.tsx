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

interface FormData {
  firstName: string
  lastName: string
  age: string
  gender: string
  heightInches: string
  weight: string
  fitnessGoal: string
  availableTime: string
  dietaryRestrictions: string
  dietaryPreferences: string
}

export function OnboardingForm() {
  const { loading, stage, error, withLoading } = useLoadingState()
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    heightInches: "",
    weight: "",
    fitnessGoal: "",
    availableTime: "",
    dietaryRestrictions: "",
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
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          throw new Error("User not authenticated")
        }

        // Update user profile with first and last name
        const { error: profileError } = await supabase
          .from("user_profiles")
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (profileError) throw profileError

        // Insert fitness data
        const { error } = await supabase.from("fitness_data").insert({
          user_id: user.id,
          age: parseInt(formData.age),
          gender: formData.gender,
          height_inches: parseFloat(formData.heightInches),
          weight: parseFloat(formData.weight),
          fitness_goal: formData.fitnessGoal,
          available_time: formData.availableTime,
          dietary_restrictions: formData.dietaryRestrictions || null,
          dietary_preferences: formData.dietaryPreferences || null,
        })
        if (error) throw error
        toast({
          title: "Onboarding complete",
          description: "Your information has been saved successfully.",
        })
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
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="25"
                required
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select required onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heightInches">Height (inches)</Label>
              <Input
                id="heightInches"
                name="heightInches"
                type="number"
                placeholder="70"
                required
                value={formData.heightInches}
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
                <SelectItem value="other">Other</SelectItem>
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
                <SelectItem value="2_hours_5x_week">2 hours, 5x per week</SelectItem>
                <SelectItem value="3_hours_3x_week">3 hours, 3x per week</SelectItem>
                <SelectItem value="3_hours_5x_week">3 hours, 5x per week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
            <Select onValueChange={(value) => handleSelectChange("dietaryRestrictions", value)}>
              <SelectTrigger id="dietaryRestrictions">
                <SelectValue placeholder="Select dietary restrictions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="gluten_free">Gluten-Free</SelectItem>
                <SelectItem value="dairy_free">Dairy-Free</SelectItem>
                <SelectItem value="nut_free">Nut-Free</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dietaryPreferences">Dietary Preferences (Optional)</Label>
            <Textarea
              id="dietaryPreferences"
              name="dietaryPreferences"
              placeholder="E.g., prefer low-carb meals, avoid spicy food, etc."
              value={formData.dietaryPreferences}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? "Saving..." : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
