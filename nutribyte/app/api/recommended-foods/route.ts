import Groq from "groq-sdk"
import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const systemPrompt = {
  role: "system" as const,
  content: `You are a nutrition expert providing personalized food recommendations. You have access to the user's fitness data and can provide tailored meal suggestions.

Your recommendations should:
- Consider the user's fitness goals and dietary preferences
- Include accurate nutritional information
- Suggest appropriate meal times
- Highlight key health benefits
- Be realistic and practical

Format your response as a JSON object with an array of recommendations. Do not include any markdown formatting or code blocks.`
}

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("id", session.user.id)
      .single()

    const { data: fitnessData } = await supabase
      .from("fitness_data")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    const prompt = `Based on the following user profile, suggest 3 personalized food recommendations in JSON format. Each recommendation should include name, calories, protein, carbs, fat, benefits (array of strings), and time of day (Breakfast/Lunch/Dinner/Snack).

User Profile:
- Name: ${userProfile?.first_name} ${userProfile?.last_name}
- Age: ${fitnessData?.age || "Not specified"}
- Gender: ${fitnessData?.gender || "Not specified"}
- Height: ${fitnessData?.height_inches || "Not specified"} inches
- Weight: ${fitnessData?.weight || "Not specified"} kg
- Fitness Goal: ${fitnessData?.fitness_goal || "Not specified"}
- Available Time: ${fitnessData?.available_time || "Not specified"}
- Dietary Preferences: ${fitnessData?.dietary_preferences || "None specified"}
- Dietary Restrictions: ${fitnessData?.dietary_restrictions || "None specified"}

Return the response in this exact JSON format:
{
  "recommendations": [
    {
      "name": "string",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "benefits": ["string"],
      "time": "string"
    }
  ]
}

IMPORTANT: Return only the JSON object, without any markdown formatting or code blocks.`

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        systemPrompt,
        {
          role: "user" as const,
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    })

    const content = response.choices[0]?.message?.content || ''
    // Clean any potential markdown formatting
    const cleanContent = content.replace(/```json\n|\n```/g, '').trim()
    const parsedResponse = JSON.parse(cleanContent)

    return new Response(JSON.stringify(parsedResponse), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Recommended foods API error:', err)
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
} 