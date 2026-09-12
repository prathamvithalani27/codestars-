'use client'

import { useState } from 'react'
import { updateEvent } from '@/app/actions/events'
import { Calendar, MapPin, Users, Settings } from 'lucide-react'

export default function EventEditForm({ event }: { event: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    // Add existing hidden fields not in the form but required by the action
    formData.append('journey_stage', event.journey_stage)
    formData.append('journey_order', event.journey_order.toString())

    const result = await updateEvent(event.id, formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  // Format date for datetime-local input
  const formattedDate = new Date(event.date).toISOString().slice(0, 16)

  return (
    <form action={handleSubmit} className="mt-8 space-y-8 bg-black/40 backdrop-blur-xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] rounded-2xl border border-white/10">
      
      {error && (
        <div className="text-red-400 bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-400 bg-green-900/30 border border-green-500/50 rounded-lg p-4 text-sm font-medium">
          Event updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="title" className="block text-sm font-bold text-white uppercase tracking-widest">
            Event Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="title"
              id="title"
              required
              defaultValue={event.title}
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-zinc-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="description" className="block text-sm font-bold text-white uppercase tracking-widest">
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={event.description}
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-zinc-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="date" className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
            <Calendar size={16} className="text-cyan-400" /> Date & Time
          </label>
          <div className="mt-2">
            <input
              type="datetime-local"
              name="date"
              id="date"
              required
              defaultValue={formattedDate}
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="real_location" className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
            <MapPin size={16} className="text-cyan-400" /> Location
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="real_location"
              id="real_location"
              defaultValue={event.real_location}
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="capacity" className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
            <Users size={16} className="text-cyan-400" /> Capacity
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="capacity"
              id="capacity"
              min={1}
              required
              defaultValue={event.capacity}
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="status" className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-widest">
            <Settings size={16} className="text-cyan-400" /> Status
          </label>
          <div className="mt-2">
            <select
              id="status"
              name="status"
              required
              defaultValue={event.status}
              className="block w-full rounded-xl border border-white/10 bg-zinc-900 py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm"
            >
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Open)</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-x-4 border-t border-white/10 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:from-cyan-400 hover:to-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:opacity-50 transition-all"
        >
          {loading ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  )
}
