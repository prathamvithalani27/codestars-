import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import { User, Calendar, LogOut, Map, Terminal } from 'lucide-react'
import { redirect } from 'next/navigation'

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
      <div 
        className="absolute inset-0 opacity-20 mix-blend-color-dodge pointer-events-none"
        style={{ backgroundImage: 'url(/images/map/ocean_bg.jpg)', backgroundSize: '800px', backgroundRepeat: 'repeat' }}
      />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[150px] mix-blend-screen pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <nav className="relative z-20 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900/50 rounded-xl flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Terminal className="text-cyan-400" size={20} />
                </div>
                <span className="text-lg sm:text-xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
                  DJS CodeStars
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex space-x-2 items-center">
                <Link href="/" className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center transition-all hover:bg-white/5">
                  <Map size={16} className="mr-2" />
                  World Map
                </Link>
                <Link href="/dashboard" className="text-white bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-sm font-bold flex items-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <Calendar size={16} className="mr-2 text-cyan-400" />
                  My Events
                </Link>
                <Link href="/dashboard/profile" className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center transition-all hover:bg-white/5">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                {profile?.role === 'admin' && (
                  <Link href="/admin/events" className="text-purple-400 hover:text-purple-300 px-3 py-2 rounded-lg text-sm font-bold border border-purple-500/30 ml-4 hover:bg-purple-500/10 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
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
              <Calendar size={14} className="mr-1.5 text-cyan-400" /> Events
            </Link>
            <Link href="/dashboard/profile" className="text-zinc-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center transition-all whitespace-nowrap">
              <User size={14} className="mr-1.5" /> Profile
            </Link>
            {profile?.role === 'admin' && (
              <Link href="/admin/events" className="text-purple-400 px-3 py-2 rounded-lg text-xs font-bold border border-purple-500/30 whitespace-nowrap">
                Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
