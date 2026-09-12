'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { EventData } from './map/WorldMap'

export default function IntroHero({ mainEvent }: { mainEvent?: EventData }) {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#023e8a] overflow-hidden z-20">
      {/* Background World Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#03045e] via-[#023e8a] to-[#0077b6]" />
      
      {/* Texture to feel like the same world */}
      <div className="absolute inset-0 opacity-10 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
      
      {/* Mystical shadows & glows */}
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#023e8a] to-transparent z-10" />

      {/* Subtle warm torchlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center w-full max-w-6xl px-4 sm:px-6 md:px-12 py-10 mt-6 sm:mt-12">
        
        {/* Title Area */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              WELCOME TO <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-300 via-yellow-400 to-orange-500 font-serif tracking-widest italic pr-4">
                CP ISLAND
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Storytelling Split Layout */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 sm:gap-12 w-full max-w-5xl mb-24 md:mb-16">
          
          {/* Guide Character */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="w-full max-w-[240px] sm:max-w-[280px] md:w-1/2 flex justify-center md:justify-end relative"
          >
            <div className="relative w-full aspect-[4/5]">
              {/* Fade edges to blend into the background */}
              <div 
                className="w-full h-full relative"
                style={{ 
                  maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)'
                }}
              >
                <Image 
                  src="/images/tribal_guide.jpg" 
                  alt="Island Guide" 
                  fill 
                  className="object-cover opacity-90 drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Dialogue & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.9 }}
            className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pt-2 sm:pt-8"
          >
            {/* Speech Bubble */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-8 rounded-3xl rounded-tl-sm sm:rounded-tl-sm mb-6 sm:mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              {/* Speech bubble pointer (desktop points left, mobile points up) */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 md:top-8 md:-left-3 md:translate-x-0 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white/20 md:border-t-[10px] md:border-t-transparent md:border-b-[10px] md:border-b-transparent md:border-r-[10px] md:border-r-white/20" />
              
              <h3 className="text-orange-400 font-bold tracking-widest uppercase mb-3 sm:mb-4 text-xs sm:text-sm">
                "Welcome, CodeStar."
              </h3>
              
              <p className="text-blue-50/90 font-medium leading-relaxed text-sm sm:text-base drop-shadow-md">
                "These shores lead to CP Island —<br className="hidden lg:block"/>
                where algorithms become adventures, <br className="hidden lg:block"/>
                problems become challenges, <br className="hidden lg:block"/>
                and every contest tests your skill."
              </p>
              
              <p className="mt-3 sm:mt-4 text-cyan-400 font-black tracking-widest text-xs uppercase">
                "Your journey begins here."
              </p>
            </div>

            {/* Register CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-2"
            >
              <Link 
                href={mainEvent ? `/events/${mainEvent.id}` : `/register`} 
                className="group relative inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-black tracking-widest text-blue-950 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:scale-105 hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] active:scale-95 transition-all uppercase overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">REGISTER NOW</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-default z-30"
        >
          <span className="text-white/60 uppercase tracking-[0.2em] text-[10px] sm:text-xs font-black mb-2 sm:mb-3 drop-shadow-md">
            SCROLL TO GO AHEAD
          </span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-md shadow-[0_0_15px_rgba(0,180,216,0.3)]"
          >
            <ChevronDown className="text-cyan-400" size={16} />
          </motion.div>
        </motion.div>

      </div>
    </div>
  )
}
