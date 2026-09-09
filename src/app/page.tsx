import { createClient } from '@/lib/supabase/server'
import WorldMap from '@/components/map/WorldMap'
import SponsorsSection from '@/components/SponsorsSection'
import ContactFooter from '@/components/ContactFooter'

// Prevent static generation so it always fetches the latest events
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  // Fetch only published events for the public map
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('journey_stage', { ascending: true })
    .order('journey_order', { ascending: true })

  return (
    <main className="w-full bg-[#023e8a] min-h-screen">
      <WorldMap events={events || []} />
      <SponsorsSection />
      <ContactFooter />
    </main>
  )
}
