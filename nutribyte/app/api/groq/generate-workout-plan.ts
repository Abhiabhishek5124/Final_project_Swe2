import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

interface WorkoutExercise {
  name: string
  sets: number
  reps: string
  rest: string
  description: string
}

interface DailyWorkout {
  day: string
  focus: string
  duration: string
  exercises: WorkoutExercise[]
}

interface WorkoutPlan {
  level: "beginner" | "intermediate" | "expert"
  weeklySchedule: DailyWorkout[]
}

export async function generateWorkoutPlan(
  fitnessData: {
    fitness_goal: string
    available_time: string
    gender: string
  },
  fitnessLevel: "beginner" | "intermediate" | "expert"
): Promise<WorkoutPlan> {
  const systemPrompt = `You are a professional fitness trainer specializing in creating personalized workout plans.
Your task is to create a detailed weekly workout plan that:
1. Matches the user's fitness level and goals
2. Fits within their available time
3. Includes appropriate exercises with clear instructions
4. Provides a balanced full-body workout over the week
5. Includes appropriate rest periods between muscle groups

IMPORTANT: Your response must be a valid JSON object. Do not include any markdown formatting, code blocks, or additional text.
Just return the raw JSON object that matches the specified structure.`

  const userPrompt = `Create a personalized workout plan based on the following information:
    
Fitness Goal: ${fitnessData.fitness_goal}
Available Time: ${fitnessData.available_time}
Gender: ${fitnessData.gender}
Fitness Level: ${fitnessLevel}

Return ONLY a JSON object with this exact structure (no markdown, no code blocks, just the raw JSON):
{
  "level": "${fitnessLevel}",
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "Upper Body",
      "duration": "45-60 minutes",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "8-12",
          "rest": "60-90 seconds",
          "description": "Detailed instructions on how to perform the exercise"
        }
      ]
    }
  ]
}`

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 4000,
  })

  const response = completion.choices[0]?.message?.content
  if (!response) {
    throw new Error("Failed to generate workout plan")
  }

  try {
    // Remove any potential markdown code block markers
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim()
    return JSON.parse(cleanedResponse)
  } catch (error) {
    console.error("Error parsing workout plan:", error)
    throw new Error("Failed to parse workout plan response")
  }
} 