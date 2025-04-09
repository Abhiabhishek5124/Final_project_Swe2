"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - in a real app, this would come from the database
const data = [
  { date: "Jan", weight: 85 },
  { date: "Feb", weight: 83 },
  { date: "Mar", weight: 82 },
  { date: "Apr", weight: 80 },
  { date: "May", weight: 78 },
  { date: "Jun", weight: 77 },
  { date: "Jul", weight: 76 },
]

export function Overview() {
  return (
    <ChartContainer
      config={{
        weight: {
          label: "Weight (kg)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            className="text-sm text-muted-foreground"
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-sm text-muted-foreground" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="weight" strokeWidth={2} activeDot={{ r: 6 }} stroke="var(--color-weight)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
