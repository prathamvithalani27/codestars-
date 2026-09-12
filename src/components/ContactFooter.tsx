import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'

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
              <a href="https://www.linkedin.com/company/djs-codestars/posts/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.instagram.com/djsce_codestars/?hl=en" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://discord.com/invite/fdYXPDnV5c" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
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
          <div className="flex items-center space-x-3">
            <div className="relative w-14 h-14">
              <Image src="/images/logo.svg" alt="DJS CodeStars" fill className="object-contain" />
            </div>
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
