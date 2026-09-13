import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, XCircle, Calendar, FileText, Lock, MapPin, ArrowRight } from 'lucide-react'
import { STAGES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all in parallel for performance
  const [
    { data: profile },
    { data: allEvents, error: eventsError },
    { data: registrations }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('events').select('*').order('date', { ascending: true }),
    supabase.from('registrations').select('*, events(*)').eq('user_id', user.id)
  ])

  const isRegistered = registrations && registrations.length > 0
  const mainRegistration = registrations?.[0]
  const event = mainRegistration?.events || allEvents?.[0]

  // Determine current stage index based on DB
  let currentStageIndex = 0
  if (mainRegistration?.current_stage) {
    const idx = STAGES.findIndex(s => s.dbId === mainRegistration.current_stage)
    if (idx !== -1) currentStageIndex = idx
  }

  const isFailed = mainRegistration?.participant_status === 'FAILED'
  const isCompleted = mainRegistration?.participant_status === 'COMPLETED'
  const nextStage = STAGES[Math.min(currentStageIndex + (isFailed || isCompleted ? 0 : 1), STAGES.length - 1)]
  const currentStage = STAGES[currentStageIndex]

  return (
    <div className="w-full pb-20 space-y-6 text-white font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="w-full bg-gradient-to-r from-[#00183b] to-[#002f6c] rounded-[2rem] border border-cyan-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row min-h-[360px]">
        {/* Right Island Visual with smooth blend mask */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[60%] lg:w-[50%] h-full pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_10%,black_60%)] md:[mask-image:linear-gradient(to_right,transparent_10%,black_50%)]">
          <Image 
            src="/images/map/hero_island_custom.png" 
            alt="Code UnCode Island" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center md:object-right"
            priority
          />
          <div className="absolute inset-0 bg-[#00183b]/10 mix-blend-overlay" />
        </div>
        


        {/* Hero Content Left */}
        <div className="relative z-20 p-8 md:p-14 flex flex-col justify-center w-full md:w-[65%]">
          <h1 className="text-xs md:text-sm font-black text-cyan-400 tracking-[0.2em] uppercase mb-2">
            WELCOME BACK,
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-3">
            {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Participant'}
          </h2>
          <p className="text-zinc-300 font-medium tracking-wide text-sm md:text-lg mb-6">Your Code UnCode journey continues.</p>
          
          <div className="pt-6">
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">CODE UNCODE <span className="text-cyan-400">2026</span></h3>
            <p className="text-zinc-400 font-medium mb-6 text-sm md:text-base">Competitive Programming Competition</p>
            
            <div className="inline-flex">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border shadow-[0_0_15px_rgba(0,0,0,0.2)] ${
                !isRegistered ? 'bg-orange-900/50 text-orange-400 border-orange-500/30' :
                isFailed ? 'bg-[#4d0000] text-[#ff4d4d] border-[#ff4d4d]/30' : 
                isCompleted ? 'bg-cyan-900/50 text-cyan-400 border-cyan-500/30' :
                'bg-[#004d2a] text-[#00e676] border-[#00e676]/30'
              }`}>
                {!isRegistered ? <ArrowRight size={16} /> : isFailed ? <XCircle size={16} /> : <CheckCircle size={16} />}
                {!isRegistered ? 'ACTION REQUIRED: REGISTER NOW' : isFailed ? 'COMPETITION ENDED' : isCompleted ? 'COMPETITION COMPLETED' : 'REGISTRATION CONFIRMED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. JOURNEY SECTION */}
      <div className="w-full bg-[#001f54]/50 backdrop-blur-md rounded-[2rem] border border-cyan-500/20 p-8 shadow-xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-lg font-black tracking-widest uppercase flex items-center gap-3 text-cyan-400">
            <MapPin size={20} />
            YOUR CODE UNCODE JOURNEY
          </h2>
          <span className="hidden md:block text-xs font-medium text-zinc-400">Follow the path. Conquer the island.</span>
        </div>
        
        <div className="relative">
          {/* Connecting Line background */}
          <div className="absolute top-12 left-0 w-full h-[2px] border-t-2 border-dashed border-cyan-500/30 -z-10 hidden md:block"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex
              const isCurrent = idx === currentStageIndex
              const isFuture = idx > currentStageIndex
              
              return (
                <div key={idx} className={`flex flex-col items-center text-center ${isFuture || isFailed ? 'opacity-50 grayscale' : ''}`}>
                  <div className="relative w-24 h-24 mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    <Image src={stage.image} alt={stage.name} fill sizes="96px" className="object-contain" />
                    
                    {/* Status Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      {isPast && !isFailed && (
                        <div className="bg-[#004d2a] rounded-full p-1 border border-[#00e676]/30 text-[#00e676]">
                          <CheckCircle size={14} />
                        </div>
                      )}
                      {isCurrent && !isFailed && (
                        <div className="bg-blue-600 rounded-full p-1 border border-cyan-400/50 text-cyan-400 shadow-[0_0_10px_rgba(0,168,232,0.8)]">
                          <CheckCircle size={14} />
                        </div>
                      )}
                      {isCurrent && isFailed && (
                        <div className="bg-red-900 rounded-full p-1 border border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                          <XCircle size={14} />
                        </div>
                      )}
                      {isFuture && (
                        <div className="bg-[#001530] rounded-full p-1 border border-white/20 text-zinc-400">
                          <Lock size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{stage.name}</h4>
                  <p className="text-[10px] text-zinc-400 leading-tight mb-2 max-w-[120px] mx-auto">{stage.purpose}</p>
                  
                  {isCurrent && (
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 ${
                      isFailed ? 'bg-red-500 text-red-950' : 'bg-cyan-500 text-[#001530]'
                    }`}>
                      {isFailed ? 'JOURNEY ENDED' : 'YOU ARE HERE'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. THREE COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: NEXT STEP / STATUS */}
        <div className="bg-[#001f54]/50 backdrop-blur-md rounded-[2rem] border border-cyan-500/20 p-8 flex flex-col shadow-xl relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${isFailed ? 'bg-red-500/10' : 'bg-cyan-500/10'}`} />
          <h2 className={`text-sm font-black tracking-widest uppercase flex items-center gap-3 mb-8 relative z-10 ${isFailed ? 'text-red-400' : 'text-cyan-400'}`}>
            <span className={`w-1.5 h-4 rounded-full ${isFailed ? 'bg-red-400' : 'bg-cyan-400'}`}></span>
            {isFailed ? 'COMPETITION STATUS' : 'YOUR NEXT STEP'}
          </h2>
          
          {isFailed ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-red-900/30 rounded-full flex items-center justify-center border border-red-500/30 mb-6">
                <XCircle size={48} className="text-red-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 uppercase">COMPETITION ENDED</h3>
              <p className="text-zinc-400 text-sm">Your journey ended at the {currentStage.name}. Thank you for participating in Code UnCode 2026!</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 border border-white/10 group bg-[#0a1e3d]">
                <Image src={nextStage.image} alt={nextStage.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e3d] via-transparent to-transparent opacity-30" />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-3 uppercase">{nextStage.name}</h3>
              <p className="text-zinc-400 text-sm flex-1">{nextStage.purpose}</p>
            </div>
          )}
        </div>

        {/* COLUMN 2: YOUR REGISTRATION */}
        <div id="registration-details" className="bg-[#001f54]/50 backdrop-blur-md rounded-[2rem] border border-cyan-500/20 p-8 shadow-xl flex flex-col">
          <h2 className="text-sm font-black tracking-widest uppercase flex items-center gap-3 text-cyan-400 mb-6">
            <FileText size={18} />
            YOUR REGISTRATION
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">CODE UNCODE 2026</h3>
            <p className="text-zinc-400 text-xs mt-1">Competitive Programming Competition</p>
          </div>

          {isRegistered ? (
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#00e676]" /> Status
                </span>
                <span className="text-[#00e676] font-bold text-sm">Confirmed</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-zinc-400 text-xs font-medium flex items-center gap-2">
                  <Calendar size={14} className="text-cyan-400" /> Registered On
                </span>
                <span className="text-white font-medium text-sm">
                  {new Date(mainRegistration.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center bg-cyan-900/10 rounded-xl border border-cyan-500/20">
              <XCircle size={32} className="text-orange-400 mb-3" />
              <p className="text-zinc-300 text-sm font-medium mb-4">You have not registered for the main event yet.</p>
              {event ? (
                <Link href={`/events/${event.id}`} className="bg-cyan-500 hover:bg-cyan-400 text-[#001530] font-black px-6 py-2 rounded-full text-xs tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(0,168,232,0.5)]">
                  Register Now
                </Link>
              ) : (
                <div className="px-4 py-2 bg-red-500/20 text-red-400 text-xs rounded-lg font-bold border border-red-500/30 break-all">
                  ⚠️ Error: {eventsError ? eventsError.message : (allEvents === null ? 'allEvents is null' : `allEvents length: ${allEvents?.length}`)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* COLUMN 3: KEY DATES & VISUAL */}
        <div className="flex flex-col gap-6">
          {/* Top: Key Dates */}
          <div className="bg-[#001f54]/50 backdrop-blur-md rounded-[2rem] border border-cyan-500/20 p-8 shadow-xl flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black tracking-widest uppercase flex items-center gap-3 text-cyan-400">
                <Calendar size={18} />
                KEY DATES
              </h2>
            </div>
            
            <div className="space-y-5 mt-4">
              {STAGES.slice(0, 5).map((stage, idx) => {
                const matchedEvent = allEvents?.find(e => e.title?.toLowerCase().includes(stage.name.toLowerCase()))
                const dateString = matchedEvent?.date 
                  ? new Date(matchedEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'TBA'
                
                const isPast = idx < currentStageIndex
                const isCurrent = idx === currentStageIndex
                
                let StatusIcon = Lock
                let statusColor = "text-zinc-500"
                let statusText = "To be announced"
                let textStyle = "text-zinc-500"
                
                if (isPast) { 
                  StatusIcon = CheckCircle; 
                  statusColor = "text-[#00e676]";
                  statusText = "Completed";
                  textStyle = "text-[#00e676]";
                }
                else if (isCurrent) { 
                  StatusIcon = Calendar; 
                  statusColor = "text-cyan-400";
                  statusText = "Upcoming";
                  textStyle = "text-cyan-400";
                }

                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`mt-0.5 ${statusColor}`}>
                      <StatusIcon size={16} />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className={`text-sm font-medium ${isPast ? 'text-zinc-400' : 'text-white'}`}>{stage.name}</span>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs ${isPast ? 'text-zinc-500' : 'text-zinc-400'} w-20 text-right`}>{dateString}</span>
                        <span className={`text-[10px] font-bold ${textStyle} w-24 text-right hidden sm:block`}>{statusText}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom: Motivational Scenic Visual */}
          <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-cyan-500/20 shadow-xl group bg-[#0a1e3d]">
            <Image 
              src="/images/map/welcome_shoals.jpg" 
              alt="CodeStars Aesthetic" 
              fill 
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e3d] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-serif italic text-xl leading-tight mb-2">
                &ldquo;Discipline today,<br/>Champions tomorrow.&rdquo;
              </p>
              <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mt-3">&mdash; DJS CodeStars</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
