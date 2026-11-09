-- ============================================================================
-- Supabase Schema Migration: Add willingness_to_contribute & sync qualification logic
-- Compatible with PostgreSQL 15+ / Supabase Realtime
-- ============================================================================

-- 1. Add willingness_to_contribute column to officer_profiles
ALTER TABLE IF EXISTS public.officer_profiles
ADD COLUMN IF NOT EXISTS willingness_to_contribute TEXT;

-- 2. Add willingness_to_contribute column to legacy officer_qualifications
ALTER TABLE IF EXISTS public.officer_qualifications
ADD COLUMN IF NOT EXISTS willingness_to_contribute TEXT;

-- 3. Update technical_qualification check constraint if present on officer_profiles
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'officer_profiles_technical_qualification_check'
    ) THEN
        ALTER TABLE public.officer_profiles DROP CONSTRAINT officer_profiles_technical_qualification_check;
    END IF;

    -- Re-add constraint to support Basic Technical Qualifications ('B.Tech', 'Diploma', 'Others')
    -- while remaining backward compatible with any existing rows
    ALTER TABLE public.officer_profiles 
    ADD CONSTRAINT officer_profiles_technical_qualification_check 
    CHECK (technical_qualification IN ('B.Tech', 'Diploma', 'Others', 'PhD with Postdoctoral Research', 'PhD', 'M.Tech'));
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Constraint update skipped or already applied: %', SQLERRM;
END $$;

-- 4. Ensure Realtime Publication includes officer_profiles & officer_qualifications
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'officer_profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.officer_profiles;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'officer_qualifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.officer_qualifications;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Publication alter skipped: %', SQLERRM;
END $$;

-- 5. Row Level Security & Permissions
ALTER TABLE IF EXISTS public.officer_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read of officer profiles" ON public.officer_profiles;
DROP POLICY IF EXISTS "Allow write of officer profiles" ON public.officer_profiles;
CREATE POLICY "Allow read of officer profiles" ON public.officer_profiles FOR SELECT USING (true);
CREATE POLICY "Allow write of officer profiles" ON public.officer_profiles FOR ALL USING (true);

ALTER TABLE IF EXISTS public.officer_qualifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read of officer qualifications" ON public.officer_qualifications;
DROP POLICY IF EXISTS "Allow public upsert of officer qualifications" ON public.officer_qualifications;
CREATE POLICY "Allow public read of officer qualifications" ON public.officer_qualifications FOR SELECT USING (true);
CREATE POLICY "Allow public upsert of officer qualifications" ON public.officer_qualifications FOR ALL USING (true);

GRANT ALL ON TABLE public.officer_profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_qualifications TO anon, authenticated, service_role;

