import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log("Checking events...");
  const { data: events, error: fetchErr } = await supabase.from('events').select('*');
  console.log("Current events:", events, fetchErr);

  if (!events || events.length === 0) {
    console.log("Inserting main event...");
    const { data, error } = await supabase.from('events').insert([
      {
        id: 'e0000000-0000-0000-0000-000000000000',
        title: 'Code UnCode 2026', 
        description: '24 hours of competitive programming in the Arena. May the best team win.', 
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
        real_location: 'Arena Hall', 
        journey_stage: 'arena_island', 
        journey_order: 1, 
        capacity: 100,
        status: 'published'
      }
    ]).select();
    
    console.log("Insert result:", data, error);
  } else {
    console.log("Event already exists!");
  }
}

setup();
