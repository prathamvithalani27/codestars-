import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import { User, Calendar, LogOut, Map, Terminal } from 'lucide-react'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return (
    <div className="relative min-h-screen flex flex-col bg-[#023e8a] overflow-hidden">
      {/* Background layer matching homepage */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8] via-[#0077b6] to-[#03045e] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[150px] mix-blend-screen pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <nav className="relative z-20 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="w-[92vw] max-w-[1500px] mx-auto">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <Image src="/images/logo.svg" alt="DJS CodeStars" fill className="object-contain" />
                </div>
              </div>
              <div className="hidden md:ml-10 md:flex space-x-2 items-center">
                <Link href="/" className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center transition-all hover:bg-white/5">
                  <Map size={16} className="mr-2" />
                  World Map
                </Link>
                <Link href="/dashboard" className="text-white bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-sm font-bold flex items-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <Calendar size={16} className="mr-2 text-cyan-400" />
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center transition-all hover:bg-white/5">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <form action={logout}>
                <button type="submit" className="text-zinc-400 hover:text-red-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all hover:bg-red-500/10 border border-transparent hover:border-red-500/30">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </form>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex overflow-x-auto py-3 space-x-2 border-t border-white/5 no-scrollbar">
            <Link href="/" className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all whitespace-nowrap">
              <Map size={14} className="mr-1.5" /> Map
            </Link>
            <Link href="/dashboard" className="text-white bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-xs font-bold flex items-center whitespace-nowrap">
              <Calendar size={14} className="mr-1.5 text-cyan-400" /> Dashboard
            </Link>
            <Link href="/dashboard/profile" className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all whitespace-nowrap">
              <User size={14} className="mr-1.5" /> Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 w-[92vw] max-w-[1500px] mx-auto py-10">
        {children}
      </main>
    </div>
  )
}
