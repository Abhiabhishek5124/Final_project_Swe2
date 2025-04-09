import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="grid gap-8 p-4 md:gap-10 md:p-6">{children}</div>
}
