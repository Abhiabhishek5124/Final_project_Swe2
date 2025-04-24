"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Heart, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HealthStatusProps {
  fitnessData: {
    height_inches: number
    weight: number
    age: number
    gender: string
  }
}

export function HealthStatus({ fitnessData }: HealthStatusProps) {
  // Convert height from inches to meters
  const heightInMeters = fitnessData.height_inches * 0.0254
  
  // Calculate BMI
  const bmi = fitnessData.weight / (heightInMeters * heightInMeters)
  
  // Determine status and color based on gender-specific ranges
  let status: "Underweight" | "Normal" | "Overweight" | "Obese"
  let color: string
  let icon: React.ReactNode
  
  // Adjust BMI ranges based on gender
  const isMale = fitnessData.gender.toLowerCase() === 'male'
  const underweightThreshold = isMale ? 18.5 : 18.5
  const normalUpperThreshold = isMale ? 25 : 24.9
  const overweightUpperThreshold = isMale ? 30 : 29.9
  
  if (bmi < underweightThreshold) {
    status = "Underweight"
    color = "bg-yellow-100 text-yellow-800"
    icon = <AlertTriangle className="h-6 w-6" />
  } else if (bmi < normalUpperThreshold) {
    status = "Normal"
    color = "bg-green-100 text-green-800"
    icon = <Heart className="h-6 w-6" />
  } else if (bmi < overweightUpperThreshold) {
    status = "Overweight"
    color = "bg-orange-100 text-orange-800"
    icon = <Scale className="h-6 w-6" />
  } else {
    status = "Obese"
    color = "bg-red-100 text-red-800"
    icon = <AlertTriangle className="h-6 w-6" />
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Health Status</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("flex items-center justify-between rounded-lg p-3", color)}>
          <div>
            <p className="text-2xl font-bold">{status}</p>
            <div className="flex items-center gap-1">
              <p className="text-sm">BMI: {bmi.toFixed(1)}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-2">
                      <p className="font-semibold">Body Mass Index (BMI)</p>
                      <p>BMI is calculated by dividing weight (kg) by height squared (m²)</p>
                      <p>Formula: weight (kg) / (height (m) × height (m))</p>
                      <p>Categories for {fitnessData.gender}:</p>
                      <ul className="list-disc pl-4">
                        <li>Underweight: BMI &lt; {underweightThreshold}</li>
                        <li>Normal: BMI {underweightThreshold} - {normalUpperThreshold}</li>
                        <li>Overweight: BMI {normalUpperThreshold} - {overweightUpperThreshold}</li>
                        <li>Obese: BMI ≥ {overweightUpperThreshold}</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        Note: BMI ranges may vary slightly based on gender and body composition.
                        For athletes or individuals with high muscle mass, BMI may not accurately reflect body fat percentage.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="text-sm">
            <p>Height: {fitnessData.height_inches} in</p>
            <p>Weight: {fitnessData.weight} kg</p>
            <p>Age: {fitnessData.age} years</p>
            <p>Gender: {fitnessData.gender}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 