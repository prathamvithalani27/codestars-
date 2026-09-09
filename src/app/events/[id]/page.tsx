import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import RegisterButton from './RegisterButton'

export default async function EventRegistrationPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Unauthenticated user -> redirect to login with this event as destination
    redirect(`/login?redirect=/events/${params.id}`)
  }

  // 2. Fetch Event details
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) {
    return <div className="p-8 text-center">Event not found.</div>
  }

  // 3. Check if user is already registered
  const { data: registration } = await supabase
    .from('registrations')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('event_id', event.id)
    .single()

  const isRegistered = registration?.status === 'registered'

  // 4. Check capacity limit
  const { count: currentRegistrations } = await supabase
    .from('registrations')
    .select('id', { count: 'exact' })
    .eq('event_id', event.id)
    .eq('status', 'registered')

  const isFull = (currentRegistrations || 0) >= event.capacity

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
          <ArrowLeft size={16} className="mr-2" />
          Back to Map
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 px-8 py-12 text-center relative">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold uppercase tracking-wider mb-4">
              {event.journey_stage.replace('_', ' ')}
            </span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{event.title}</h1>
          </div>
          
          <div className="px-8 py-10">
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              {event.description || 'No description available for this event.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="flex items-center text-gray-800">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4 text-blue-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Date & Time</div>
                  <div className="font-medium text-lg">{new Date(event.date).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex items-center text-gray-800">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mr-4 text-purple-600">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Availability</div>
                  <div className="font-medium text-lg">
                    {currentRegistrations || 0} / {event.capacity} Filled
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center text-gray-800">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-4 text-green-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Location</div>
                  <div className="font-medium text-lg">{event.real_location || 'To Be Announced'}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-4">
              <RegisterButton 
                eventId={event.id} 
                isRegistered={isRegistered} 
                isFull={isFull} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
