import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export async function getUserProfile(supabase: SupabaseClient<Database>, userId: string) {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}
