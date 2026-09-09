'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Save } from 'lucide-react'

export default function ProfileForm({ initialName }: { initialName: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)
    const result = await updateProfile(formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
          Full Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="full_name"
            id="full_name"
            defaultValue={initialName}
            required
            className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all sm:text-sm shadow-inner"
          />
        </div>
      </div>

      {message && (
        <div className={`text-sm font-medium p-4 rounded-xl border ${message.type === 'error' ? 'text-red-400 bg-red-900/20 border-red-500/30' : 'text-green-400 bg-green-900/20 border-green-500/30'}`}>
          {message.text}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-6 text-sm font-black tracking-widest text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#023e8a] disabled:opacity-50 transition-all uppercase"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
