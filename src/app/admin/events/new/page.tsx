'use client'

import { createEvent } from '@/app/actions/events'
import { useState } from 'react'

export default function NewEventPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await createEvent(formData)
    // Redirection is handled in the server action
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-base font-semibold leading-6 text-gray-900">Create New Event</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add an event to the Archipelago journey map.
      </p>

      <form action={handleSubmit} className="mt-6 space-y-8 bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
              Event Title
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="title"
                id="title"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
              Date & Time
            </label>
            <div className="mt-2">
              <input
                type="datetime-local"
                name="date"
                id="date"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="real_location" className="block text-sm font-medium leading-6 text-gray-900">
              Real World Location
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="real_location"
                id="real_location"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="journey_stage" className="block text-sm font-medium leading-6 text-gray-900">
              Island / Journey Stage
            </label>
            <div className="mt-2">
              <select
                id="journey_stage"
                name="journey_stage"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="welcome_shoals">Welcome Shoals</option>
                <option value="tinkers_reef">Tinker&apos;s Reef</option>
                <option value="great_atoll">Great Atoll</option>
                <option value="arena_island">Arena Island</option>
                <option value="hackers_hideaway">Hacker&apos;s Hideaway</option>
                <option value="summit_island">Summit Island</option>
                <option value="tech_lab">Tech Lab (Optional Branch)</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="journey_order" className="block text-sm font-medium leading-6 text-gray-900">
              Order within Stage
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="journey_order"
                id="journey_order"
                defaultValue={1}
                min={1}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="capacity" className="block text-sm font-medium leading-6 text-gray-900">
              Registration Capacity
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="capacity"
                id="capacity"
                defaultValue={50}
                min={1}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
              Status
            </label>
            <div className="mt-2">
              <select
                id="status"
                name="status"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
