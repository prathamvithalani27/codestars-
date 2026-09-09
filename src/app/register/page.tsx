'use client'

import { useState, Suspense } from 'react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || ''

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" action={handleSubmit}>
      <input type="hidden" name="redirect" value={redirectPath} />
      <div className="-space-y-px rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <div>
          <label htmlFor="full_name" className="sr-only">Full Name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            className="relative block w-full appearance-none rounded-none bg-black/40 border border-white/10 px-4 py-4 text-white placeholder-zinc-500 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all sm:text-sm"
            placeholder="Full Name"
          />
        </div>
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="relative block w-full appearance-none rounded-none bg-black/40 border border-white/10 px-4 py-4 text-white placeholder-zinc-500 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="relative block w-full appearance-none rounded-none bg-black/40 border border-white/10 px-4 py-4 text-white placeholder-zinc-500 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-400 bg-red-900/30 border border-red-500/50 rounded-lg p-3 text-sm text-center font-medium shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-4 text-sm font-black tracking-widest uppercase text-white hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#023e8a] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          {loading ? 'Preparing...' : 'JOIN CODESTARS'}
        </button>
      </div>
    </form>
  )
}

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#023e8a] px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background layer matching homepage */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8] via-[#0077b6] to-[#03045e]" />
      <div 
        className="absolute inset-0 opacity-20 mix-blend-color-dodge"
        style={{ backgroundImage: 'url(/images/map/ocean_bg.jpg)', backgroundSize: '800px', backgroundRepeat: 'repeat' }}
      />
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/30 rounded-full blur-[150px] mix-blend-screen pointer-events-none translate-y-1/3 translate-x-1/4" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-black/60 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-900/50 rounded-2xl flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-6">
              <Terminal className="text-cyan-400" size={32} />
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <Sparkles className="text-yellow-400" size={12} />
              <span className="text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase">DJS CodeStars</span>
            </div>
            
            <h2 className="text-center text-3xl font-black text-white tracking-tighter">
              Start your<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">CP Journey</span>
            </h2>
            <p className="mt-4 text-center text-sm font-medium text-zinc-400 tracking-wide">
              Step into the competitive programming world.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-4 text-cyan-400 animate-pulse font-mono text-sm">Loading Terminal...</div>}>
            <RegisterForm />
          </Suspense>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline underline-offset-4 transition-all">
                Return to your journey
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
