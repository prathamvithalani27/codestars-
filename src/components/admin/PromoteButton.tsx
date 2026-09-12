'use client'

import { useState } from 'react'
import { ArrowUpCircle, Loader2 } from 'lucide-react'
import { promoteParticipant } from '@/app/actions/participants'
import { ConfirmModal } from './ConfirmModal'

export function PromoteButton({ 
  registrationId, 
  participantName, 
  currentStageName, 
  nextStageName, 
  disabled 
}: { 
  registrationId: string
  participantName: string
  currentStageName: string
  nextStageName: string | null
  disabled: boolean
}) {
  const [isPending, setIsPending] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePromote = async () => {
    setIsModalOpen(false)
    setIsPending(true)
    const res = await promoteParticipant(registrationId)
    if (res?.error) {
      alert(res.error) // Keep alert for actual errors for now, or use toast
    }
    setIsPending(false)
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={disabled || isPending || !nextStageName}
        className={`p-2 rounded-lg border transition-colors ${
          disabled || !nextStageName
            ? 'border-zinc-700 text-zinc-600 cursor-not-allowed bg-black/20' 
            : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400'
        }`}
        title="Promote to Next Stage"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpCircle size={16} />}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        type="promote"
        title="Promote Participant"
        message={
          <div className="space-y-4">
            <p>Are you sure you want to promote this participant?</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Participant</span>
                <span className="text-white font-bold">{participantName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">From</span>
                <span className="text-zinc-300">{currentStageName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">To</span>
                <span className="text-cyan-400 font-bold">{nextStageName}</span>
              </div>
            </div>
          </div>
        }
        confirmText="Promote"
        onConfirm={handlePromote}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}
