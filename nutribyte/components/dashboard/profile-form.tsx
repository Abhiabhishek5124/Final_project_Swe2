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

interface ProfileFormProps {
  userProfile: any
  fitnessData: any
}

export function ProfileForm({ userProfile, fitnessData }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: userProfile?.full_name || "",
    height: fitnessData?.height || "",
    weight: fitnessData?.weight || "",
    fitnessGoal: fitnessData?.fitness_goal || "",
    timeframe: fitnessData?.timeframe || "",
    availableTime: fitnessData?.available_time || "",
    dietaryPreferences: fitnessData?.dietary_preferences || "",
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
    setLoading(true)

    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          full_name: formData.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userProfile.id)

      if (profileError) throw profileError

      // Update fitness data
      const { error: fitnessError } = await supabase
        .from("fitness_data")
        .update({
          height: formData.height,
          weight: formData.weight,
          fitness_goal: formData.fitnessGoal,
          timeframe: formData.timeframe,
          available_time: formData.availableTime,
          dietary_preferences: formData.dietaryPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", fitnessData.id)

      if (fitnessError) throw fitnessError

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal information and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fitnessGoal">Fitness Goal</Label>
              <Select value={formData.fitnessGoal} onValueChange={(value) => handleSelectChange("fitnessGoal", value)}>
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
              <Select value={formData.timeframe} onValueChange={(value) => handleSelectChange("timeframe", value)}>
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
              <Select
                value={formData.availableTime}
                onValueChange={(value) => handleSelectChange("availableTime", value)}
              >
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
