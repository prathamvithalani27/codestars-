import { createClient } from '@/lib/supabase/server'
import WorldMap from '@/components/map/WorldMap'
import SponsorsSection from '@/components/SponsorsSection'
import ContactFooter from '@/components/ContactFooter'
import IntroHero from '@/components/IntroHero'
import GlobalNavbar from '@/components/GlobalNavbar'

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

  // Clean up any old database data that contains generic/hackathon terminology
  const cleanedEvents = (events || []).map(event => ({
    ...event,
    title: event.title.replace(/Midnight Hackathon/gi, 'Code UnCode 2026').replace(/Hackathon/gi, 'Contest'),
    description: event.description ? event.description.replace(/Hackathon/gi, 'Contest') : event.description
  }))

  // Select the main event
  const mainEvent = cleanedEvents.find(e => e.journey_stage === 'arena_island' || e.title.includes('Code UnCode')) 
    || cleanedEvents[cleanedEvents.length - 1]

  return (
    <main className="w-full bg-[#023e8a] min-h-screen">
      <GlobalNavbar />
      <IntroHero mainEvent={mainEvent} />
      <WorldMap events={cleanedEvents} />
      <SponsorsSection />
      <ContactFooter />
    </main>
  )
}
