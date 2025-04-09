import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data - in a real app, this would come from the database
const activities = [
  {
    id: 1,
    type: "plan_update",
    title: "Updated Nutrition Plan",
    date: "2 hours ago",
  },
  {
    id: 2,
    type: "workout_completed",
    title: "Completed Leg Day Workout",
    date: "Yesterday",
  },
  {
    id: 3,
    type: "weight_update",
    title: "Recorded New Weight: 76kg",
    date: "3 days ago",
  },
  {
    id: 4,
    type: "plan_generated",
    title: "Generated New Workout Plan",
    date: "1 week ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
            <AvatarFallback>NU</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
