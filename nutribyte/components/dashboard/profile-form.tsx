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
import { CheckCircle2 } from "lucide-react"

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

interface ProfileFormProps {
  userProfile: {
    id: string
    first_name: string
    last_name: string
  }
  fitnessData: {
    id: string
    age: number
    gender: string
    height_inches: number
    weight: number
    fitness_goal: string
    available_time: string
    dietary_restrictions: string | null
    dietary_preferences: string | null
  }
}

export function ProfileForm({ userProfile, fitnessData }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: userProfile?.first_name || "",
    lastName: userProfile?.last_name || "",
    age: fitnessData?.age?.toString() || "",
    gender: fitnessData?.gender || "",
    heightInches: fitnessData?.height_inches?.toString() || "",
    weight: fitnessData?.weight?.toString() || "",
    fitnessGoal: fitnessData?.fitness_goal || "",
    availableTime: fitnessData?.available_time || "",
    dietaryRestrictions: fitnessData?.dietary_restrictions || "",
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
          first_name: formData.firstName,
          last_name: formData.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userProfile.id)

      if (profileError) throw profileError

      // Update fitness data
      const { error: fitnessError } = await supabase
        .from("fitness_data")
        .update({
          age: parseInt(formData.age),
          gender: formData.gender,
          height_inches: parseFloat(formData.heightInches),
          weight: parseFloat(formData.weight),
          fitness_goal: formData.fitnessGoal,
          available_time: formData.availableTime,
          dietary_restrictions: formData.dietaryRestrictions || null,
          dietary_preferences: formData.dietaryPreferences || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", fitnessData.id)

      if (fitnessError) throw fitnessError

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Profile Updated Successfully</span>
          </div>
        ),
        description: "Your profile information has been saved and updated.",
        duration: 5000,
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
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
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
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
                  value={formData.heightInches}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fitnessGoal">Fitness Goal</Label>
              <Select
                value={formData.fitnessGoal}
                onValueChange={(value) => handleSelectChange("fitnessGoal", value)}
              >
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
                  <SelectItem value="2_hours_5x_week">2 hours, 5x per week</SelectItem>
                  <SelectItem value="3_hours_3x_week">3 hours, 3x per week</SelectItem>
                  <SelectItem value="3_hours_5x_week">3 hours, 5x per week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
              <Select
                value={formData.dietaryRestrictions}
                onValueChange={(value) => handleSelectChange("dietaryRestrictions", value)}
              >
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
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
