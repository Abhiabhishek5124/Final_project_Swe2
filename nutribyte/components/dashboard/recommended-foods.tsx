"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, Clock, Flame, Droplet, Leaf } from "lucide-react"

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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchRecommendedFoods = async () => {
    try {
      const response = await fetch('/api/recommended-foods')
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      const data = await response.json()
      setRecommendedFoods(data.recommendations)
      localStorage.setItem('recommendedFoods', JSON.stringify({
        data: data.recommendations,
        timestamp: new Date().toISOString()
      }))
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      setError("Failed to load recommended foods")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem('recommendedFoods')
    if (storedData) {
      const { data, timestamp } = JSON.parse(storedData)
      const lastUpdate = new Date(timestamp)
      const now = new Date()
      const hoursSinceLastUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastUpdate < 24) {
        setRecommendedFoods(data)
        setLastUpdated(timestamp)
        setIsLoading(false)
        return
      }
    }
    
    fetchRecommendedFoods()
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    fetchRecommendedFoods()
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Today's Recommended Foods</CardTitle>
          <CardDescription>Loading your personalized recommendations...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
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
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Today's Recommended Foods</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Today's Recommended Foods</CardTitle>
          <CardDescription className="text-base">Based on your nutrition goals and preferences</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendedFoods.map((food, index) => (
          <div key={index} className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{food.name}</h3>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <Clock className="h-4 w-4" />
                  {food.time}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-6 rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium">Calories</span>
                  </div>
                  <span className="text-lg font-bold">{food.calories} kcal</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Protein</span>
                  </div>
                  <span className="text-lg font-bold">{food.protein}g</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Carbs</span>
                  </div>
                  <span className="text-lg font-bold">{food.carbs}g</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Health Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {food.benefits.map((benefit, benefitIndex) => (
                    <Badge 
                      key={benefitIndex} 
                      variant="secondary" 
                      className="bg-gray-100 dark:bg-gray-700 px-3 py-1"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {lastUpdated && (
          <p className="text-xs text-muted-foreground text-right">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
} 