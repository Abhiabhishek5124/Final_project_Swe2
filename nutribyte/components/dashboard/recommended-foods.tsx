"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recommendedFoods = [
  {
    name: "Grilled Salmon",
    calories: 367,
    protein: 40,
    carbs: 0,
    fat: 22,
    benefits: ["High in Omega-3", "Rich in Protein"],
    time: "Dinner"
  },
  {
    name: "Quinoa Bowl",
    calories: 222,
    protein: 8,
    carbs: 39,
    fat: 4,
    benefits: ["Complete Protein", "High in Fiber"],
    time: "Lunch"
  },
  {
    name: "Greek Yogurt with Berries",
    calories: 150,
    protein: 12,
    carbs: 20,
    fat: 2,
    benefits: ["Probiotics", "Antioxidants"],
    time: "Snack"
  }
]

export function RecommendedFoods() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Recommended Foods</CardTitle>
        <CardDescription>Based on your nutrition goals and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendedFoods.map((food, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{food.name}</h3>
              <Badge variant="outline">{food.time}</Badge>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Calories:</span>
                <span className="ml-1 font-medium">{food.calories} kcal</span>
              </div>
              <div>
                <span className="text-muted-foreground">Protein:</span>
                <span className="ml-1 font-medium">{food.protein}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Carbs:</span>
                <span className="ml-1 font-medium">{food.carbs}g</span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {food.benefits.map((benefit, benefitIndex) => (
                <Badge key={benefitIndex} variant="secondary">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 