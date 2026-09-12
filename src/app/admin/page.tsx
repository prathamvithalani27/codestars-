import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Calendar, CheckCircle, XCircle, ShieldAlert, ChevronRight, Target, Download, Settings, LayoutDashboard, Search, Clock } from 'lucide-react'
import { STAGES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Find the main event (Code UnCode 2026)
  const { data: mainEvent } = await supabase
    .from('events')
    .select('*')
    .ilike('title', '%Code UnCode%')
    .single()

  const targetEventId = mainEvent?.id || null
  const EVENT_CAPACITY = 100 // FIXED CAPACITY as requested

  // Fetch registrations for the main event
  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      id,
      status,
      current_stage,
      participant_status,
      created_at,
      profiles ( full_name, role )
    `)
    .eq('event_id', targetEventId)
    .order('created_at', { ascending: false })

  const registeredCount = registrations?.length || 0
  const activeCount = registrations?.filter(r => r.participant_status === 'ACTIVE').length || 0
  const failedCount = registrations?.filter(r => r.participant_status === 'FAILED').length || 0

  // Calculate stage counts
  const stageCounts: Record<string, number> = {}
  STAGES.forEach(s => stageCounts[s.dbId] = 0)
  
  registrations?.forEach(reg => {
    if (reg.current_stage && stageCounts[reg.current_stage] !== undefined) {
      stageCounts[reg.current_stage]++
    }
  })

  const recentRegs = registrations?.slice(0, 5) || []

  const stats = [
    { name: 'EVENT CAPACITY', stat: EVENT_CAPACITY, icon: ShieldAlert, color: 'from-blue-600 to-blue-900', border: 'border-blue-500/30' },
    { name: 'REGISTERED', stat: registeredCount, icon: Calendar, color: 'from-purple-600 to-purple-900', border: 'border-purple-500/30' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">DJS CODESTARS CONTROL CENTER</h1>
        <p className="mt-2 text-sm text-cyan-400 font-bold uppercase tracking-widest">CODE UNCODE 2026 Event Overview</p>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {stats.map((item) => (
          <div
            key={item.name}
            className={`relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl p-6 border ${item.border} shadow-[0_0_20px_rgba(0,0,0,0.3)] flex flex-col items-center text-center`}
          >
            <div className={`rounded-xl bg-gradient-to-br ${item.color} p-4 mb-4 shadow-lg inline-flex`}>
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-zinc-400 tracking-wider uppercase">{item.name}</p>
            <p className="mt-2 text-4xl font-black text-white">{item.stat}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Participant Progress & Recent */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Participant Progress */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="px-6 py-5 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold leading-6 text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={18} /> Participant Progress
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {STAGES.map((stage) => (
                <div key={stage.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-zinc-400 text-xs font-bold border border-white/5">
                      {stageCounts[stage.dbId] || 0}
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-wider">{stage.name}</span>
                  </div>
                  <div className="w-1/3 bg-white/5 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full rounded-full" 
                      style={{ width: `${registeredCount > 0 ? ((stageCounts[stage.dbId] || 0) / registeredCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Participants */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-base font-bold leading-6 text-white uppercase tracking-widest">Recent Participants</h3>
              <Link href="/admin/participants" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center transition-colors">
                View all <ChevronRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {recentRegs.map((reg) => {
                const profile = reg.profiles as unknown as { full_name: string } | null
                const stageName = STAGES.find(s => s.dbId === reg.current_stage)?.name || reg.current_stage
                return (
                  <div key={reg.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-white">{profile?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-cyan-400 mt-1 uppercase tracking-wider">{stageName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border ${
                        reg.participant_status === 'ACTIVE' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 
                        reg.participant_status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {reg.participant_status || 'UNKNOWN'}
                      </span>
                      <span className="text-xs text-zinc-500 hidden sm:block">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )
              })}
              {recentRegs.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-zinc-500">
                  No registered participants yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Link 
                href="/admin/participants" 
                className="w-full flex items-center gap-3 rounded-xl bg-blue-600/20 border border-blue-500/30 py-3 px-4 text-sm font-bold text-blue-400 hover:bg-blue-600/30 transition-all"
              >
                <Users size={18} /> Manage Participants
              </Link>
              
              <Link 
                href="/admin/participants" 
                className="w-full flex items-center gap-3 rounded-xl bg-green-600/20 border border-green-500/30 py-3 px-4 text-sm font-bold text-green-400 hover:bg-green-600/30 transition-all"
              >
                <Download size={18} /> Export Excel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
