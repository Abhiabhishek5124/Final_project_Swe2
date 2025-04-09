"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface NutritionPlanDisplayProps {
  plan: any
  view: "daily" | "weekly" | "meals"
}

export function NutritionPlanDisplay({ plan, view }: NutritionPlanDisplayProps) {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Breakfast</CardTitle>
              <CardDescription>7:00 AM - 8:00 AM</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={editedPlan.breakfast}
                  onChange={(e) => setEditedPlan({ ...editedPlan, breakfast: e.target.value })}
                  className="min-h-[150px]"
                />
              ) : (
                <div className="space-y-2">
                  <p>{plan.breakfast || "2 eggs, whole wheat toast, avocado, and a side of fruit."}</p>
                  <p className="text-sm text-muted-foreground">Approx. 450 calories</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lunch</CardTitle>
              <CardDescription>12:00 PM - 1:00 PM</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={editedPlan.lunch}
                  onChange={(e) => setEditedPlan({ ...editedPlan, lunch: e.target.value })}
                  className="min-h-[150px]"
                />
              ) : (
                <div className="space-y-2">
                  <p>{plan.lunch || "Grilled chicken salad with mixed greens, vegetables, and olive oil dressing."}</p>
                  <p className="text-sm text-muted-foreground">Approx. 550 calories</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dinner</CardTitle>
              <CardDescription>6:00 PM - 7:00 PM</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={editedPlan.dinner}
                  onChange={(e) => setEditedPlan({ ...editedPlan, dinner: e.target.value })}
                  className="min-h-[150px]"
                />
              ) : (
                <div className="space-y-2">
                  <p>{plan.dinner || "Baked salmon with quinoa and steamed vegetables."}</p>
                  <p className="text-sm text-muted-foreground">Approx. 600 calories</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Snacks</CardTitle>
              <CardDescription>Throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={editedPlan.snacks}
                  onChange={(e) => setEditedPlan({ ...editedPlan, snacks: e.target.value })}
                  className="min-h-[150px]"
                />
              ) : (
                <div className="space-y-2">
                  <p>{plan.snacks || "Greek yogurt with berries, handful of nuts, protein shake after workout."}</p>
                  <p className="text-sm text-muted-foreground">Approx. 300 calories total</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (view === "weekly") {
    // Weekly view implementation
    return (
      <div className="space-y-4">
        <p>Weekly nutrition plan view would go here</p>
      </div>
    )
  }

  // Meals view
  return (
    <div className="space-y-4">
      <p>Meal database view would go here</p>
    </div>
  )
}
