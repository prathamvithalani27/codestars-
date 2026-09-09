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
      <button disabled className="w-full py-4 bg-green-100 text-green-800 rounded-xl font-bold text-lg cursor-not-allowed">
        Already Registered
      </button>
    )
  }

  if (isFull) {
    return (
      <button disabled className="w-full py-4 bg-red-100 text-red-800 rounded-xl font-bold text-lg cursor-not-allowed">
        Event is Full
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 text-center font-medium">{error}</div>}
      <button 
        onClick={handleRegister}
        disabled={loading}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg disabled:bg-blue-400"
      >
        {loading ? 'Registering...' : 'Confirm Registration'}
      </button>
    </div>
  )
}
