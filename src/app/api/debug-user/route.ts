import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const email = 'pratham.vithalani27@gmail.com'
  
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users?.users.find(u => u.email === email)
  
  if (!user) {
    return NextResponse.json({ error: 'User not found in auth.users' })
  }
  
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: regs } = await supabase.from('registrations').select('*').eq('user_id', user.id)
  
  return NextResponse.json({
    userId: user.id,
    profile,
    registrations: regs
  })
}
