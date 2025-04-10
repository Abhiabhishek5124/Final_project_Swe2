import { useState, useCallback } from 'react'

interface UseLoadingStateOptions {
  initialState?: boolean
  initialStage?: string | null
}

interface LoadingState {
  loading: boolean
  stage: string | null
  error: string | null
  setLoading: (loading: boolean) => void
  setStage: (stage: string | null) => void
  setError: (error: string | null) => void
  startLoading: (stage?: string) => void
  stopLoading: () => void
  withLoading: <T>(
    fn: () => Promise<T>,
    options?: {
      stages?: Record<string, string>
      onSuccess?: (result: T) => void
      onError?: (error: Error) => void
    }
  ) => Promise<T>
}

export function useLoadingState(options: UseLoadingStateOptions = {}): LoadingState {
  const { initialState = false, initialStage = null } = options
  const [loading, setLoading] = useState<boolean>(initialState)
  const [stage, setStage] = useState<string | null>(initialStage)
  const [error, setError] = useState<string | null>(null)

  const startLoading = useCallback((initialStage?: string) => {
    setLoading(true)
    setStage(initialStage || null)
    setError(null)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
    setStage(null)
  }, [])

  const withLoading = useCallback(
    async <T>(
      fn: () => Promise<T>,
      options?: {
        stages?: Record<string, string>
        onSuccess?: (result: T) => void
        onError?: (error: Error) => void
      }
    ): Promise<T> => {
      startLoading(options?.stages?.start)
      try {
        // Execute stages in sequence if provided
        if (options?.stages) {
          Object.entries(options.stages).forEach(([key, value], index) => {
            if (key !== 'start' && key !== 'success' && key !== 'error') {
              setTimeout(() => {
                setStage(value)
              }, index * 200) // stagger the stages for visual effect
            }
          })
        }

        const result = await fn()
        
        // Set success stage if provided
        if (options?.stages?.success) {
          setStage(options.stages.success)
        }
        
        // Call onSuccess if provided
        if (options?.onSuccess) {
          options.onSuccess(result)
        }
        
        return result
      } catch (e) {
        const err = e as Error
        setError(err.message)
        
        // Set error stage if provided
        if (options?.stages?.error) {
          setStage(options.stages.error)
        }
        
        // Call onError if provided
        if (options?.onError) {
          options.onError(err)
        }
        
        throw err
      } finally {
        // Set a small timeout to show the final stage before removing the loader
        setTimeout(() => {
          stopLoading()
        }, 500)
      }
    },
    [startLoading, stopLoading]
  )

  return {
    loading,
    stage,
    error,
    setLoading,
    setStage,
    setError,
    startLoading,
    stopLoading,
    withLoading
  }
} 