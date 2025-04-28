"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Edit, Save, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Meal {
  food_name: string
  type: string
  ingredients: string[]
  instructions: string
  calories: number
  protein: number
  carbs: number
  sugar: number
  other_nutrients: {
    fiber: number
    fat: number
    sodium: number
  }
}

interface NutritionPlan {
  plan_summary: {
    daily_calories: number
    daily_protein: number
    daily_carbs: number
    daily_fat: number
    notes: string
  }
  meals: Meal[]
}

interface NutritionPlanDisplayProps {
  plan: NutritionPlan & { fitness_data_id: string }
  planId: string
}

export function NutritionPlanDisplay({ plan, planId }: NutritionPlanDisplayProps) {
  const [editing, setEditing] = useState(false)
  const [editedPlan, setEditedPlan] = useState(plan)
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const toggleMeal = (mealName: string) => {
    setExpandedMeal(expandedMeal === mealName ? null : mealName)
  }

  const handleSave = async () => {
    try {
      console.log("Saving plan with data:", {
        planId,
        updatedPlan: editedPlan
      })

      const response = await fetch("/api/nutrition-plan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          updatedPlan: editedPlan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Error response from server:", data)
        throw new Error(data.error || "Failed to update plan")
      }

      toast({
        title: "Success",
        description: "Meal plan updated successfully",
      })
      setEditing(false)
      router.refresh() // Refresh the page to show updated data
    } catch (error) {
      console.error("Error saving plan:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update meal plan",
        variant: "destructive",
      })
    }
  }

  const handleRegenerate = async () => {
    try {
      console.log('Attempting to deactivate plan:', { planId })
      
      // Deactivate the current plan
      const response = await fetch("/api/nutrition-plan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          is_active: false,
        }),
      });

      const data = await response.json();
      console.log('Deactivate response:', data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to deactivate current plan");
      }

      // Redirect to generate page
      router.push("/dashboard/generatenutritionplan");
    } catch (error) {
      console.error("Error in regeneration process:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMealChange = (
    mealIndex: number,
    field: keyof Meal,
    value: string | number
  ) => {
    const newPlan = { ...editedPlan }
    newPlan.meals[mealIndex][field] = value as never
    setEditedPlan(newPlan)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        {editing ? (
          <>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Meal
            </Button>
            <Button onClick={handleRegenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Meal
            </Button>
          </>
        )}
      </div>

      <div className="grid gap-6">
        {editedPlan.meals.map((meal, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl font-bold">
                {editing ? (
                  <Input
                    value={meal.food_name}
                    onChange={(e) => handleMealChange(index, "food_name", e.target.value)}
                    className="text-2xl font-bold"
                  />
                ) : (
                  meal.food_name
                )}
              </CardTitle>
              <CardDescription className="text-lg">
                {meal.type} • {meal.calories} calories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Nutrition Facts</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Protein: {meal.protein}g</div>
                    <div>Carbs: {meal.carbs}g</div>
                    <div>Fat: {meal.other_nutrients.fat}g</div>
                    <div>Fiber: {meal.other_nutrients.fiber}g</div>
                    <div>Sugar: {meal.sugar}g</div>
                    <div>Sodium: {meal.other_nutrients.sodium}mg</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Ingredients</h3>
                  {editing ? (
                    <Textarea
                      value={meal.ingredients.join("\n")}
                      onChange={(e) => handleMealChange(index, "ingredients", e.target.value.split("\n"))}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <ul className="list-disc list-inside text-sm">
                      {meal.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Instructions</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMeal(meal.food_name)}
                  >
                    {expandedMeal === meal.food_name ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Hide Instructions
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Show Instructions
                      </>
                    )}
                  </Button>
                </div>
                {expandedMeal === meal.food_name && (
                  <div className="mt-2 p-4 bg-muted rounded-md">
                    {editing ? (
                      <Textarea
                        value={meal.instructions}
                        onChange={(e) => handleMealChange(index, "instructions", e.target.value)}
                        className="min-h-[150px]"
                      />
                    ) : (
                      <p className="whitespace-pre-line text-sm">{meal.instructions}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
