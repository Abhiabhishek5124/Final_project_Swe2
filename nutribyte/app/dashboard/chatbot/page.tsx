import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ChatbotInterface } from "@/components/dashboard/chatbot-interface"
import { createServerClient } from "@/lib/supabase/server"

export default async function ChatbotPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Nutribyte Chat"
        text="Chat with our AI assistant to get personalized nutrition and fitness advice."
      />
      <div className="flex-1">
        <ChatbotInterface />
      </div>
    </DashboardShell>
  )
} 