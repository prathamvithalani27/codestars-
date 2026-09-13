'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function GlobalNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-[100] pointer-events-none">
      <Link href="/" className="pointer-events-auto flex items-center space-x-4 cursor-pointer hover:scale-105 transition-transform">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <Image src="/images/logo.svg" alt="DJS CodeStars" fill className="object-contain drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]" />
        </div>
      </Link>
      
      <div className="pointer-events-auto flex gap-4">
        {isLoggedIn ? (
          <Link href="/dashboard" className="px-6 py-3 bg-white text-blue-900 font-black rounded-full hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] text-sm uppercase tracking-wider">Dashboard</Link>
        ) : (
          <Link href="/login" className="px-6 py-3 bg-black/40 backdrop-blur-xl border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all shadow-xl text-sm uppercase tracking-wider">Login</Link>
        )}
      </div>
    </div>
  )
}
