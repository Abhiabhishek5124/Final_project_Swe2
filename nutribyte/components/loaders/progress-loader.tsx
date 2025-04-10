"use client"

import React, { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressLoaderProps {
  loading: boolean
  progress?: number
  className?: string
  text?: string
  autoIncrement?: boolean
  duration?: number
}

export function ProgressLoader({
  loading,
  progress: externalProgress,
  className,
  text = "Loading...",
  autoIncrement = true,
  duration = 3000,
}: ProgressLoaderProps) {
  const [progress, setProgress] = useState(externalProgress || 0)

  useEffect(() => {
    // If external progress is provided, use it
    if (externalProgress !== undefined) {
      setProgress(externalProgress)
      return
    }
    
    // If not loading, reset to 0 or 100 based on where we are
    if (!loading) {
      setProgress(progress >= 80 ? 100 : 0)
      return
    }
    
    // Auto increment logic when no external progress is provided
    if (loading && autoIncrement) {
      // Reset to 0 when starting
      if (progress === 100 || progress === 0) {
        setProgress(0)
      }
      
      // Gradually move to 80% (leave room for completion)
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 80) {
            clearInterval(interval)
            return prevProgress
          }
          // Slow down as it progresses
          const increment = Math.max(1, (80 - prevProgress) / 10)
          return Math.min(80, prevProgress + increment)
        })
      }, duration / 80)
      
      return () => clearInterval(interval)
    }
  }, [loading, externalProgress, autoIncrement, duration, progress])
  
  // Immediately jump to 100% when loading completes
  useEffect(() => {
    if (!loading && autoIncrement && progress > 0 && progress < 100) {
      setProgress(100)
    }
  }, [loading, autoIncrement, progress])

  if (!loading && progress === 0) return null

  return (
    <div className={cn("w-full flex flex-col items-center space-y-2", className)}>
      <Progress value={progress} className="w-full h-2" />
      {text && (
        <div className="text-sm text-muted-foreground flex items-center">
          <span className="mr-2">{text}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  )
} 