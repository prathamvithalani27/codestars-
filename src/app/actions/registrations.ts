'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function registerForEvent(eventId: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'You must be logged in to register.' }
  }

  // Call the custom Postgres function to safely register and check capacity
  const { error } = await supabase.rpc('register_for_event', {
    p_event_id: eventId,
    p_user_id: user.id
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/admin/registrations')
  revalidatePath(`/events/${eventId}`)
  
  return { success: true }
}

export async function cancelRegistration(registrationId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if it belongs to user (RLS will also protect this, but it's good to be safe)
  const { error } = await supabase
    .from('registrations')
    .update({ status: 'cancelled' })
    .eq('id', registrationId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/admin/registrations')
  
  return { success: true }
}
