import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  avatarUrl?: string // Optionally allow avatar
}

export function DashboardHeader({ heading, text, children, avatarUrl }: DashboardHeaderProps) {
  return (
    <div className="relative mb-6 rounded-xl bg-gradient-to-r from-blue-50 via-white to-emerald-50 shadow-md p-6 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
          {heading}
        </h1>
        {text && <p className="text-lg text-gray-600 font-medium">{text}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        <div className="hidden md:block">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center shadow-lg">
            {avatarUrl ? (
              <img src={avatarUrl} alt="User avatar" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
