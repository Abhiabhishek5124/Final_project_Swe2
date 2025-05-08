"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const COUNTRIES = [
  "American",
  "Italian",
  "Mediterranean",
  "Indian",
  "Mexican",
  "Japanese",
  "Chinese",
  "Thai",
  "French",
  "Middle Eastern",
  "custom"
]

const MEAL_TIMES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" }
]

interface GenerateNutritionFormProps {
  userProfile: {
    id: string
  }
  fitnessData: {
    id: string
    fitness_goal: string
    dietary_restrictions: string | null
    dietary_preferences: string | null
  }
}

export function GenerateNutritionForm({ userProfile, fitnessData }: GenerateNutritionFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [selectedMealTime, setSelectedMealTime] = useState("")
  const [country, setCountry] = useState("")
  const [customCountry, setCustomCountry] = useState("")
  const [additionalRequirements, setAdditionalRequirements] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate inputs
      if (!selectedMealTime) {
        setLoading(false)
        toast({
          title: "Error",
          description: "Please select a meal time",
          variant: "destructive",
        })
        return
      }

      if (!country) {
        setLoading(false)
        toast({
          title: "Error",
          description: "Please select a country preference",
          variant: "destructive",
        })
        return
      }

      if (country === "custom" && !customCountry) {
        setLoading(false)
        toast({
          title: "Error",
          description: "Please enter a custom country",
          variant: "destructive",
        })
        return
      }

      console.log("Generating nutrition plan with data:", {
        fitness_goal: fitnessData.fitness_goal,
        dietary_restrictions: fitnessData.dietary_restrictions ? [fitnessData.dietary_restrictions] : [],
        dietary_preference: fitnessData.dietary_preferences || "balanced",
        time_of_day: [selectedMealTime],
        country_preference: country === "custom" ? customCountry : country,
        additional_requirements: additionalRequirements,
      })

      // Generate nutrition plan
      const response = await fetch("/api/groq/generate-nutrition-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fitness_goal: fitnessData.fitness_goal,
          dietary_restrictions: fitnessData.dietary_restrictions ? [fitnessData.dietary_restrictions] : [],
          dietary_preference: fitnessData.dietary_preferences || "balanced",
          time_of_day: [selectedMealTime],
          country_preference: country === "custom" ? customCountry : country,
          additional_requirements: additionalRequirements,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("API Error Response:", responseData)
        throw new Error(responseData.error || "Failed to generate nutrition plan")
      }

      console.log("Generated Plan:", responseData)

      // Save to Supabase through API route
      const saveResponse = await fetch("/api/nutrition-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_content: {
            plan_summary: responseData.plan_summary,
            meals: responseData.meals
          },
          fitness_data_id: fitnessData.id,
          time_of_day: [selectedMealTime],
          country_preference: country === "custom" ? customCountry : country,
          additional_requirements: additionalRequirements || null,
          is_active: true
        }),
        credentials: 'include'
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        console.error("Error saving plan:", errorData)
        throw new Error(errorData.error || "Failed to save nutrition plan")
      }

      const saveData = await saveResponse.json()
      console.log("Successfully saved plan:", saveData)

      toast({
        title: "Success",
        description: "Nutrition plan generated successfully",
      })

      router.push("/dashboard/nutrition")
    } catch (error) {
      console.error("Error in form submission:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate nutrition plan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Your Nutrition Plan</CardTitle>
        <CardDescription>
          Customize your nutrition plan based on your preferences and requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-semibold">Your Fitness Information</h3>
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <p className="text-sm font-medium min-w-[120px]">Goal:</p>
                <span className="text-sm capitalize">{fitnessData.fitness_goal.replace(/_/g, " ")}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <p className="text-sm font-medium min-w-[120px]">Dietary Restrictions:</p>
                <span className="text-sm capitalize">
                  {fitnessData.dietary_restrictions || "None"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <p className="text-sm font-medium min-w-[120px]">Dietary Preferences:</p>
                <span className="text-sm capitalize">{fitnessData.dietary_preferences || "Balanced"}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Meal Time</Label>
                <Select value={selectedMealTime} onValueChange={setSelectedMealTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meal time" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TIMES.map((meal) => (
                      <SelectItem key={meal.id} value={meal.id}>
                        {meal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Country Preference</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country === "custom" ? "Custom..." : country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {country === "custom" && (
                  <div className="mt-2">
                    <Input
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="Enter your custom country preference"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label>Additional Requirements (Optional)</Label>
                <Textarea
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="Any specific requirements or preferences..."
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Plan"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
} 