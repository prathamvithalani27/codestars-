'use client'

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Calendar, Users, MapPin, Navigation, Trophy, Code, Target, Sparkles, ChevronDown, Terminal, BookOpen, BarChart2, Cpu } from 'lucide-react'
import EventOverlay from './EventOverlay'

export type EventData = {
  id: string
  title: string
  description: string | null
  date: string
  real_location: string | null
  journey_stage: string
  journey_order: number
  capacity: number
  status: string
}

import { STAGES } from '@/lib/constants'

function getStageIcon(stageId: string) {
  switch (stageId) {
    case 'coding_camp': return <Terminal size={20} />
    case 'practice_reef': return <Code size={20} />
    case 'contest_arena': return <Cpu size={20} />
    case 'leaderboard_tower': return <BarChart2 size={20} />
    case 'upsolving_lab': return <BookOpen size={20} />
    case 'champions_summit': return <Trophy size={20} />
    default: return <Calendar size={20} />
  }
}

function getEventColor(stageId: string) {
  switch (stageId) {
    case 'coding_camp': return 'from-teal-400 to-emerald-500'
    case 'practice_reef': return 'from-blue-500 to-cyan-500'
    case 'contest_arena': return 'from-red-500 to-rose-600'
    case 'leaderboard_tower': return 'from-indigo-500 to-purple-500'
    case 'upsolving_lab': return 'from-zinc-700 to-black'
    case 'champions_summit': return 'from-amber-400 to-yellow-600'
    default: return 'from-blue-500 to-purple-600'
  }
}

