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
  fitnessLevel: "beginner" | "intermediate" | "expert",
  description?: string
): Promise<WorkoutPlan> {
  const systemPrompt = `You are a professional fitness trainer specializing in creating personalized workout plans.
Your task is to create a detailed weekly workout plan that:

1. Workout Frequency and Split (based on available time):
   IMPORTANT: The number of workout days MUST match the frequency mentioned in available_time.
   Examples:
   - If available_time says "3x per week": Create exactly 3 workout days (e.g., Monday, Wednesday, Friday)
   - If available_time says "4x per week": Create exactly 4 workout days (e.g., Monday, Tuesday, Thursday, Friday)
   - If available_time says "5x per week": Create exactly 5 workout days (e.g., Monday, Tuesday, Wednesday, Friday, Saturday)
   - If available_time says "6x per week": Create exactly 6 workout days (e.g., Monday-Friday, Saturday)
   - If available_time says "7x per week": Create exactly 7 workout days

2. Exercise Parameters Based on Available Time and Fitness Level:
   IMPORTANT: Vary the sets, reps, and rest periods based on both fitness level and available time.
   
   Beginner:
   - 30 minutes: 3 exercises, 2 sets, 12-15 reps, 90s rest
   - 1 hour: 5 exercises, 2-3 sets, 12-15 reps, 90s rest
   - 1.5 hours: 6 exercises, 3 sets, 12-15 reps, 90s rest
   - 2 hours: 7 exercises, 3 sets, 12-15 reps, 90s rest
   
   Intermediate:
   - 30 minutes: 3 exercises, 3-4 sets, 8-12 reps, 60s rest
   - 1 hour: 5 exercises, 3-4 sets, 8-12 reps, 60s rest
   - 1.5 hours: 6 exercises, 3-4 sets, 8-12 reps, 60s rest
   - 2 hours: 7 exercises, 3-4 sets, 8-12 reps, 60s rest
   
   Expert:
   - 30 minutes: 3 exercises, 4-5 sets, 6-10 reps, 45s rest
   - 1 hour: 5 exercises, 4-5 sets, 6-10 reps, 45s rest
   - 1.5 hours: 6 exercises, 4-5 sets, 6-10 reps, 45s rest
   - 2 hours: 7 exercises, 4-5 sets, 6-10 reps, 45s rest

3. Exercise Selection Based on Fitness Level:
   Beginner:
   - Focus on basic movements and proper form
   - Use bodyweight or light weights
   - Include more rest time between sets
   - Provide detailed form instructions
   - Avoid complex or high-risk exercises
   - Start with 2 sets and gradually increase
   - Use higher rep ranges (12-15) for better form practice
   - Include longer rest periods for recovery

   Intermediate:
   - Include compound movements
   - Use moderate weights
   - Mix of basic and advanced exercises
   - Standard rest periods
   - Focus on progressive overload
   - Use 3-4 sets for optimal volume
   - Target rep ranges of 8-12 for hypertrophy
   - Include some advanced techniques

   Expert:
   - Include advanced techniques
   - Use challenging weights
   - Complex movements and combinations
   - Shorter rest periods
   - Focus on intensity and volume
   - Use 4-5 sets for maximum volume
   - Vary rep ranges (6-10) for different goals
   - Include advanced training techniques

4. Additional Considerations:
   - If user mentions injuries/limitations: Avoid aggravating exercises and provide alternatives
   - If user mentions equipment preferences: Focus on exercises using available equipment
   - If user mentions specific focus areas: Prioritize exercises targeting those areas
   - If user mentions previous experience: Consider their background in exercise selection

IMPORTANT: Your response must be a valid JSON object. Do not include any markdown formatting, code blocks, or additional text.
Just return the raw JSON object that matches the specified structure.`

  const userPrompt = `Create a personalized workout plan based on the following information:
    
Fitness Goal: ${fitnessData.fitness_goal}
Available Time: ${fitnessData.available_time}
Gender: ${fitnessData.gender}
Fitness Level: ${fitnessLevel}
${description ? `Additional Information: ${description}` : ''}

IMPORTANT INSTRUCTIONS:
1. The number of workout days MUST exactly match the frequency in available_time (e.g., if "3x per week", create exactly 3 workout days)
2. For each exercise, follow these exact parameters based on fitness level and available time:
   - Beginner: 2-3 sets, 12-15 reps, 90s rest
   - Intermediate: 3-4 sets, 8-12 reps, 60s rest
   - Expert: 4-5 sets, 6-10 reps, 60s rest
3. Number of exercises per session must match available time:
   - 30 minutes: 3-4 exercises
   - 1 hour: 5-7 exercises
   - 1.5 hours: 6-8 exercises
   - 2 hours: 7-9 exercises

Return ONLY a JSON object with this exact structure (no markdown, no code blocks, just the raw JSON):
{
  "level": "${fitnessLevel}",
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "Chest/Triceps",
      "duration": "45-60 minutes",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "8-12",
          "rest": "60-90 seconds",
          "description": "Detailed instructions on how to perform the exercise",
          "muscleGroups": ["Chest", "Shoulders", "Triceps"]
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
    max_tokens: 6000,
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