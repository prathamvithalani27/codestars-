import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Get the current logged in user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not logged in' })
  }

  // Fetch the profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    user_id: user.id,
    user_email: user.email,
    profile_data_found: profile,
    profile_error: error,
    role_evaluated_as: profile?.role || 'student'
  })
}
