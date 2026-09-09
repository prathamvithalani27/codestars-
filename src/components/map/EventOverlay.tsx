'use client'

import { EventData } from './WorldMap'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Users, ArrowRight, Code, Terminal, Trophy, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

function getEventTheme(title: string, stage: string) {
  const t = title.toLowerCase()
  if (t.includes('hackathon') || t.includes('code clash')) {
    return { bg: 'bg-indigo-900', icon: <Terminal className="w-16 h-16 text-indigo-300 opacity-50" />, pattern: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-800 via-indigo-950 to-black' }
  }
  if (t.includes('workshop')) {
    return { bg: 'bg-cyan-900', icon: <Code className="w-16 h-16 text-cyan-300 opacity-50" />, pattern: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-800 via-cyan-950 to-black' }
  }
  if (t.includes('competition') || t.includes('ctf')) {
    return { bg: 'bg-red-900', icon: <Trophy className="w-16 h-16 text-red-300 opacity-50" />, pattern: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-800 via-red-950 to-black' }
  }
  return { bg: 'bg-emerald-900', icon: <Sparkles className="w-16 h-16 text-emerald-300 opacity-50" />, pattern: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800 via-emerald-950 to-black' }
}

export default function EventOverlay({ event, onClose }: { event: EventData, onClose: () => void }) {
  const router = useRouter()
  const theme = getEventTheme(event.title, event.journey_stage)

  const handleRegister = () => {
    router.push(`/events/${event.id}`)
  }

  // Calculate percentage
  // In a real app we'd fetch actual registered count. Here we simulate 65% full for visual demo.
  const percentFull = 65

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-lg"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-950 rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden border border-zinc-800 flex flex-col md:flex-row relative"
        >
          {/* Close button - absolute floating */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 bg-black/50 hover:bg-white hover:text-black text-white rounded-full p-3 transition-all backdrop-blur-md border border-white/20"
          >
            <X size={24} />
          </button>

          {/* Left / Top Side: Artwork & Identity */}
          <div className={`md:w-5/12 relative flex flex-col justify-end p-10 ${theme.pattern} overflow-hidden min-h-[300px]`}>
            {/* Abstract geometric decorations */}
            <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4">
              {theme.icon}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />
            
            <div className="relative z-20">
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-black uppercase tracking-[0.2em] border border-white/20 mb-6">
                {event.journey_stage.replace('_', ' ')}
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight drop-shadow-xl">
                {event.title}
              </h2>
            </div>
          </div>
          
          {/* Right / Bottom Side: Details & Actions */}
          <div className="md:w-7/12 p-10 sm:p-12 flex flex-col justify-between bg-zinc-950 relative">
            
            {/* Background subtle logo */}
            <div className="absolute top-10 right-10 opacity-5">
              <Calendar size={120} />
            </div>

            <div>
              <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed font-medium mb-10">
                {event.description || 'Join us for this exciting event in the Archipelago journey. Reserve your spot today before capacity fills up.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mr-4 text-cyan-400 border border-zinc-800 shadow-inner">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase font-black tracking-wider mb-1">Date & Time</div>
                    <div className="text-zinc-200 font-semibold">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                    <div className="text-zinc-400 text-sm">{new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mr-4 text-purple-400 border border-zinc-800 shadow-inner">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase font-black tracking-wider mb-1">Location</div>
                    <div className="text-zinc-200 font-semibold">{event.real_location || 'To Be Announced'}</div>
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50 mb-10">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center text-zinc-300 font-semibold">
                    <Users size={16} className="mr-2 text-zinc-500" />
                    Registration Capacity
                  </div>
                  <div className="text-sm font-bold text-white">
                    {Math.floor(event.capacity * 0.65)} <span className="text-zinc-500 font-medium">/ {event.capacity} seats</span>
                  </div>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentFull}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" 
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleRegister}
              className="group w-full py-5 bg-white text-black rounded-2xl font-black text-lg uppercase tracking-wider hover:bg-cyan-400 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center justify-center"
            >
              Secure Your Spot
              <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
