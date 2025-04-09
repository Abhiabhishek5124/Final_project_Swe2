"use client"

import type * as React from "react"
import { Circle } from "lucide-react"
import { TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
    formatter?: (value: number) => string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  return (
    <TooltipProvider>
      <div
        className={className}
        style={
          {
            "--color-weight": "hsl(var(--chart-1))",
            ...Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color])),
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </TooltipProvider>
  )
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    dataKey: string
    payload: Record<string, any>
  }>
  label?: string
  formatter?: (value: number, name: string, props: any) => React.ReactNode
  labelFormatter?: (label: string) => React.ReactNode
  config?: ChartConfig
}

export function ChartTooltip({ active, payload, label, formatter, labelFormatter, config }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            {labelFormatter ? labelFormatter(label as string) : label}
          </div>
        </div>
        <div className="grid gap-1">
          {payload.map((entry, index) => {
            const dataKey = entry.dataKey
            const value = entry.value
            const color = config?.[dataKey]?.color || "var(--chart-1)"
            const formattedValue = formatter
              ? formatter(value, entry.name, entry)
              : config?.[dataKey]?.formatter
                ? config[dataKey].formatter!(value)
                : value

            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <Circle className="size-2 fill-current" style={{ color }} />
                  <span>{config?.[dataKey]?.label || entry.name}</span>
                </div>
                <div className="text-sm font-medium tabular-nums">{formattedValue}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function ChartTooltipContent({ className, ...props }: React.ComponentProps<typeof TooltipContent>) {
  return <TooltipContent sideOffset={4} className={className} {...props} />
}
