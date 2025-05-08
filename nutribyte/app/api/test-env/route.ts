import { NextResponse } from "next/server"

export async function GET() {
  const hasGroqKey = !!process.env.GROQ_API_KEY
  
  return NextResponse.json({
    hasGroqKey,
    message: hasGroqKey 
      ? "GROQ_API_KEY is set" 
      : "GROQ_API_KEY is not set"
  })
} 