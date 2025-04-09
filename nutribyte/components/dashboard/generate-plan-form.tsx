"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface GeneratePlanFormProps {
  fitnessData: any
}

export function GeneratePlanForm({ fitnessData }: GeneratePlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [regenerate, setRegenerate] = useState(false)
  const [additionalNotes, setAdditionalNotes] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fitnessDataId: fitnessData.id,
          regenerate,
          additionalNotes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate plan")
      }

      toast({
        title: "Success!",
        description: "Your personalized plans have been generated.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Error generating plan:", error)
      toast({
        title: "Error",
        description: "Failed to generate your plans. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Generate Your Personalized Plans</CardTitle>
          <CardDescription>
            We'll use your fitness data to create customized nutrition and workout plans.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Your Current Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Height</p>
                <p className="text-sm text-muted-foreground">{fitnessData.height} cm</p>
              </div>
              <div>
                <p className="text-sm font-medium">Weight</p>
                <p className="text-sm text-muted-foreground">{fitnessData.weight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium">Fitness Goal</p>
                <p className="text-sm text-muted-foreground">{fitnessData.fitness_goal}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Timeframe</p>
                <p className="text-sm text-muted-foreground">{fitnessData.timeframe}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Available Time</p>
                <p className="text-sm text-muted-foreground">{fitnessData.available_time}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Dietary Preferences</p>
                <p className="text-sm text-muted-foreground">{fitnessData.dietary_preferences || "None specified"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="regenerate"
                checked={regenerate}
                onCheckedChange={(checked) => setRegenerate(checked as boolean)}
              />
              <Label htmlFor="regenerate">Regenerate plans (this will replace any existing plans)</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific preferences or requirements for your plans..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Generating..." : "Generate Plans"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
