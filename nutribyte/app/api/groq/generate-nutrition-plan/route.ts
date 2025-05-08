import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"

interface Meal {
  food_name: string
  type: string
  ingredients: string[]
  instructions: string
  calories: number
  protein: number
  carbs: number
  sugar: number
  other_nutrients: {
    fiber: number
    fat: number
    sodium: number
  }
}

export async function POST(req: Request) {
  try {
    const requestData = await req.json()
    console.log("Request Data:", requestData)

    const {
      fitness_goal,
      dietary_restrictions,
      dietary_preference,
      time_of_day,
      country_preference,
      additional_requirements,
    } = requestData

    // Validate required fields
    if (!fitness_goal || !time_of_day || !country_preference) {
      return NextResponse.json(
        { error: "Missing required fields: fitness_goal, time_of_day, or country_preference" },
        { status: 400 }
      )
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set")
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      )
    }

    console.log("Making request to Groq API...")

    const systemPrompt = `You are an expert nutritionist and chef. Create a detailed nutrition plan based on the user's fitness goals, dietary restrictions, and preferences. The plan should be personalized, practical, and include specific recipes and nutritional information.

IMPORTANT: Your response must be a valid JSON object. Do not include any markdown formatting, code blocks, or additional text. Just return the raw JSON object that matches the specified structure.

The response should be a single meal plan that matches the specified time of day (${time_of_day.join(", ")}).`

    const userPrompt = `Create a detailed nutrition plan for someone with the following fitness goal: ${fitness_goal}. They follow a ${dietary_preference} diet${dietary_restrictions?.length ? ` and have the following dietary restrictions: ${dietary_restrictions.join(", ")}` : ""}.

The plan should focus on ${country_preference} cuisine and include meals for the following times: ${time_of_day.join(", ")}.

${additional_requirements ? `Additional requirements: ${additional_requirements}` : ""}

For each meal, provide:
1. A specific recipe with ingredients and instructions
2. Nutritional information including calories, protein, carbs, sugar, and other key nutrients
3. Portion sizes appropriate for the user's goals

Return ONLY a JSON object with this exact structure (no markdown, no code blocks, just the raw JSON):
{
  "plan_summary": {
    "daily_calories": number,
    "daily_protein": number,
    "daily_carbs": number,
    "daily_fat": number,
    "notes": string
  },
  "meals": [
    {
      "food_name": string,
      "type": string,
      "ingredients": string[],
      "instructions": string,
      "calories": number,
      "protein": number,
      "carbs": number,
      "sugar": number,
      "other_nutrients": {
        "fiber": number,
        "fat": number,
        "sodium": number
      }
    }
  ]
}`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000,
    })

    console.log("Received response from Groq API")
    const response = completion.choices[0]?.message?.content

    if (!response) {
      console.error("No response content from Groq API")
      throw new Error("No response from Groq API")
    }

    // Clean the response
    let cleanedResponse = response
      .replace(/```json\n?|\n?```/g, "") // Remove markdown code blocks
      .replace(/```/g, "") // Remove any remaining backticks
      .trim()

    console.log("Cleaned Response:", cleanedResponse)

    // Try to find the first { and last } to extract just the JSON
    const firstBrace = cleanedResponse.indexOf("{")
    const lastBrace = cleanedResponse.lastIndexOf("}")
    
    if (firstBrace === -1 || lastBrace === -1) {
      console.error("Invalid response format - Raw response:", response)
      throw new Error("Invalid response format: Could not find JSON object")
    }

    cleanedResponse = cleanedResponse.slice(firstBrace, lastBrace + 1)

    try {
      const nutritionPlan = JSON.parse(cleanedResponse)
      
      // Validate the response structure
      if (!nutritionPlan.plan_summary || !nutritionPlan.meals || !Array.isArray(nutritionPlan.meals)) {
        console.error("Invalid response structure - Parsed response:", nutritionPlan)
        throw new Error("Invalid response structure: Missing required fields or invalid format")
      }

      // Validate each meal has required fields
      for (const meal of nutritionPlan.meals) {
        if (!meal.food_name || !meal.type || !meal.ingredients || !meal.instructions || 
            !meal.calories || !meal.protein || !meal.carbs || !meal.sugar || 
            !meal.other_nutrients || !meal.other_nutrients.fiber || 
            !meal.other_nutrients.fat || !meal.other_nutrients.sodium) {
          console.error("Invalid meal structure - Meal:", meal)
          throw new Error("Invalid meal structure: Missing required fields")
        }
      }

      return NextResponse.json(nutritionPlan)
    } catch (parseError: unknown) {
      console.error("Error parsing response:", parseError)
      console.error("Response content:", cleanedResponse)
      throw new Error(`Failed to parse nutrition plan response: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }
  } catch (error) {
    console.error("Error generating nutrition plan:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate nutrition plan" },
      { status: 500 }
    )
  }
} 