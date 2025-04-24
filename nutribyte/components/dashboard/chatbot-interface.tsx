"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Trash2 } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const resetToWelcomeMessage = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single()
      
      if (userProfile) {
        setMessages([{
          id: "welcome",
          content: `Hi ${userProfile.first_name}, how can I help you today?`,
          role: "assistant",
          timestamp: new Date(),
        }])
      }
    }
  }

  useEffect(() => {
    resetToWelcomeMessage()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamedMessage])

  const handleQuestionClick = async (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setStreamedMessage("")

    try {
      const chatHistory = [
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: "user", content: question },
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

  const handleClearMessages = async () => {
    setInput("")
    setStreamedMessage("")
    await resetToWelcomeMessage()
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col">
      <Card className="flex-1 overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="flex h-full flex-col p-0">
          <div className="flex items-center justify-between border-b p-2">
            <h2 className="text-lg font-semibold">Nutribyte Chat</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                  <AvatarImage
                    src={message.role === "user" ? "/user-avatar.png" : "/nutribyte-avatar.png"}
                    alt={message.role === "user" ? "User" : "Nutribyte"}
                  />
                  <AvatarFallback>{message.role === "user" ? "U" : "N"}</AvatarFallback>
                </Avatar>
                <div
                  className={`group relative rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-muted-foreground rounded-tl-none"
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
                  <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
                    <p className="text-xs text-muted-foreground/70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(isLoading || streamedMessage) && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                  <AvatarImage src="/nutribyte-avatar.png" alt="Nutribyte" />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <div className="group relative rounded-2xl bg-muted px-4 py-2 max-w-[80%] rounded-tl-none shadow-sm">
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
            <div className="border-t p-4 bg-muted/50">
              <div className="grid grid-cols-2 gap-2">
                {defaultQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto py-2 px-3 text-sm hover:bg-background/50"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="border-t p-4 bg-background/50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full shadow-sm"
                disabled={isLoading}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full aspect-square p-0 h-10 w-10 shadow-sm"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to clear all messages? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearMessages}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear Messages
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="rounded-full aspect-square p-0 h-10 w-10 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}