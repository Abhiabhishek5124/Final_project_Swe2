import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface FitnessData {
  height: number
  weight: number
  fitness_goal: string
  timeframe: string
  available_time: string
  dietary_preferences?: string
}

export async function generateAIPlan(fitnessData: FitnessData) {
  try {
    // Format the prompt with user data
    const prompt = `
      Generate a personalized nutrition and workout plan based on the following information:
      
      Height: ${fitnessData.height} cm
      Weight: ${fitnessData.weight} kg
      Fitness Goal: ${fitnessData.fitness_goal.replace("_", " ")}
      Timeframe: ${fitnessData.timeframe.replace("_", " ")}
      Available Time: ${fitnessData.available_time.replace("_", " ")}
      Dietary Preferences: ${fitnessData.dietary_preferences || "None specified"}
      
      Please provide:
      1. A detailed weekly nutrition plan with daily meals (breakfast, lunch, dinner, snacks)
      2. A workout plan that fits the available time and supports the fitness goal
      
      Format the response as a JSON object with two main keys: "nutritionPlan" and "workoutPlan".
    `

    // Generate the plan using OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Parse the response as JSON
    const planData = JSON.parse(text)

    return {
      nutritionPlan: planData.nutritionPlan,
      workoutPlan: planData.workoutPlan,
    }
  } catch (error) {
    console.error("Error generating AI plan:", error)

    // Return a fallback plan in case of error
    return {
      nutritionPlan: {
        breakfast: "2 eggs, whole wheat toast, avocado, and a side of fruit.",
        lunch: "Grilled chicken salad with mixed greens, vegetables, and olive oil dressing.",
        dinner: "Baked salmon with quinoa and steamed vegetables.",
        snacks: "Greek yogurt with berries, handful of nuts, protein shake after workout.",
      },
      workoutPlan: {
        description: "Focus on compound movements with moderate weights and controlled form.",
        exercises: [
          { name: "Bench Press", sets: "3", reps: "8-10", rest: "90 sec" },
          { name: "Shoulder Press", sets: "3", reps: "10-12", rest: "60 sec" },
          { name: "Tricep Pushdowns", sets: "3", reps: "12-15", rest: "60 sec" },
          { name: "Lat Pulldowns", sets: "3", reps: "10-12", rest: "60 sec" },
          { name: "Bicep Curls", sets: "3", reps: "12-15", rest: "60 sec" },
        ],
      },
    }
  }
}
