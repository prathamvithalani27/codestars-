import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import RegisterButton from './RegisterButton'

export default async function EventRegistrationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const eventId = params.id

  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Unauthenticated user -> redirect to login with this event as destination
    redirect(`/login?redirect=/events/${eventId}`)
  }

  // 2. Fetch Event details
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error || !event) {
    return <div className="p-8 text-center">Event not found. Debug info: {error?.message || 'No error, event is just null'}</div>
  }

  // 3. Check if user is already registered
  const { data: registration } = await supabase
    .from('registrations')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('event_id', event.id)
    .single()

  const isRegistered = registration?.status === 'registered'

  // 4. Check capacity limit (uses SECURITY DEFINER function to bypass RLS)
  const { data: countResult } = await supabase
    .rpc('get_event_registration_count', { p_event_id: event.id })

  const currentRegistrations = countResult || 0
  const isFull = currentRegistrations >= event.capacity

  return (
    <div className="min-h-screen bg-[#023e8a] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background layer matching participant dashboard */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#00b4d8] via-[#0077b6] to-[#03045e] pointer-events-none" />
      <div className="fixed inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <Link href="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 font-bold tracking-widest uppercase text-xs transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden border border-cyan-500/20">
          <div className="bg-gradient-to-r from-[#00183b] to-[#002f6c] px-8 py-16 text-center relative overflow-hidden border-b border-cyan-500/20">
            {/* Background Accent */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent" />
            
            <span className="relative z-10 inline-block px-4 py-1.5 bg-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,168,232,0.3)]">
              {event.journey_stage.replace('_', ' ')}
            </span>
            <h1 className="relative z-10 text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">{event.title}</h1>
          </div>
          
          <div className="px-8 py-10">
            <p className="text-zinc-300 text-base md:text-lg mb-10 leading-relaxed font-medium">
              {event.description || 'No description available for this event.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mr-4 border border-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(0,168,232,0.2)]">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Date & Time</div>
                  <div className="font-bold text-white text-lg">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="flex items-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mr-4 border border-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Availability</div>
                  <div className="font-bold text-white text-lg">
                    <span className="text-purple-400">{currentRegistrations || 0}</span> / {event.capacity} Filled
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mr-4 border border-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Location</div>
                  <div className="font-bold text-white text-lg uppercase tracking-wide">{event.real_location || 'To Be Announced'}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
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
