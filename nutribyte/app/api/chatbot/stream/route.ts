import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

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
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      
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
