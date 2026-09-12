-- 1. Extend public.profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS college TEXT,
ADD COLUMN IF NOT EXISTS year TEXT,
ADD COLUMN IF NOT EXISTS branch TEXT;

-- 2. Create Participant Status ENUM if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'participant_status') THEN
        CREATE TYPE participant_status AS ENUM ('ACTIVE', 'FAILED', 'COMPLETED');
    END IF;
END
$$;

-- 3. Extend public.registrations
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS current_stage TEXT NOT NULL DEFAULT 'welcome_shoals',
ADD COLUMN IF NOT EXISTS participant_status participant_status NOT NULL DEFAULT 'ACTIVE';
