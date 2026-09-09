-- Enums
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'completed');
CREATE TYPE registration_status AS ENUM ('registered', 'cancelled');

-- Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events Table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  real_location TEXT,
  journey_stage TEXT NOT NULL,
  journey_order INTEGER NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status event_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Registrations Table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  status registration_status NOT NULL DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view their own profile." 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles." 
  ON public.profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update their own profile." 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles." 
  ON public.profiles FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Events RLS
CREATE POLICY "Anyone can view published events." 
  ON public.events FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can view all events." 
  ON public.events FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert events." 
  ON public.events FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update events." 
  ON public.events FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete events." 
  ON public.events FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Registrations RLS
CREATE POLICY "Users can view their own registrations." 
  ON public.registrations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations." 
  ON public.registrations FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert their own registration." 
  ON public.registrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registration (to cancel)." 
  ON public.registrations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all registrations." 
  ON public.registrations FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete registrations." 
  ON public.registrations FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Capacity Enforcement Function
-- This function handles the registration process safely.
CREATE OR REPLACE FUNCTION register_for_event(p_event_id UUID, p_user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as database owner so it can bypass RLS for the capacity check if needed, but we still check the user.
AS $$
DECLARE
  v_capacity INTEGER;
  v_current_registrations INTEGER;
  v_registration_id UUID;
BEGIN
  -- Basic auth check (if not called from an authenticated session)
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Lock the event row to prevent concurrent capacity checks from passing simultaneously
  SELECT capacity INTO v_capacity
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found';
  END IF;

  -- Check current active registrations
  SELECT COUNT(*) INTO v_current_registrations
  FROM public.registrations
  WHERE event_id = p_event_id AND status = 'registered';

  IF v_current_registrations >= v_capacity THEN
    RAISE EXCEPTION 'Event is full';
  END IF;

  -- Insert or update the registration
  INSERT INTO public.registrations (user_id, event_id, status)
  VALUES (p_user_id, p_event_id, 'registered')
  ON CONFLICT (user_id, event_id) 
  DO UPDATE SET status = 'registered', created_at = NOW()
  RETURNING id INTO v_registration_id;

  RETURN json_build_object('success', true, 'registration_id', v_registration_id);
END;
$$;

-- Trigger to automatically create a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Student'),
    'student'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
