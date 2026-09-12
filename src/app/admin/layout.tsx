import { Sidebar } from '@/components/admin/Sidebar'
import { logout } from '@/app/actions/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-[#023e8a] overflow-hidden">
      {/* Background layer matching participant dashboard */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#00b4d8] via-[#0077b6] to-[#03045e] pointer-events-none" />
      <div className="fixed inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
      
      {/* Sidebar for all screen sizes */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col">
        <Sidebar />
      </div>

      <div className="pl-72 relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-end px-4 sm:px-6 lg:px-8">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 py-2 px-4 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
            >
              Sign out
            </button>
          </form>
        </header>

        {/* Main Content */}
        <main className="py-10 flex-1">
          <div className="px-4 sm:px-6 lg:px-8 text-white">{children}</div>
        </main>
      </div>
    </div>
  )
}
