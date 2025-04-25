"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

interface FitnessLevelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (level: "beginner" | "intermediate" | "expert") => void
  selectedLevel?: "beginner" | "intermediate" | "expert"
}

export function FitnessLevelDialog({ open, onOpenChange, onSelect, selectedLevel = "beginner" }: FitnessLevelDialogProps) {
  const [level, setLevel] = useState<"beginner" | "intermediate" | "expert">(selectedLevel)

  const handleSubmit = () => {
    onSelect(level)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Your Fitness Level</DialogTitle>
          <DialogDescription>
            This will help us create a workout plan that matches your current fitness level.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={level}
            className="space-y-4"
            onValueChange={(value) => setLevel(value as "beginner" | "intermediate" | "expert")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner" className="flex items-center justify-between w-full">
                <span>Beginner</span>
                {level === "beginner" && <Check className="h-4 w-4 text-green-500" />}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate" className="flex items-center justify-between w-full">
                <span>Intermediate</span>
                {level === "intermediate" && <Check className="h-4 w-4 text-green-500" />}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expert" id="expert" />
              <Label htmlFor="expert" className="flex items-center justify-between w-full">
                <span>Expert</span>
                {level === "expert" && <Check className="h-4 w-4 text-green-500" />}
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 