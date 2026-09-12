'use client'

import { useState } from 'react'
import { registerForEvent } from '@/app/actions/registrations'
import { useRouter } from 'next/navigation'

export default function RegisterButton({ eventId, isRegistered, isFull }: { eventId: string, isRegistered: boolean, isFull: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    const result = await registerForEvent(eventId)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  if (isRegistered) {
    return (
      <button disabled className="w-full py-4 bg-[#004d2a] text-[#00e676] rounded-full font-black tracking-widest uppercase text-xs border border-[#00e676]/30 cursor-not-allowed shadow-[0_0_15px_rgba(0,230,118,0.2)]">
        Registration Confirmed
      </button>
    )
  }

  if (isFull) {
    return (
      <button disabled className="w-full py-4 bg-red-900/50 text-red-400 rounded-full font-black tracking-widest uppercase text-xs border border-red-500/30 cursor-not-allowed shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        Capacity Reached
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-400 text-center font-bold text-sm bg-red-900/20 py-2 rounded-lg border border-red-500/30">{error}</div>}
      <button 
        onClick={handleRegister}
        disabled={loading}
        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-[#001530] rounded-full font-black text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,168,232,0.6)] disabled:bg-cyan-900 disabled:text-cyan-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Confirm Registration'}
      </button>
    </div>
  )
}
