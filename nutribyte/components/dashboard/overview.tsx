"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { HealthStatus } from "./health-status"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import { useEffect, useState } from "react"

// Sample data - in a real app, this would come from the database
const data = [
  { date: "Mon", calories: 2200, goal: 2000 },
  { date: "Tue", calories: 2100, goal: 2000 },
  { date: "Wed", calories: 2300, goal: 2000 },
  { date: "Thu", calories: 2250, goal: 2000 },
  { date: "Fri", calories: 2150, goal: 2000 },
  { date: "Sat", calories: 2400, goal: 2000 },
  { date: "Sun", calories: 2350, goal: 2000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Calories</span>
            <span className="font-bold">
              {payload[0].value} kcal
              <span className="ml-2 text-xs text-muted-foreground">
                ({payload[0].value > payload[0].payload.goal ? "+" : ""}
                {payload[0].value - payload[0].payload.goal} from goal)
              </span>
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function Overview() {
  const [fitnessData, setFitnessData] = useState<any>(null)
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchFitnessData() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return
      }

      const { data } = await supabase
        .from("fitness_data")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      if (data) {
        setFitnessData(data)
      }
    }

    fetchFitnessData()
  }, [supabase])

  if (!fitnessData) {
    return null
  }

  return (
    <div className="space-y-4">
      <HealthStatus fitnessData={fitnessData} />
      <ChartContainer
        config={{
          calories: {
            label: "Calories (kcal)",
            color: "hsl(var(--chart-1))",
          },
          goal: {
            label: "Daily Goal",
            color: "hsl(var(--muted))",
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
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10} 
              className="text-sm text-muted-foreground"
              domain={[1500, 2500]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={2000} stroke="hsl(var(--muted))" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="calories" 
              strokeWidth={2} 
              activeDot={{ r: 6 }} 
              stroke="hsl(var(--chart-1))"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
