export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          email: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          email: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
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
          height: number
          weight: number
          fitness_goal: string
          timeframe: string
          available_time: string
          dietary_preferences: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          height: number
          weight: number
          fitness_goal: string
          timeframe: string
          available_time: string
          dietary_preferences?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          height?: number
          weight?: number
          fitness_goal?: string
          timeframe?: string
          available_time?: string
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
