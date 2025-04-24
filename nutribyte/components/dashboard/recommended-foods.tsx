"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface FoodRecommendation {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  benefits: string[]
  time: string
}

export function RecommendedFoods() {
  const [recommendedFoods, setRecommendedFoods] = useState<FoodRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecommendedFoods() {
      try {
        const response = await fetch('/api/recommended-foods')
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations')
        }
        const data = await response.json()
        setRecommendedFoods(data.recommendations)
      } catch (err) {
        setError("Failed to load recommended foods")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendedFoods()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Recommended Foods</CardTitle>
          <CardDescription>Loading your personalized recommendations...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Recommended Foods</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

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