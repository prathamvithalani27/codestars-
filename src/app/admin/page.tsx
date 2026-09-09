import { createClient } from '@/lib/supabase/server'
import { Users, Calendar, CheckCircle } from 'lucide-react'
import AdminDashboardChart from './AdminDashboardChart'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: regsCount } = await supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'registered')

  // Fetch data for chart
  const { data: events } = await supabase.from('events').select('id, title, capacity').order('date', { ascending: true })
  
  const chartData = []
  
  if (events) {
    for (const event of events) {
      const { count } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('status', 'registered')
        
      chartData.push({
        title: event.title.substring(0, 15) + (event.title.length > 15 ? '...' : ''),
        fullTitle: event.title,
        capacity: event.capacity,
        registered: count || 0
      })
    }
  }

  const stats = [
    { name: 'Total Users', stat: usersCount || 0, icon: Users, color: 'bg-blue-500' },
    { name: 'Total Events', stat: eventsCount || 0, icon: Calendar, color: 'bg-purple-500' },
    { name: 'Active Registrations', stat: regsCount || 0, icon: CheckCircle, color: 'bg-green-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-gray-100"
          >
            <dt>
              <div className={`absolute rounded-md ${item.color} p-3`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </dl>

      <AdminDashboardChart data={chartData} />
    </div>
  )
}
