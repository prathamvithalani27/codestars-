-- Insert some dummy events to populate the Archipelago map

INSERT INTO public.events (title, description, date, real_location, journey_stage, journey_order, capacity, status)
VALUES
  (
    'Orientation & Onboarding', 
    'Welcome to the Archipelago! Meet the team and get your starter pack.', 
    NOW() + INTERVAL '1 day', 
    'Main Auditorium', 
    'welcome_shoals', 
    1, 
    200, 
    'published'
  ),
  (
    'Intro to Git & GitHub', 
    'Learn the basics of version control and collaboration.', 
    NOW() + INTERVAL '2 days', 
    'Lab 301', 
    'tinkers_reef', 
    1, 
    50, 
    'published'
  ),
  (
    'React Fundamentals', 
    'Build your first component in the Tinker''s Reef workshop.', 
    NOW() + INTERVAL '3 days', 
    'Lab 302', 
    'tinkers_reef', 
    2, 
    50, 
    'published'
  ),
  (
    'Tech Club Annual Keynote', 
    'Our biggest gathering of the year at the Great Atoll. Don''t miss the announcements!', 
    NOW() + INTERVAL '5 days', 
    'Main Stadium', 
    'great_atoll', 
    1, 
    500, 
    'published'
  ),
  (
    'Midnight Hackathon', 
    '24 hours of coding in the Arena. May the best team win.', 
    NOW() + INTERVAL '7 days', 
    'Arena Hall', 
    'arena_island', 
    1, 
    150, 
    'published'
  ),
  (
    'Capture The Flag (CTF)', 
    'Test your cybersecurity skills in the deep jungle ruins.', 
    NOW() + INTERVAL '10 days', 
    'Secret Location', 
    'hackers_hideaway', 
    1, 
    60, 
    'published'
  ),
  (
    'Closing Ceremony', 
    'Celebrate our achievements at the Summit!', 
    NOW() + INTERVAL '14 days', 
    'Summit Point', 
    'summit_island', 
    1, 
    300, 
    'published'
  ),
  (
    'Arduino Hardware Workshop', 
    'An optional side-quest for hardware enthusiasts.', 
    NOW() + INTERVAL '6 days', 
    'Hardware Lab', 
    'tech_lab', 
    1, 
    30, 
    'published'
  );
