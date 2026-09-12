'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  // Note: We use type assertions for simplicity. In production, consider Zod validation.
  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
    real_location: formData.get('real_location') as string,
    journey_stage: formData.get('journey_stage') as string,
    journey_order: parseInt(formData.get('journey_order') as string, 10),
    capacity: parseInt(formData.get('capacity') as string, 10),
    status: formData.get('status') as 'draft' | 'published' | 'completed',
  }

  const { error } = await supabase.from('events').insert([data])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/events')
  revalidatePath('/admin/stages')
  revalidatePath('/admin/event')
  revalidatePath('/')
  redirect('/admin/stages')
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
    real_location: formData.get('real_location') as string,
    journey_stage: formData.get('journey_stage') as string,
    journey_order: parseInt(formData.get('journey_order') as string, 10),
    capacity: parseInt(formData.get('capacity') as string, 10),
    status: formData.get('status') as 'draft' | 'published' | 'completed',
  }

  const { error } = await supabase.from('events').update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/stages')
  revalidatePath('/admin/event')
  revalidatePath('/')
  return { success: true }
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('events').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/events')
  revalidatePath('/')
}
