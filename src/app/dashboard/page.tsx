import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CancelButton from './CancelButton'
import { Calendar, CheckCircle, Clock, MapPin, Trophy, Cpu, Code, BookOpen, ChevronRight } from 'lucide-react'

// Helper for stage formatting
function formatStage(stageId: string) {
  const map: Record<string, string> = {
    'welcome_shoals': 'CodeStars Hub',
    'tinkers_reef': 'Practice Grove',
    'great_atoll': 'Mock Contest Arena',
    'arena_island': 'Code UnCode Qualifier',
    'hackers_hideaway': 'Regional Battleground',
    'summit_island': 'Grand Finale'
  }
  return map[stageId] || stageId.replace('_', ' ')
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch registrations with event details
  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      id,
      status,
      created_at,
      events (
        id,
        title,
        date,
        real_location,
        journey_stage
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Since Supabase returns an array for joins sometimes depending on schema, we cast it
  const activeRegistrations = registrations?.filter(r => r.status === 'registered') || []
  const pastRegistrations = registrations?.filter(r => r.status === 'cancelled') || []

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">
          WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">CODESTAR</span>
        </h1>
        <p className="text-lg text-zinc-400 font-medium">Your competitive programming journey continues.</p>
      </div>

      {/* CP Journey Visual Section */}
      <div>
        <h2 className="text-sm font-black tracking-[0.2em] text-cyan-400 uppercase mb-6 ml-2">Your CodeStars Journey</h2>
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-wrap items-center justify-between gap-4 md:gap-0 relative overflow-hidden shadow-inner">
          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Code size={18} />
            </div>
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Basics</span>
          </div>
          <ChevronRight className="text-zinc-600 flex-shrink-0 hidden md:block" size={16} />
          
          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <BookOpen size={18} />
            </div>
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Practice</span>
          </div>
          <ChevronRight className="text-zinc-600 flex-shrink-0 hidden md:block" size={16} />

          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Cpu size={18} />
            </div>
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Contests</span>
          </div>
          <ChevronRight className="text-zinc-600 flex-shrink-0 hidden md:block" size={16} />

          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Trophy size={18} />
            </div>
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Code UnCode</span>
          </div>
          <ChevronRight className="text-zinc-600 flex-shrink-0 hidden md:block" size={16} />

          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400 mb-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <MapPin size={18} />
            </div>
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Finals</span>
          </div>

          <div className="absolute left-10 right-10 top-[42px] h-px bg-white/5 hidden md:block" />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase mb-6 ml-2 flex items-center gap-3">
          <Calendar size={18} className="text-cyan-400" />
          My Registered Events
        </h2>
        
        {activeRegistrations.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Calendar className="text-zinc-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide">No Active Registrations</h3>
            <p className="text-zinc-400 mb-8 max-w-sm mx-auto font-medium">You haven't joined any competitive programming events yet. Start your journey today.</p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-black tracking-widest text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:from-cyan-400 hover:to-blue-500 transition-all uppercase">
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRegistrations.map((reg) => {
              const event = reg.events as unknown as { title: string; journey_stage: string; date: string; real_location: string }
              return (
                <div key={reg.id} className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-colors group shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/30">
                        <CheckCircle size={12} />
                        REGISTERED
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-4 leading-tight tracking-tight">{event.title}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-zinc-300 text-sm font-medium">
                        <Clock size={16} className="mr-3 text-cyan-400" />
                        {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center text-zinc-300 text-sm font-medium">
                        <MapPin size={16} className="mr-3 text-blue-400" />
                        {formatStage(event.journey_stage)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <CancelButton registrationId={reg.id} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {pastRegistrations.length > 0 && (
        <div className="mt-16">
          <h2 className="text-sm font-black tracking-[0.2em] text-zinc-500 uppercase mb-6 ml-2">Cancelled Registrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastRegistrations.map((reg) => {
              const event = reg.events as unknown as { title: string; date: string; journey_stage: string }
              return (
                <div key={reg.id} className="bg-black/20 border border-white/5 rounded-2xl p-5 opacity-60">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-bold text-sm line-through decoration-zinc-500">{event.title}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-white/5">
                      CANCELLED
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 font-medium flex items-center gap-2">
                    <Clock size={12} /> {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
