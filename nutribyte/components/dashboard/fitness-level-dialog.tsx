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

interface FitnessLevelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (level: "beginner" | "intermediate" | "expert") => void
}

export function FitnessLevelDialog({ open, onOpenChange, onSelect }: FitnessLevelDialogProps) {
  const [level, setLevel] = useState<"beginner" | "intermediate" | "expert">("beginner")

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
            defaultValue="beginner"
            className="space-y-4"
            onValueChange={(value) => setLevel(value as "beginner" | "intermediate" | "expert")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expert" id="expert" />
              <Label htmlFor="expert">Expert</Label>
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