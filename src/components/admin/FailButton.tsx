'use client'

import { useState } from 'react'
import { XCircle, Loader2 } from 'lucide-react'
import { failParticipant } from '@/app/actions/participants'
import { ConfirmModal } from './ConfirmModal'

export function FailButton({ 
  registrationId, 
  participantName, 
  currentStageName, 
  disabled 
}: { 
  registrationId: string
  participantName: string
  currentStageName: string
  disabled: boolean
}) {
  const [isPending, setIsPending] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFail = async () => {
    setIsModalOpen(false)
    setIsPending(true)
    const res = await failParticipant(registrationId)
    if (res?.error) {
      alert(res.error) // Keep alert for actual errors
    }
    setIsPending(false)
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={disabled || isPending}
        className={`p-2 rounded-lg border transition-colors ${
          disabled
            ? 'border-zinc-700 text-zinc-600 cursor-not-allowed bg-black/20' 
            : 'border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400'
        }`}
        title="Mark as Failed"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        type="fail"
        title="Mark as Failed"
        message={
          <div className="space-y-4">
            <p className="text-zinc-300">Are you sure you want to mark this participant as failed? They will not be able to progress further in the event.</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Participant</span>
                <span className="text-white font-bold">{participantName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Current Stage</span>
                <span className="text-red-400 font-bold">{currentStageName}</span>
              </div>
            </div>
          </div>
        }
        confirmText="Mark Failed"
        onConfirm={handleFail}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}