function EventMarker({ event, x, y, stage, onClick }: { event: EventData, x: number, y: number, stage: typeof STAGES[0], onClick: () => void }) {
  return (
    <motion.button 
      onClick={onClick}
      className={`absolute z-40 flex flex-col items-center group transform transition-all duration-300 hover:scale-110 hover:z-50`}
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "100px" }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
      
      {/* Badge */}
      <div className={`w-14 h-14 bg-gradient-to-br ${getEventColor(stage.id)} rounded-2xl rotate-45 border-2 border-white shadow-2xl flex items-center justify-center text-white relative z-10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-shadow`}>
        <div className="-rotate-45">
          {getStageIcon(stage.id)}
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-4 bg-black/80 backdrop-blur-md px-5 py-3 rounded-xl shadow-2xl border border-white/20 pointer-events-none w-max max-w-[240px] flex flex-col items-center transform transition-all group-hover:-translate-y-1">
        <span className="text-sm font-black text-white truncate w-full text-center tracking-tight">{event.title}</span>
        <span className="text-[10px] text-blue-300 font-bold mt-1 uppercase tracking-widest">{new Date(event.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
      </div>
    </motion.button>
  )
}

export default function WorldMap({ events }: { events: EventData[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 800 })
  const [isMobile, setIsMobile] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight })
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    // eslint-disable-next-line
    setMounted(true)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const WORLD_HEIGHT = 8000
  const WORLD_WIDTH = isMobile ? 1200 : 2500

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 })

  // Mathematical Path functions
  const getPathX = (p: number) => {
    const amplitude = isMobile ? 300 : 600
    // 2.5 full sine waves
    return (WORLD_WIDTH / 2) + Math.sin(p * Math.PI * 5) * amplitude
  }
  const getPathY = (p: number) => p * WORLD_HEIGHT

  // Explorer strictly follows the mathematical path
  const explorerX = useTransform(smoothProgress, p => getPathX(p))
  const explorerY = useTransform(smoothProgress, p => getPathY(p))

  // Camera follows the explorer
  // We keep the explorer centered horizontally, and slightly above center vertically
  const cameraX = useTransform(explorerX, x => -x + (windowSize.w / 2))
  const cameraY = useTransform(explorerY, y => {
    const maxScroll = WORLD_HEIGHT - windowSize.h
    return -Math.max(0, Math.min(y - windowSize.h * 0.35, maxScroll))
  })

  // Calculate rotation tangent for the explorer
  const explorerRotation = useTransform(smoothProgress, p => {
    const amplitude = isMobile ? 300 : 600
    const dx = Math.cos(p * Math.PI * 5) * Math.PI * 5 * amplitude
    const dy = WORLD_HEIGHT
    // Math.atan2 gives angle in radians from X-axis. Down is positive Y.
    // Navigation icon natively points to top-right (-45 deg). We add 45 to correct it.
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    return angle + 45
  })

  // Generate SVG path points
  const pathPoints = useMemo(() => {
    const points = []
    for (let i = 0; i <= 100; i++) {
      const p = i / 100
      points.push(`${getPathX(p)},${getPathY(p)}`)
    }
    return `M ${points.join(' L ')}`
  }, [isMobile, WORLD_WIDTH, WORLD_HEIGHT])

  // Update active stage
  useScroll().scrollYProgress.on("change", (v) => {
    let current = -1
    for (let i = 0; i < STAGES.length; i++) {
      if (v >= STAGES[i].p - 0.08) current = i
    }
    setActiveStage(current)
  })

  return (
    <div ref={containerRef} style={{ height: `${WORLD_HEIGHT}px` }} className="relative bg-[#023e8a]">
      {!mounted ? (
        <div className="h-screen w-full bg-[#023e8a]" />
      ) : (
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* Deep Ocean Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8] via-[#0077b6] to-[#03045e]" />
        
        {/* Subtle Gradient Texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
        
        {/* The Scrollable World Layer */}
        <motion.div 
          className="absolute top-0 left-0 origin-top-left"
          style={{ 
            x: cameraX, 
            y: cameraY,
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT
          }}
        >


          {/* Canonical Dotted Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <path 
              d={pathPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="8"
              strokeDasharray="20 25"
              strokeLinecap="round"
            />
          </svg>

          {/* Render Integrated Islands */}
          {STAGES.map((stage) => {
            const islandX = getPathX(stage.p)
            const islandY = getPathY(stage.p)

            return (
              <div 
                key={stage.id} 
                className="absolute z-10 flex flex-col items-center pointer-events-none"
                style={{ 
                  left: islandX - (stage.w / 2), 
                  top: islandY - (stage.w / 2), 
                  width: stage.w, 
                  height: stage.w 
                }}
              >
                {/* Seamlessly blended island artwork */}
                <div 
                  className="w-full h-full relative"
                  style={{ 
                    // This creates a perfect radial fade so edges disappear into the ocean
                    maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
                    mixBlendMode: 'multiply'
                  }}
                >
                  <Image 
                    src={stage.image} 
                    alt={stage.name}
                    fill
                    className="object-contain filter contrast-125 saturate-[1.5]"
                    unoptimized
                  />
                </div>
              </div>
            )
          })}

          {STAGES.map((stage) => {
            const islandX = getPathX(stage.p)
            const islandY = getPathY(stage.p)
            const stageEvents = events.filter(e => e.journey_stage.toLowerCase() === stage.dbId.toLowerCase())
            
            return (
              <div key={`content-${stage.id}`} className="z-30">
                {/* Island Label - Placed below the island center */}
                <motion.div 
                  className="absolute z-20 flex flex-col items-center"
                  style={{ 
                    left: islandX, 
                    top: islandY + (stage.w / 3.5) 
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-200px" }}
                >
                  <div className="bg-black/80 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center transform -translate-x-1/2 flex flex-col items-center">
                    <div className={`w-12 h-1 bg-gradient-to-r ${getEventColor(stage.id)} rounded-full mb-3`} />
                    <h3 className="text-white font-black tracking-[0.2em] uppercase text-xl sm:text-2xl whitespace-nowrap">{stage.name}</h3>
                    <p className="text-zinc-400 text-xs font-bold tracking-widest mt-2 uppercase">{stage.purpose}</p>

                  </div>
                </motion.div>



                {/* Event Markers placed in a wide orbit */}
                {stageEvents.map((event, idx) => {
                  // Distribute radially based on order
                  const order = event.journey_order || (idx + 1)
                  const total = stageEvents.length || 1
                  // Spread them in an arc above/around the island
                  // Center the arc. If 3 events: angles could be Pi, 1.5Pi, 2Pi (top half)
                  const angleSpread = Math.PI * 1.2
                  const startAngle = Math.PI * 0.9
                  const angle = startAngle + (order / (total + 1)) * angleSpread
                  
                  const radius = stage.w / 2.2
                  
                  const markerX = islandX + Math.cos(angle) * radius
                  const markerY = islandY + Math.sin(angle) * radius

                  return (
                    <EventMarker 
                      key={event.id} 
                      event={event} 
                      stage={stage} 
                      x={markerX}
                      y={markerY}
                      onClick={() => setSelectedEvent(event)} 
                    />
                  )
                })}
              </div>
            )
          })}

          {/* The Explorer Character / Boat exactly on the mathematical path */}
          <motion.div 
            className="absolute z-50 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            style={{ 
              x: explorerX, 
              y: explorerY,
              rotate: explorerRotation,
              marginLeft: -40,
              marginTop: -40
            }}
          >
            <div className="relative">
              {/* Ripple animation behind explorer */}
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
              <div className="w-20 h-20 bg-white rounded-full border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.6)] flex items-center justify-center relative z-10">
                 <Navigation className="text-blue-600 drop-shadow-md" size={36} fill="currentColor" />
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Global UI Overlays */}
        


        {/* Journey Progress Indicator (Sidebar) */}
        <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 pointer-events-none hidden lg:flex">
          <div className="bg-black/60 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
            <h4 className="text-cyan-400 text-xs font-black tracking-[0.3em] uppercase mb-8 ml-2">Journey</h4>
            <div className="flex flex-col gap-8 relative">
              {/* Connecting line */}
              <div className="absolute left-[15px] top-6 bottom-6 w-1 bg-white/5 rounded-full" />
              
              {STAGES.map((stage, idx) => {
                const isActive = activeStage === idx
                const isPast = activeStage > idx
                
                return (
                  <div key={stage.id} className={`flex items-center gap-6 relative z-10 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100 opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all duration-500
                      ${isActive ? 'bg-cyan-500 border-white shadow-[0_0_20px_rgba(6,182,212,0.8)]' : 
                        isPast ? 'bg-white border-white' : 'bg-transparent border-white/20'}`}
                    >
                      {isPast && <div className="w-2.5 h-2.5 bg-blue-900 rounded-full" />}
                      {isActive && <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />}
                    </div>
                    <span className={`text-sm font-black tracking-[0.1em] transition-colors duration-500 uppercase ${isActive ? 'text-white' : 'text-white/60'}`}>
                      {stage.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Event Modal Overlay */}
        <AnimatePresence>
          {selectedEvent && (
            <EventOverlay event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          )}
        </AnimatePresence>
      </div>
      )}
    </div>
  )
}
