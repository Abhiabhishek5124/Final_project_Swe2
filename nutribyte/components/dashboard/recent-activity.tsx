"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Activity, Utensils, Scale, Dumbbell, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: number
  type: "plan_update" | "workout_completed" | "weight_update" | "plan_generated" | "meal_logged" | "progress_update"
  title: string
  date: string
  details?: string
}

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "workout_completed":
      return <Dumbbell className="h-4 w-4" />
    case "plan_update":
    case "plan_generated":
      return <Calendar className="h-4 w-4" />
    case "weight_update":
      return <Scale className="h-4 w-4" />
    case "meal_logged":
      return <Utensils className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

const getActivityType = (type: Activity["type"]) => {
  switch (type) {
    case "workout_completed":
      return "Workout"
    case "plan_update":
      return "Plan Update"
    case "plan_generated":
      return "Plan Generated"
    case "weight_update":
      return "Weight"
    case "meal_logged":
      return "Meal"
    case "progress_update":
      return "Progress"
    default:
      return "Activity"
  }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load activities from localStorage
    const storedActivities = localStorage.getItem('userActivities')
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities))
    } else {
      // Initialize with sample data if no stored activities
      const initialActivities: Activity[] = [
        {
          id: 1,
          type: "plan_update",
          title: "Updated Nutrition Plan",
          date: new Date().toISOString(),
          details: "Adjusted calorie intake based on progress"
        },
        {
          id: 2,
          type: "workout_completed",
          title: "Completed Leg Day Workout",
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          details: "Squats, Lunges, Leg Press"
        },
        {
          id: 3,
          type: "weight_update",
          title: "Recorded New Weight: 76kg",
          date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          details: "0.5kg decrease from last week"
        },
        {
          id: 4,
          type: "plan_generated",
          title: "Generated New Workout Plan",
          date: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
          details: "Focus on strength training"
        }
      ]
      setActivities(initialActivities)
      localStorage.setItem('userActivities', JSON.stringify(initialActivities))
    }
    setIsLoading(false)
  }, [])

  const handleClearActivities = () => {
    setActivities([])
    localStorage.removeItem('userActivities')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Loading your activity history...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest nutrition and fitness updates</CardDescription>
        </div>
        {activities.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearActivities}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No activities recorded yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.type)}
                      {activity.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getActivityType(activity.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(activity.date)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
