import { createClient } from '@/lib/supabase/server'
import { STAGES } from '@/lib/constants'
import { PromoteButton } from '@/components/admin/PromoteButton'
import { FailButton } from '@/components/admin/FailButton'
import { ExportExcelButton } from '@/components/admin/ExportExcelButton'
import { Search, Filter, Target } from 'lucide-react'

// Opt out of caching
export const dynamic = 'force-dynamic'

export default async function ParticipantsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const sp = await searchParams
  const searchQuery = typeof sp.search === 'string' ? sp.search.toLowerCase() : ''
  const statusFilter = typeof sp.status === 'string' ? sp.status : 'ALL'
  const stageFilter = typeof sp.stage === 'string' ? sp.stage : 'ALL'

  // Fetch registrations
  const { data: rawRegistrations } = await supabase
    .from('registrations')
    .select(`
      id,
      status,
      current_stage,
      participant_status,
      created_at,
      profiles ( full_name, phone, college, year, branch, role )
    `)
    .order('created_at', { ascending: false })

  // Transform and filter
  let participants = rawRegistrations?.map(reg => {
    const profile = reg.profiles as any
    const stageIndex = STAGES.findIndex(s => s.dbId === reg.current_stage)
    const stageName = stageIndex !== -1 ? STAGES[stageIndex].name : reg.current_stage
    const nextStageName = stageIndex !== -1 && stageIndex < STAGES.length - 1 ? STAGES[stageIndex + 1].name : null

    return {
      registrationId: reg.id,
      name: profile?.full_name || 'Unknown',
      email: profile?.email || 'N/A', // Assuming email might be added to profiles, but it's usually in auth.users. Wait, auth.users email is not in profiles.
      phone: profile?.phone || 'N/A',
      college: profile?.college || 'N/A',
      year: profile?.year || 'N/A',
      branch: profile?.branch || 'N/A',
      role: profile?.role || 'student',
      currentStageDbId: reg.current_stage,
      currentStageName: stageName,
      nextStageName,
      status: reg.participant_status || 'UNKNOWN',
      registeredOn: new Date(reg.created_at).toLocaleDateString(),
      rawDate: new Date(reg.created_at)
    }
  }) || []

  // Allow all registered users to show up in the dashboard, even admins testing the flow.

  // Search Filter
  if (searchQuery) {
    participants = participants.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery) ||
      p.phone.toLowerCase().includes(searchQuery) ||
      p.college.toLowerCase().includes(searchQuery)
    )
  }

  // Status Filter
  if (statusFilter !== 'ALL') {
    participants = participants.filter(p => p.status === statusFilter)
  }

  // Stage Filter
  if (stageFilter !== 'ALL') {
    participants = participants.filter(p => p.currentStageDbId === stageFilter)
  }

  // Prepare Export Data
  const exportData = participants.map(p => ({
    'Participant Name': p.name,
    'Email': p.email,
    'Phone Number': p.phone,
    'College': p.college,
    'Year': p.year,
    'Branch': p.branch,
    'Registration Status': p.status,
    'Current Stage': p.currentStageName,
    'Registered On': p.registeredOn,
    'Role': p.role
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">PARTICIPANTS</h1>
          <p className="mt-2 text-sm text-cyan-400 font-bold uppercase tracking-widest">Code UnCode 2026</p>
        </div>
        
        <ExportExcelButton data={exportData} />
      </div>

      {/* Filters Area */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row gap-4">
        <form className="flex-1 flex flex-col md:flex-row gap-4 w-full">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input 
              type="text" 
              name="search"
              defaultValue={searchQuery}
              placeholder="Search by name, phone, college..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <select 
              name="status" 
              defaultValue={statusFilter}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-white appearance-none focus:outline-none focus:border-cyan-500/50 [&>option]:bg-[#001530]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="FAILED">FAILED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div className="relative md:w-64">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <select 
              name="stage" 
              defaultValue={stageFilter}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-white appearance-none focus:outline-none focus:border-cyan-500/50 [&>option]:bg-[#001530]"
            >
              <option value="ALL">All Stages</option>
              {STAGES.map(s => (
                <option key={s.dbId} value={s.dbId}>{s.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/10">
            Apply
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)] overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-black uppercase tracking-widest text-zinc-400">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest text-zinc-400 hidden lg:table-cell">College</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest text-zinc-400">Current Stage</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest text-zinc-400">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest text-zinc-400 hidden sm:table-cell">Registered</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right text-xs font-black uppercase tracking-widest text-zinc-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {participants.map((p) => (
              <tr key={p.registrationId} className="hover:bg-white/5 transition-colors group">
                <td className="whitespace-nowrap py-4 pl-6 pr-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{p.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 hidden lg:table-cell">
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-300">{p.college}</span>
                    <span className="text-xs text-zinc-500">{p.year !== 'N/A' ? p.year : ''} {p.branch !== 'N/A' ? `- ${p.branch}` : ''}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{p.currentStageName}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border ${
                    p.status === 'ACTIVE' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 
                    p.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 hidden sm:table-cell text-sm text-zinc-400">
                  {p.registeredOn}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right font-medium">
                  <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    <PromoteButton 
                      registrationId={p.registrationId} 
                      participantName={p.name}
                      currentStageName={p.currentStageName}
                      nextStageName={p.nextStageName}
                      disabled={p.status !== 'ACTIVE'} 
                    />
                    
                    <FailButton 
                      registrationId={p.registrationId}
                      participantName={p.name}
                      currentStageName={p.currentStageName}
                      disabled={p.status === 'FAILED'}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {participants.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-zinc-500">
                  No participants found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
