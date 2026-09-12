'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { STAGES } from '@/lib/constants'

export async function promoteParticipant(registrationId: string) {
  const supabase = await createClient()

  const { data: registration, error: fetchError } = await supabase
    .from('registrations')
    .select('current_stage, participant_status')
    .eq('id', registrationId)
    .single()

  if (fetchError || !registration) {
    return { error: 'Participant not found.' }
  }

  if (registration.participant_status === 'FAILED') {
    return { error: 'Cannot promote a failed participant.' }
  }

  const currentIndex = STAGES.findIndex(s => s.dbId === registration.current_stage)
  
  if (currentIndex === -1 || currentIndex === STAGES.length - 1) {
    return { error: 'Participant is already at the final stage or stage invalid.' }
  }

  const nextStage = STAGES[currentIndex + 1].dbId
  const newStatus = (currentIndex + 1 === STAGES.length - 1) ? 'COMPLETED' : 'ACTIVE'

  const { error: updateError } = await supabase
    .from('registrations')
    .update({ 
      current_stage: nextStage,
      participant_status: newStatus
    })
    .eq('id', registrationId)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/participants')
  return { success: true, nextStage: STAGES[currentIndex + 1].name }
}

export async function failParticipant(registrationId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('registrations')
    .update({ participant_status: 'FAILED' })
    .eq('id', registrationId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/participants')
  return { success: true }
}
