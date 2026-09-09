import { createClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm'
import { User, Shield } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-2">Profile Settings</h1>
        <p className="text-zinc-400 font-medium">Update your CodeStars identity.</p>
      </div>

      <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="mb-10">
            <h3 className="text-sm font-black tracking-[0.2em] text-cyan-400 uppercase mb-6 flex items-center gap-3">
              <User size={18} />
              Account Information
            </h3>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1 sm:mb-0">Email</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1 sm:mb-0">Role</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-500/30">
                  {profile?.role === 'admin' && <Shield size={12} />}
                  {profile?.role}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10">
            <h3 className="text-sm font-black tracking-[0.2em] text-cyan-400 uppercase mb-6">Personal Details</h3>
            <ProfileForm initialName={profile?.full_name || ''} />
          </div>
        </div>
      </div>
    </div>
  )
}
