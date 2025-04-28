import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Get the request body
    const body = await request.json()
    console.log('Received PUT request body:', body)
    
    const { planId, updatedPlan, is_active } = body

    // Validate required fields
    if (!planId) {
      console.error('Missing planId in request body')
      return NextResponse.json(
        { error: 'Missing required field: planId' },
        { status: 400 }
      )
    }

    // If is_active is provided, this is a deactivation request
    if (typeof is_active === 'boolean') {
      console.log('Deactivating plan:', { planId, is_active })
      const { error } = await supabase
        .from('nutrition_plan')
        .update({ is_active })
        .eq('id', planId)

      if (error) {
        console.error('Error deactivating nutrition plan:', error)
        return NextResponse.json(
          { error: 'Failed to deactivate nutrition plan' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    // Otherwise, this is a plan update request
    if (updatedPlan) {
      console.log('Updating plan content:', { planId, updatedPlan })
      const { error } = await supabase
        .from('nutrition_plan')
        .update({ plan_content: updatedPlan })
        .eq('id', planId)

      if (error) {
        console.error('Error updating nutrition plan:', error)
        return NextResponse.json(
          { error: 'Failed to update nutrition plan' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    console.error('Invalid request: missing required fields')
    return NextResponse.json(
      { error: 'Invalid request: missing required fields' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in nutrition plan update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Get the planId from the URL
    const url = new URL(request.url)
    const planId = url.searchParams.get('planId')

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // Delete the plan from the database
    const { error } = await supabase
      .from('nutrition_plan')
      .delete()
      .eq('id', planId)

    if (error) {
      console.error('Error deleting nutrition plan:', error)
      return NextResponse.json(
        { error: 'Failed to delete nutrition plan' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in nutrition plan deletion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 