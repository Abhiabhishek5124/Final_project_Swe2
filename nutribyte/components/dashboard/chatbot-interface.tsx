"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const defaultQuestions = [
  "What's a good meal plan for my goals?",
  "Can you suggest a workout routine?",
  "How can I track my progress?",
  "What are some healthy snack options?",
]

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamedMessage, setStreamedMessage] = useState("")
  const [userName, setUserName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: userProfile } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single()
        
        if (userProfile) {
          setUserName(userProfile.full_name)
          // Add welcome message
          setMessages([{
            id: "welcome",
            content: `Hi ${userProfile.full_name}, how can I help you today?`,
            role: "assistant",
            timestamp: new Date(),
          }])
        }
      }
    }
    fetchUserData()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamedMessage])

  const handleQuestionClick = (question: string) => {
    setInput(question)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setStreamedMessage("")

    try {
      const chatHistory = [
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: "user", content: input },
      ]
      const response = await fetch("/api/chatbot/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      })
      if (!response.body) throw new Error("No response body")
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let assistantText = ""
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunk = decoder.decode(value)
        assistantText += chunk
        setStreamedMessage(assistantText)
      }
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantText,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setStreamedMessage("")
    } catch (error) {
      setStreamedMessage("")
      console.error("Error getting response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col">
      <Card className="flex-1 overflow-hidden">
        <CardContent className="flex h-full flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={message.role === "user" ? "/user-avatar.png" : "/nutribyte-avatar.png"}
                    alt={message.role === "user" ? "User" : "Nutribyte"}
                  />
                  <AvatarFallback>{message.role === "user" ? "U" : "N"}</AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line leading-relaxed">
                      {message.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {(isLoading || streamedMessage) && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/nutribyte-avatar.png" alt="Nutribyte" />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted px-4 py-2 max-w-[80%]">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line leading-relaxed">
                      {streamedMessage.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                      {isLoading && !streamedMessage && (
                        <span className="inline-block animate-bounce">...</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {messages.length === 1 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {defaultQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}