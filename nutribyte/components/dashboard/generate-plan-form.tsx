"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { FitnessLevelDialog } from "@/components/dashboard/fitness-level-dialog"
import { Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GeneratePlanFormProps {
  fitnessData: any
  hasExistingPlan?: boolean
}

export function GeneratePlanForm({ fitnessData, hasExistingPlan = false }: GeneratePlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [showFitnessLevelDialog, setShowFitnessLevelDialog] = useState(false)
  const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "intermediate" | "expert">("beginner")
  const [goal, setGoal] = useState(fitnessData.fitness_goal)
  const [availableTime, setAvailableTime] = useState(fitnessData.available_time)
  const [gender, setGender] = useState(fitnessData.gender)
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
          goal,
          availableTime,
          gender,
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
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold tracking-tight">Generate Workout Plan</CardTitle>
          <CardDescription className="text-lg">
            {hasExistingPlan 
              ? "Create a new workout plan based on your fitness goals and preferences."
              : "Create a personalized workout plan based on your fitness goals and preferences."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Your Fitness Information</h3>
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-sm font-medium min-w-[120px]">Goal:</p>
                  <span className="text-sm capitalize">{goal.replace(/_/g, " ")}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-sm font-medium min-w-[120px]">Available Time:</p>
                  <span className="text-sm capitalize">{availableTime.replace(/_/g, " ")}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-sm font-medium min-w-[120px]">Gender:</p>
                  <span className="text-sm capitalize">{gender}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-sm font-medium min-w-[120px]">Fitness Level:</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm capitalize">{fitnessLevel}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFitnessLevelDialog(true)}
                      className="h-8"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Additional Information</h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  Add any specific requirements, preferences, or notes about your workout plan.
                </p>
                <textarea
                  className="w-full min-h-[200px] p-3 border rounded-md bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                  placeholder="E.g., I prefer bodyweight exercises, I have a knee injury, I want to focus on upper body, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button 
            onClick={handleGeneratePlan} 
            disabled={loading}
            className="min-w-[200px] h-12 text-lg"
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
