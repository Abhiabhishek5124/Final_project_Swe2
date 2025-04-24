export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          avatar_url?: string | null
        }
      }
      fitness_data: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          age: number
          gender: string
          height_inches: number
          weight: number
          fitness_goal: string
          available_time: string
          dietary_restrictions: string | null
          dietary_preferences: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          age: number
          gender: string
          height_inches: number
          weight: number
          fitness_goal: string
          available_time: string
          dietary_restrictions?: string | null
          dietary_preferences?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          age?: number
          gender?: string
          height_inches?: number
          weight?: number
          fitness_goal?: string
          available_time?: string
          dietary_restrictions?: string | null
          dietary_preferences?: string | null
        }
      }
      nutrition_plans: {
        Row: {
          id: string
          user_id: string
          fitness_data_id: string
          created_at: string
          updated_at: string
          plan_content: Json
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          fitness_data_id: string
          created_at?: string
          updated_at?: string
          plan_content: Json
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          fitness_data_id?: string
          created_at?: string
          updated_at?: string
          plan_content?: Json
          is_active?: boolean
        }
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          fitness_data_id: string
          created_at: string
          updated_at: string
          plan_content: Json
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          fitness_data_id: string
          created_at?: string
          updated_at?: string
          plan_content: Json
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          fitness_data_id?: string
          created_at?: string
          updated_at?: string
          plan_content?: Json
          is_active?: boolean
        }
      }
    }
  }
}
