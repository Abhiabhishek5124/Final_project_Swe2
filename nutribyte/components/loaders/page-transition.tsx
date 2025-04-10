"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { ProgressLoader } from "@/components/loaders/progress-loader"

export function PageTransition() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  // Listen for route changes
  useEffect(() => {
    // When the route changes, show loading indicator
    setIsLoading(true)
    
    // Simulate progress
    setProgress(30)
    
    const fastProgress = setTimeout(() => {
      setProgress(90)
    }, 300)
    
    // Hide loader after transition completes
    const showContent = setTimeout(() => {
      setProgress(100)
      
      const hideLoader = setTimeout(() => {
        setIsLoading(false)
      }, 200)
      
      return () => clearTimeout(hideLoader)
    }, 600)
    
    return () => {
      clearTimeout(fastProgress)
      clearTimeout(showContent)
    }
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <ProgressLoader 
        loading={isLoading} 
        progress={progress} 
        autoIncrement={false}
        text={null}
      />
    </div>
  )
} 