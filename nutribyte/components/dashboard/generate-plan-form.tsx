"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { FitnessLevelDialog } from "@/components/dashboard/fitness-level-dialog"

interface GeneratePlanFormProps {
  fitnessData: any
  hasExistingPlan?: boolean
}

export function GeneratePlanForm({ fitnessData, hasExistingPlan = false }: GeneratePlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [showFitnessLevelDialog, setShowFitnessLevelDialog] = useState(false)
  const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "intermediate" | "expert">("beginner")
  const [description, setDescription] = useState("")
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
          description,
          regenerate: hasExistingPlan,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate plan")
      }

      const data = await response.json()
      toast({
        title: hasExistingPlan ? "Plan Regenerated" : "Plan Generated",
        description: hasExistingPlan 
          ? "Your workout plan has been updated successfully."
          : "Your personalized workout plan has been created successfully.",
      })
      
      // Navigate to the workout plan page after successful generation
      router.push("/dashboard/workouts")
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generate Workout Plan</CardTitle>
          <CardDescription>
            {hasExistingPlan 
              ? "Create a new workout plan based on your fitness goals and preferences."
              : "Create a personalized workout plan based on your fitness goals and preferences."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Your Fitness Information</h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p><strong>Goal:</strong> {fitnessData.fitness_goal.replace(/_/g, " ")}</p>
                <p><strong>Available Time:</strong> {fitnessData.available_time.replace(/_/g, " ")}</p>
                <p><strong>Gender:</strong> {fitnessData.gender}</p>
                <p><strong>Fitness Level:</strong> {fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <p className="text-sm text-muted-foreground">
                Add any specific requirements, preferences, or notes about your workout plan.
              </p>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="E.g., I prefer bodyweight exercises, I have a knee injury, I want to focus on upper body, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
          <Button 
            onClick={handleGeneratePlan} 
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate Plan"
            )}
          </Button>
        </CardFooter>
      </Card>

      <FitnessLevelDialog
        open={showFitnessLevelDialog}
        onOpenChange={setShowFitnessLevelDialog}
        onSelect={(level) => {
          setFitnessLevel(level)
          setShowFitnessLevelDialog(false)
        }}
        selectedLevel={fitnessLevel}
      />
    </>
  )
}
