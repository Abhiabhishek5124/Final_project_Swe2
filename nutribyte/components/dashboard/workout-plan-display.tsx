"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Save, ChevronDown, ChevronUp, Plus, Trash2, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface WorkoutExercise {
  name: string
  sets: number
  reps: string
  rest: string
  description: string
}

interface DailyWorkout {
  day: string
  focus: string
  duration: string
  exercises: WorkoutExercise[]
}

interface WorkoutPlan {
  level: "beginner" | "intermediate" | "expert"
  weeklySchedule: DailyWorkout[]
}

interface WorkoutPlanDisplayProps {
  plan: WorkoutPlan & { fitness_data_id: string }
  view: "daily" | "weekly" | "exercises"
  planId: string
}

export function WorkoutPlanDisplay({ plan, view, planId }: WorkoutPlanDisplayProps) {
  const [editing, setEditing] = useState(false)
  const [editedPlan, setEditedPlan] = useState(plan)
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Validate plan structure
  if (!plan || !plan.weeklySchedule || !Array.isArray(plan.weeklySchedule)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Invalid workout plan format</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">The workout plan data is not in the correct format. Please regenerate your plan.</p>
        </CardContent>
      </Card>
    )
  }

  const toggleExercise = (exerciseName: string) => {
    const newExpanded = new Set(expandedExercises)
    if (newExpanded.has(exerciseName)) {
      newExpanded.delete(exerciseName)
    } else {
      newExpanded.add(exerciseName)
    }
    setExpandedExercises(newExpanded)
  }

  const handleSave = async () => {
    try {
      console.log("Saving plan:", {
        planId,
        updatedPlan: editedPlan
      });

      const response = await fetch("/api/workout-plan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          updatedPlan: editedPlan,
        }),
      });

      const data = await response.json();
      console.log("Save response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update plan");
      }

      toast({
        title: "Success",
        description: "Workout plan updated successfully",
      });
      setEditing(false);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update workout plan",
        variant: "destructive",
      });
    }
  };

  const handleRegenerate = () => {
    router.push("/dashboard/generate");
  };

  const handleAddExercise = (dayIndex: number) => {
    const newPlan = { ...editedPlan }
    const newExercise: WorkoutExercise = {
      name: "New Exercise",
      sets: 3,
      reps: "8-12",
      rest: "60-90 seconds",
      description: "Exercise description",
    }
    newPlan.weeklySchedule[dayIndex].exercises.push(newExercise)
    setEditedPlan(newPlan)
  }

  const handleDeleteExercise = (dayIndex: number, exerciseIndex: number) => {
    const newPlan = { ...editedPlan }
    newPlan.weeklySchedule[dayIndex].exercises.splice(exerciseIndex, 1)
    setEditedPlan(newPlan)
  }

  const handleExerciseChange = (
    dayIndex: number,
    exerciseIndex: number,
    field: keyof WorkoutExercise,
    value: string | number
  ) => {
    const newPlan = { ...editedPlan }
    newPlan.weeklySchedule[dayIndex].exercises[exerciseIndex][field] = value as never
    setEditedPlan(newPlan)
  }

  const getCurrentDayWorkout = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = days[new Date().getDay()]
    return editedPlan.weeklySchedule.find(workout => workout.day === today)
  }

  const renderExerciseRow = (
    exercise: WorkoutExercise,
    dayIndex: number,
    exerciseIndex: number,
    showActions: boolean = true
  ) => (
    <TableRow key={exerciseIndex} className="group hover:bg-muted/50">
      <TableCell className="w-[30%]">
        {editing ? (
          <Input
            value={exercise.name}
            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "name", e.target.value)}
            className="w-full"
          />
        ) : (
          <span className="font-medium">{exercise.name}</span>
        )}
      </TableCell>
      <TableCell className="w-[15%]">
        {editing ? (
          <Input
            type="number"
            value={exercise.sets.toString()}
            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "sets", parseInt(e.target.value) || 0)}
            className="w-full"
          />
        ) : (
          exercise.sets
        )}
      </TableCell>
      <TableCell className="w-[15%]">
        {editing ? (
          <Input
            value={exercise.reps}
            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "reps", e.target.value)}
            className="w-full"
          />
        ) : (
          exercise.reps
        )}
      </TableCell>
      <TableCell className="w-[15%]">
        {editing ? (
          <Input
            value={exercise.rest}
            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "rest", e.target.value)}
            className="w-full"
          />
        ) : (
          exercise.rest
        )}
      </TableCell>
      <TableCell className="w-[25%]">
        <Collapsible>
          <CollapsibleTrigger
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            onClick={() => toggleExercise(exercise.name)}
          >
            {expandedExercises.has(exercise.name) ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span>View Instructions</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden transition-all duration-200">
            <div className="py-2">
              {editing ? (
                <Input
                  value={exercise.description}
                  onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "description", e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                  {exercise.description}
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </TableCell>
      {showActions && editing && (
        <TableCell className="w-[10%]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteExercise(dayIndex, exerciseIndex)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      )}
    </TableRow>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        {editing ? (
          <>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Plan
            </Button>
            <Button onClick={handleRegenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Plan
            </Button>
          </>
        )}
      </div>

      {view === "daily" && (() => {
        const todayWorkout = getCurrentDayWorkout()
        if (!todayWorkout) {
          return (
            <Card>
              <CardHeader>
                <CardTitle>No Workout Today</CardTitle>
                <CardDescription>Rest day or no workout scheduled for today</CardDescription>
              </CardHeader>
            </Card>
          )
        }

        const dayIndex = editedPlan.weeklySchedule.findIndex(w => w.day === todayWorkout.day)

        return (
          <Card>
            <CardHeader>
              <CardTitle>Today's Workout: {todayWorkout.focus}</CardTitle>
              <CardDescription>{todayWorkout.duration}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Sets</TableHead>
                    <TableHead>Reps</TableHead>
                    <TableHead>Rest</TableHead>
                    <TableHead>Instructions</TableHead>
                    {editing && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayWorkout.exercises.map((exercise, index) => 
                    renderExerciseRow(exercise, dayIndex, index)
                  )}
                </TableBody>
              </Table>
              {editing && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleAddExercise(dayIndex)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exercise
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })()}

      {view === "weekly" && (
        <div className="space-y-6">
          {editedPlan.weeklySchedule.map((workout, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{workout.day}: {workout.focus}</CardTitle>
                <CardDescription>{workout.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exercise</TableHead>
                      <TableHead>Sets</TableHead>
                      <TableHead>Reps</TableHead>
                      <TableHead>Rest</TableHead>
                      <TableHead>Instructions</TableHead>
                      {editing && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workout.exercises.map((exercise, idx) => 
                      renderExerciseRow(exercise, index, idx)
                    )}
                  </TableBody>
                </Table>
                {editing && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleAddExercise(index)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Exercise
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {view === "exercises" && (
        <div className="space-y-4">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
              <div className="flex flex-col space-y-4">
                <div>
                  <CardTitle className="text-2xl font-bold">Exercise Database</CardTitle>
                  <CardDescription className="text-base">Browse and manage all exercises in your workout plan</CardDescription>
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[40%] text-base font-semibold">Exercise</TableHead>
                    <TableHead className="w-[50%] text-base font-semibold">Instructions</TableHead>
                    {editing && <TableHead className="w-[10%] text-base font-semibold">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const filteredExercises = editedPlan.weeklySchedule
                      .flatMap((workout, dayIndex) => 
                        workout.exercises.map((exercise, exerciseIndex) => ({
                          ...exercise,
                          dayIndex,
                          exerciseIndex
                        }))
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .filter(exercise => 
                        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )

                    if (filteredExercises.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={editing ? 3 : 2} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Search className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">No exercises found</p>
                              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    }

                    return filteredExercises.map(({ name, description, dayIndex, exerciseIndex }) => (
                      <TableRow 
                        key={`${dayIndex}-${exerciseIndex}`} 
                        className="group hover:bg-muted/50 border-b border-muted/30"
                      >
                        <TableCell className="font-medium py-4">
                          {editing ? (
                            <Input
                              value={name}
                              onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "name", e.target.value)}
                              className="w-full"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-primary/50" />
                              <span className="text-base">{name}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Collapsible>
                            <CollapsibleTrigger
                              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors py-4"
                              onClick={() => toggleExercise(name)}
                            >
                              {expandedExercises.has(name) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                              <span className="font-medium">View Instructions</span>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="overflow-hidden transition-all duration-200">
                              <div className="py-4">
                                {editing ? (
                                  <Input
                                    value={description}
                                    onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "description", e.target.value)}
                                    className="w-full"
                                  />
                                ) : (
                                  <div className="bg-muted/30 p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                        {editing && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteExercise(dayIndex, exerciseIndex)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  })()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
