-- ============================================================================
-- Migration: Add Qualification Stream & Concurrency Office Locking Table
-- Execute this SQL script in your Supabase SQL Editor (https://supabase.com)
-- ============================================================================

-- 1. Add Qualification Stream fields to officer_profiles
ALTER TABLE IF EXISTS public.officer_profiles
ADD COLUMN IF NOT EXISTS qualification_stream TEXT;

ALTER TABLE IF EXISTS public.officer_profiles
ADD COLUMN IF NOT EXISTS qualification_stream_other TEXT;

-- 2. Add Qualification Stream fields to legacy officer_qualifications
ALTER TABLE IF EXISTS public.officer_qualifications
ADD COLUMN IF NOT EXISTS qualification_stream TEXT;

ALTER TABLE IF EXISTS public.officer_qualifications
ADD COLUMN IF NOT EXISTS qualification_stream_other TEXT;

-- 3. Dedicated Office Locks Table with Strict Unique Primary Key on office_code
-- Enforces backend concurrency control: the first transaction to insert locks the office permanently.
CREATE TABLE IF NOT EXISTS public.mvd_office_locks (
    office_code TEXT PRIMARY KEY,
    locked_email TEXT NOT NULL,
    locked_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mvd_office_locks_office_code ON public.mvd_office_locks(office_code);

-- 4. Enable RLS and create permissive policies for PostgREST Data API access
ALTER TABLE public.mvd_office_locks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read of office locks" ON public.mvd_office_locks;
DROP POLICY IF EXISTS "Allow public write of office locks" ON public.mvd_office_locks;

CREATE POLICY "Allow public read of office locks" ON public.mvd_office_locks FOR SELECT USING (true);
CREATE POLICY "Allow public write of office locks" ON public.mvd_office_locks FOR ALL USING (true);

GRANT ALL ON TABLE public.mvd_office_locks TO anon, authenticated, service_role;

-- 5. Atomic Lock Acquisition & Concurrency Verification Stored Procedure
CREATE OR REPLACE FUNCTION public.acquire_or_verify_office_lock(
    p_office_code TEXT,
    p_email TEXT,
    p_name TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_code TEXT := UPPER(TRIM(p_office_code));
    v_clean_email TEXT := LOWER(TRIM(p_email));
    v_existing_email TEXT;
BEGIN
    -- Check if lock already exists
    SELECT LOWER(TRIM(locked_email)) INTO v_existing_email
    FROM public.mvd_office_locks
    WHERE office_code = v_clean_code
    FOR UPDATE;

    IF v_existing_email IS NOT NULL THEN
        IF v_existing_email = v_clean_email THEN
            RETURN jsonb_build_object('success', true, 'locked', true, 'owner', v_existing_email, 'is_owner', true);
        ELSE
            RETURN jsonb_build_object('success', false, 'locked', true, 'owner', v_existing_email, 'is_owner', false, 'message', 'Submission failed: This office was just locked by another user. You cannot submit data for this office.');
        END IF;
    ELSE
        BEGIN
            INSERT INTO public.mvd_office_locks (office_code, locked_email, locked_by_name, created_at, updated_at)
            VALUES (v_clean_code, v_clean_email, p_name, NOW(), NOW());

            RETURN jsonb_build_object('success', true, 'locked', true, 'owner', v_clean_email, 'is_owner', true, 'newly_locked', true);
        EXCEPTION WHEN unique_violation THEN
            SELECT LOWER(TRIM(locked_email)) INTO v_existing_email
            FROM public.mvd_office_locks
            WHERE office_code = v_clean_code;

            IF v_existing_email = v_clean_email THEN
                RETURN jsonb_build_object('success', true, 'locked', true, 'owner', v_existing_email, 'is_owner', true);
            ELSE
                RETURN jsonb_build_object('success', false, 'locked', true, 'owner', v_existing_email, 'is_owner', false, 'message', 'Submission failed: This office was just locked by another user. You cannot submit data for this office.');
            END IF;
        END;
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.acquire_or_verify_office_lock(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- 6. Enable Realtime Replication for mvd_office_locks
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mvd_office_locks;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 7. Reload schema cache
NOTIFY pgrst, 'reload schema';

