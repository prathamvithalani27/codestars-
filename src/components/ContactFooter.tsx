import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react'

export default function ContactFooter() {
  return (
    <div className="relative bg-[#011e41] pt-32 pb-12 overflow-hidden border-t border-white/5">
      {/* Background elements to continue the world */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #00b4d8 0%, transparent 70%)', transform: 'translateY(30%)' }} />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Main Contact Brand */}
          <div className="lg:col-span-5">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-4">
              CONTACT US
            </h2>
            <p className="text-xl text-cyan-400 font-bold mb-8">
              Let's Build Something Amazing Together.
            </p>
            <p className="text-zinc-400 leading-relaxed max-w-md mb-8">
              Whether you're looking to sponsor an event, partner with us, or just want to say hi, our inbox is always open. Dive in and join the journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 lg:col-start-8 flex flex-col justify-center space-y-8">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 mr-4 shrink-0 border border-white/5">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Email Us</h4>
                <a href="mailto:djscodestars@gmail.com" className="text-zinc-400 hover:text-white transition-colors">djscodestars@gmail.com</a>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 mr-4 shrink-0 border border-white/5">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Visit Us</h4>
                <p className="text-zinc-400">DJ Sanghvi College of Engineering<br/>Mumbai - 400056</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 mr-4 shrink-0 border border-white/5">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Call Us</h4>
                <p className="text-zinc-400">+91 89285 27980<br/>+91 93216 00186</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="text-white font-black tracking-widest text-sm uppercase">DJS CodeStars</span>
          </div>
          
          <div className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} DJS CodeStars. All rights reserved.
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Code of Conduct</a>
          </div>
        </div>
      </div>
    </div>
  )
}
