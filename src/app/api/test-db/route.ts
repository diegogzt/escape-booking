import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test database connection
    const { data: organizations, error } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .limit(5)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      organizations: organizations || [],
      count: organizations?.length || 0
    })
  } catch (error) {
    console.error('Connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to database' 
    }, { status: 500 })
  }
}
