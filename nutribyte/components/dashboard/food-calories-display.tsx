"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const foodItems = [
  {
    name: "Avocado Toast",
    calories: 350,
    image: "/avocado.jpg",
    description: "Whole grain bread with avocado, eggs, and microgreens"
  },
  {
    name: "Grilled Chicken Salad",
    calories: 450,
    image: "/easy-grilled-chicken-salad-1.jpg",
    description: "Mixed greens with grilled chicken, cherry tomatoes, and balsamic dressing"
  },
  {
    name: "Quinoa Bowl",
    calories: 550,
    image: "/quinoa-shrimp-bowl-18.jpg",
    description: "Quinoa with roasted vegetables, chickpeas, and tahini dressing"
  },
  {
    name: "Greek Yogurt Parfait",
    calories: 250,
    image: "/Greek-Yogurt-Parfait-Featured.jpg",
    description: "Greek yogurt with mixed berries and granola"
  }
]

export function FoodCaloriesDisplay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Food Items</CardTitle>
        <CardDescription>Common meals and their calorie content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {foodItems.map((food, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg border bg-card">
              <div className="aspect-square overflow-hidden">
                <Image
                  src={food.image}
                  alt={food.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-white">{food.name}</h3>
                <p className="text-sm text-white/80">{food.calories} kcal</p>
                <p className="text-xs text-white/60">{food.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 