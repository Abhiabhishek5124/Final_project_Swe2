import OpenAI from 'openai'
import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

const systemPrompt = {
  role: "system",
  content: `You are Nutribyte, an AI nutrition and fitness assistant. You have access to the user's fitness data and can provide personalized advice.

Your capabilities include:
- Providing nutrition advice and meal suggestions
- Offering workout recommendations
- Answering questions about health and fitness
- Giving personalized advice based on the user's goals and preferences

Please be friendly, professional, and always prioritize the user's health and safety.
When giving advice, consider:
- The user's fitness goals
- Their dietary preferences
- Any health conditions they've mentioned
- Their available time for exercise

If you're unsure about something or if a question requires medical expertise, please advise the user to consult with a healthcare professional.`
}

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  if (req.method && req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  const { messages } = await req.json()
  if (!messages || !Array.isArray(messages)) {
    return new Response('Invalid messages', { status: 400 })
  }
  try {
    // Get user data
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    let finalSystemPrompt = systemPrompt
    
    if (session) {
      const { data: fitnessData } = await supabase
        .from("fitness_data")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      // Add user context to system prompt
      finalSystemPrompt = {
        role: "system",
        content: `${systemPrompt.content}

Current user data:
- Height: ${fitnessData?.height} cm
- Weight: ${fitnessData?.weight} kg
- Fitness Goal: ${fitnessData?.fitness_goal}
- Available Time: ${fitnessData?.available_time}
- Dietary Preferences: ${fitnessData?.dietary_preferences || "None specified"}

Please use this information to provide personalized advice.`
      }
    }

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [finalSystemPrompt, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    })
    console.log(response)
    const originalContent = response.choices?.[0]?.message?.content || ''
    let extractedContent = ''

    try {
      const parsed = JSON.parse(originalContent)
      extractedContent = parsed.content || ''
    } catch (e) {
      console.warn('Failed to parse inner content as JSON. Using raw content.')
      extractedContent = originalContent
    }

    return new Response(extractedContent, {
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (err: any) {
    console.error('Chatbot API error:', err)
    return new Response(JSON.stringify({ content: '[Error generating response]', error: String(err?.message || err) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}
