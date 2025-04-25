"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { FitnessLevelDialog } from "@/components/dashboard/fitness-level-dialog"

interface GeneratePlanFormProps {
  fitnessData: any
}

export function GeneratePlanForm({ fitnessData }: GeneratePlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [showFitnessLevelDialog, setShowFitnessLevelDialog] = useState(false)
  const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "intermediate" | "expert">("beginner")
  const router = useRouter()
  const { toast } = useToast()

  const handleGeneratePlan = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fitnessDataId: fitnessData.id,
          fitnessLevel,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate plan")
      }

      const data = await response.json()
      toast({
        title: "Plan Generated",
        description: "Your personalized workout plan has been created successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegeneratePlan = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fitnessDataId: fitnessData.id,
          fitnessLevel,
          regenerate: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to regenerate plan")
      }

      const data = await response.json()
      toast({
        title: "Plan Regenerated",
        description: "Your workout plan has been updated successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generate Workout Plan</CardTitle>
          <CardDescription>
            Create a personalized workout plan based on your fitness goals and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Your Fitness Information</h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p><strong>Goal:</strong> {fitnessData.fitness_goal}</p>
                <p><strong>Available Time:</strong> {fitnessData.available_time}</p>
                <p><strong>Gender:</strong> {fitnessData.gender}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFitnessLevelDialog(true)}
            disabled={loading}
          >
            Select Fitness Level
          </Button>
          <Button onClick={handleRegeneratePlan} disabled={loading}>
            Regenerate Plan
          </Button>
        </CardFooter>
      </Card>

      <FitnessLevelDialog
        open={showFitnessLevelDialog}
        onOpenChange={setShowFitnessLevelDialog}
        onSelect={(level) => {
          setFitnessLevel(level)
          handleGeneratePlan()
        }}
      />
    </>
  )
}
