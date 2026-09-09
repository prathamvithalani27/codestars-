'use client'

import { useState } from 'react'
import { cancelRegistration } from '@/app/actions/registrations'

export default function CancelButton({ registrationId }: { registrationId: string }) {
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this registration?')) return
    
    setLoading(true)
    const result = await cancelRegistration(registrationId)
    if (result.error) {
      alert(result.error)
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleCancel}
      disabled={loading}
      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:text-red-400"
    >
      {loading ? 'Cancelling...' : 'Cancel Registration'}
    </button>
  )
}
