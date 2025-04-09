"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface WorkoutPlanDisplayProps {
  plan: any
  view: "daily" | "weekly" | "exercises"
}

export function WorkoutPlanDisplay({ plan, view }: WorkoutPlanDisplayProps) {
  const [editing, setEditing] = useState(false)
  const [editedPlan, setEditedPlan] = useState(plan)

  // This is a simplified example - in a real app, you would have more structured data
  // and more sophisticated editing capabilities
  const handleSave = async () => {
    // Here you would call an API to save the edited plan
    setEditing(false)
  }

  if (view === "daily") {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          {editing ? (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Plan
            </Button>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Today's Workout: Upper Body</CardTitle>
            <CardDescription>45-60 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea
                value={editedPlan.description}
                onChange={(e) => setEditedPlan({ ...editedPlan, description: e.target.value })}
                className="min-h-[100px] mb-4"
              />
            ) : (
              <p className="mb-4">
                {plan.description ||
                  "Focus on chest, shoulders, and triceps with moderate weights and controlled movements."}
              </p>
            )}
            <div className="space-y-4">
              {(
                plan.exercises || [
                  { name: "Bench Press", sets: "3", reps: "8-10", rest: "90 sec" },
                  { name: "Shoulder Press", sets: "3", reps: "10-12", rest: "60 sec" },
                  { name: "Tricep Pushdowns", sets: "3", reps: "12-15", rest: "60 sec" },
                  { name: "Lat Pulldowns", sets: "3", reps: "10-12", rest: "60 sec" },
                  { name: "Bicep Curls", sets: "3", reps: "12-15", rest: "60 sec" },
                ]
              ).map((exercise, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center border-b pb-2">
                  <div className="font-medium">{exercise.name}</div>
                  <div>{exercise.sets} sets</div>
                  <div>{exercise.reps} reps</div>
                  <div>{exercise.rest} rest</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (view === "weekly") {
    // Weekly view implementation
    return (
      <div className="space-y-4">
        <p>Weekly workout schedule view would go here</p>
      </div>
    )
  }

  // Exercises view
  return (
    <div className="space-y-4">
      <p>Exercise database view would go here</p>
    </div>
  )
}
