'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, List, LogOut, Settings, Target } from 'lucide-react'
import Image from 'next/image'
import { logout } from '@/app/actions/auth'

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Participants', href: '/admin/participants', icon: Users },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/60 backdrop-blur-2xl border-r border-white/10 px-6 pb-4">
      <div className="flex h-24 shrink-0 items-center gap-3 border-b border-white/10">
        <div className="relative w-12 h-12 flex items-center justify-center bg-blue-900/50 rounded-xl border border-cyan-500/30">
          <Image src="/images/logo.svg" alt="DJS CodeStars" fill className="object-contain p-2" />
        </div>
        <div>
          <h2 className="text-white font-black text-xs tracking-widest uppercase">DJS CodeStars</h2>
          <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase mt-0.5">Control Center</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col mt-2">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent',
                        'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-bold transition-all'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          isActive ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-white',
                          'h-5 w-5 shrink-0 transition-colors'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <form action={logout}>
               <button
                type="submit"
                className="group w-full -mx-2 flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all"
              >
                <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  )
}
