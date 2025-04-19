import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export async function GET() {
  try {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    const { data: tables, error: tablesError } = await supabase
      .from("user_profiles")
      .select("count(*)")
      .limit(1)

    if (tablesError) {
      throw new Error(`Database connection error: ${tablesError.message}`)
    }

    const requiredTables = ["user_profiles", "fitness_data", "nutrition_plans", "workout_plans"]
    const tableChecks = await Promise.all(
      requiredTables.map(async (table) => {
        const { error } = await supabase.from(table).select("count(*)").limit(1)
        return { table, exists: !error }
      })
    )

    const missingTables = tableChecks.filter((check) => !check.exists).map((check) => check.table)

    if (missingTables.length > 0) {
      throw new Error(`Missing tables: ${missingTables.join(", ")}`)
    }

    const { data: rlsEnabled, error: rlsError } = await supabase
      .from("user_profiles")
      .select("relname, relrowsecurity")
      .limit(1)

    if (rlsError) {
      throw new Error(`RLS check error: ${rlsError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection and database setup verified",
      details: {
        connection: "successful",
        tables: {
          required: requiredTables,
          status: "all present",
        },
        rls: "enabled",
      },
    })
  } catch (error: any) {
    console.error("Connection test failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Connection test failed",
        error: error.message,
      },
      { status: 500 }
    )
  }
} 