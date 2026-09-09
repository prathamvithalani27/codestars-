import React from 'react'

const OFFICIAL_SPONSORS = [
  "QUANTIPHI", "BOOT.DEV", "QUANTIPHI", "BOOT.DEV", "QUANTIPHI", "BOOT.DEV"
]

export default function SponsorsSection() {
  return (
    <div className="bg-[#023e8a] py-24 relative overflow-hidden border-t border-white/10">
      {/* Background depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#023e8a] to-[#011e41]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16 text-center">
        <h3 className="text-cyan-400 text-sm font-black tracking-[0.3em] uppercase mb-4">Backed By The Best</h3>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">OUR SPONSORS</h2>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="relative z-10 w-full overflow-hidden flex">
        {/* Left/Right fading edges */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#023e8a] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#023e8a] to-transparent z-20 pointer-events-none" />
        
        {/* Track 1 */}
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {OFFICIAL_SPONSORS.map((sponsor, idx) => (
            <div key={idx} className="mx-8 sm:mx-16 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 hover:border-cyan-400/50 transition-colors cursor-pointer group">
              <span className="text-white/40 font-black tracking-widest text-xl sm:text-2xl group-hover:text-cyan-400 transition-colors">
                {sponsor}
              </span>
            </div>
          ))}
        </div>
        {/* Track 2 (Clone for seamless looping) */}
        <div className="flex animate-marquee whitespace-nowrap items-center" aria-hidden="true">
          {OFFICIAL_SPONSORS.map((sponsor, idx) => (
            <div key={`clone-${idx}`} className="mx-8 sm:mx-16 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 hover:border-cyan-400/50 transition-colors cursor-pointer group">
              <span className="text-white/40 font-black tracking-widest text-xl sm:text-2xl group-hover:text-cyan-400 transition-colors">
                {sponsor}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  )
}
