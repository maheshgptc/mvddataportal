-- ============================================================================
-- SQL Migration for Officer Training & Qualification Module
-- Database: Supabase PostgreSQL (mghdekancxfqtnfoyfkj)
-- Execute in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

-- 1. Master Offices Table
CREATE TABLE IF NOT EXISTS public.mvd_offices_master (
    office_code TEXT PRIMARY KEY,
    office_name TEXT NOT NULL,
    office_category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Core Officer Profiles Table
CREATE TABLE IF NOT EXISTS public.officer_profiles (
    id TEXT PRIMARY KEY,
    officer_full_name TEXT NOT NULL,
    pen TEXT NOT NULL UNIQUE,
    current_designation TEXT NOT NULL,
    office_code TEXT NOT NULL,
    office_name TEXT NOT NULL,
    
    -- Academic & Technical Credentials
    general_education TEXT NOT NULL DEFAULT 'Plus Two',
    general_education_other TEXT,
    technical_qualification TEXT NOT NULL DEFAULT 'B.Tech',
    technical_qualification_other TEXT,
    qualification_stream TEXT,
    qualification_stream_other TEXT,
    institution TEXT,
    passing_year INTEGER,
    class_grade TEXT,

    -- Stored JSON arrays for fast client retrieval
    additional_qualifications JSONB DEFAULT '[]'::jsonb,
    specialized_skills JSONB DEFAULT '[]'::jsonb,
    training_history JSONB DEFAULT '[]'::jsonb,

    -- Willingness to Contribute
    willingness_to_contribute TEXT,

    -- Submitter info (Entered By)
    entered_by_name TEXT NOT NULL DEFAULT 'Reporting Officer',
    entered_by_designation TEXT NOT NULL DEFAULT 'Officer',
    entered_by_mobile TEXT NOT NULL DEFAULT '9447000000',
    entered_by_user_id TEXT,
    entered_by_timestamp TIMESTAMPTZ DEFAULT NOW(),

    -- Status & Metadata
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted')),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_officer_profiles_pen ON public.officer_profiles(pen);
CREATE INDEX IF NOT EXISTS idx_officer_profiles_office ON public.officer_profiles(office_code, status);
CREATE INDEX IF NOT EXISTS idx_officer_profiles_desig ON public.officer_profiles(current_designation);

-- 3. Additional Qualifications Structured Table (1:N)
CREATE TABLE IF NOT EXISTS public.officer_additional_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES public.officer_profiles(id) ON DELETE CASCADE,
    officer_pen TEXT NOT NULL,
    qualification_name TEXT NOT NULL,
    completion_status TEXT NOT NULL CHECK (completion_status IN ('Completed', 'Pursuing')),
    institution TEXT,
    year INTEGER,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_officer_add_qual_pen ON public.officer_additional_qualifications(officer_pen);

-- 4. Specialized Skills Structured Table (1:N)
CREATE TABLE IF NOT EXISTS public.officer_specialized_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES public.officer_profiles(id) ON DELETE CASCADE,
    officer_pen TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_officer_skills_pen ON public.officer_specialized_skills(officer_pen);

-- 5. In-Service Training Records Table (1:N)
CREATE TABLE IF NOT EXISTS public.officer_training_records (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES public.officer_profiles(id) ON DELETE CASCADE,
    officer_pen TEXT NOT NULL,
    training_attended TEXT NOT NULL,
    conducted_by TEXT NOT NULL,
    duration_value NUMERIC NOT NULL,
    duration_unit TEXT NOT NULL CHECK (duration_unit IN ('Hours', 'Days', 'Weeks', 'Months')),
    month_year TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_officer_training_pen ON public.officer_training_records(officer_pen, month_year DESC);

-- 6. Office-wise Report Versions & Verification Snapshots
CREATE TABLE IF NOT EXISTS public.office_report_versions (
    id TEXT PRIMARY KEY,
    reference_number TEXT NOT NULL UNIQUE,
    version INTEGER NOT NULL,
    office_code TEXT NOT NULL,
    office_name TEXT NOT NULL,
    cutoff_timestamp TIMESTAMPTZ NOT NULL,
    
    -- Verification details
    is_verified BOOLEAN DEFAULT FALSE,
    reverification_required BOOLEAN DEFAULT FALSE,
    verified_by_name TEXT,
    verified_by_designation TEXT,
    verified_at TIMESTAMPTZ,
    verification_remarks TEXT,
    
    -- Dispatch / Forwarding details
    is_forwarded BOOLEAN DEFAULT FALSE,
    outward_number TEXT,
    forward_date DATE,
    forwarding_remarks TEXT,
    dispatched_by_name TEXT,
    dispatched_by_user_id TEXT,
    dispatched_at TIMESTAMPTZ,

    -- Immutable Snapshot Content
    included_officer_pens JSONB DEFAULT '[]'::jsonb,
    summary_counts JSONB DEFAULT '{}'::jsonb,
    report_snapshot_payload JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_versions_office ON public.office_report_versions(office_code, version DESC);

-- 7. Officer Module Audit Trail Log
CREATE TABLE IF NOT EXISTS public.officer_audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    reference TEXT NOT NULL,
    user_role TEXT NOT NULL,
    user_name TEXT,
    user_email TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    changed_fields JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_officer_audit_time ON public.officer_audit_logs(timestamp DESC);

-- 8. Legacy officer_qualifications Compatibility Table
CREATE TABLE IF NOT EXISTS public.officer_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_name TEXT NOT NULL,
    entry_officer_name TEXT,
    entry_officer_designation TEXT,
    entry_officer_mobile TEXT,
    officer_name TEXT NOT NULL,
    officer_pen TEXT UNIQUE,
    officer_designation TEXT NOT NULL,
    officer_mobile TEXT,
    officer_email TEXT,
    educational_qualification TEXT NOT NULL,
    qualification_other TEXT,
    specialization TEXT,
    technical_certifications TEXT,
    training_attended TEXT,
    training_institutes TEXT,
    recent_training_year INTEGER,
    training_details TEXT,
    willingness_to_contribute TEXT
);

CREATE INDEX IF NOT EXISTS idx_officer_qual_pen ON public.officer_qualifications(officer_pen);

-- 9. Row Level Security (RLS) Configuration
ALTER TABLE public.mvd_offices_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_additional_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_specialized_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_report_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_qualifications ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies: Allow read & write operations
DROP POLICY IF EXISTS "Allow read of offices master" ON public.mvd_offices_master;
DROP POLICY IF EXISTS "Allow write of offices master" ON public.mvd_offices_master;
CREATE POLICY "Allow read of offices master" ON public.mvd_offices_master FOR SELECT USING (true);
CREATE POLICY "Allow write of offices master" ON public.mvd_offices_master FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of officer profiles" ON public.officer_profiles;
DROP POLICY IF EXISTS "Allow write of officer profiles" ON public.officer_profiles;
CREATE POLICY "Allow read of officer profiles" ON public.officer_profiles FOR SELECT USING (true);
CREATE POLICY "Allow write of officer profiles" ON public.officer_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of add quals" ON public.officer_additional_qualifications;
DROP POLICY IF EXISTS "Allow write of add quals" ON public.officer_additional_qualifications;
CREATE POLICY "Allow read of add quals" ON public.officer_additional_qualifications FOR SELECT USING (true);
CREATE POLICY "Allow write of add quals" ON public.officer_additional_qualifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of skills" ON public.officer_specialized_skills;
DROP POLICY IF EXISTS "Allow write of skills" ON public.officer_specialized_skills;
CREATE POLICY "Allow read of skills" ON public.officer_specialized_skills FOR SELECT USING (true);
CREATE POLICY "Allow write of skills" ON public.officer_specialized_skills FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of training records" ON public.officer_training_records;
DROP POLICY IF EXISTS "Allow write of training records" ON public.officer_training_records;
CREATE POLICY "Allow read of training records" ON public.officer_training_records FOR SELECT USING (true);
CREATE POLICY "Allow write of training records" ON public.officer_training_records FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of report versions" ON public.office_report_versions;
DROP POLICY IF EXISTS "Allow write of report versions" ON public.office_report_versions;
CREATE POLICY "Allow read of report versions" ON public.office_report_versions FOR SELECT USING (true);
CREATE POLICY "Allow write of report versions" ON public.office_report_versions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of audit logs" ON public.officer_audit_logs;
DROP POLICY IF EXISTS "Allow write of audit logs" ON public.officer_audit_logs;
CREATE POLICY "Allow read of audit logs" ON public.officer_audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow write of audit logs" ON public.officer_audit_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read of officer qualifications" ON public.officer_qualifications;
DROP POLICY IF EXISTS "Allow public upsert of officer qualifications" ON public.officer_qualifications;
CREATE POLICY "Allow public read of officer qualifications" ON public.officer_qualifications FOR SELECT USING (true);
CREATE POLICY "Allow public upsert of officer qualifications" ON public.officer_qualifications FOR ALL USING (true);

-- 9. Dedicated Office Locks Table with Strict Unique Primary Key (Race Condition Prevention)
CREATE TABLE IF NOT EXISTS public.mvd_office_locks (
    office_code TEXT PRIMARY KEY,
    locked_email TEXT NOT NULL,
    locked_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mvd_office_locks_office_code ON public.mvd_office_locks(office_code);

ALTER TABLE public.mvd_office_locks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read of office locks" ON public.mvd_office_locks;
DROP POLICY IF EXISTS "Allow public write of office locks" ON public.mvd_office_locks;
CREATE POLICY "Allow public read of office locks" ON public.mvd_office_locks FOR SELECT USING (true);
CREATE POLICY "Allow public write of office locks" ON public.mvd_office_locks FOR ALL USING (true);

-- Atomic Lock Acquisition & Concurrency Verification Stored Procedure
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

-- 10. Explicit Table Grants for PostgREST Data API Access
GRANT ALL ON TABLE public.mvd_offices_master TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_additional_qualifications TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_specialized_skills TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_training_records TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.office_report_versions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_audit_logs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_qualifications TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mvd_office_locks TO anon, authenticated, service_role;

-- 11. Reload PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';

-- 12. Enable Supabase Realtime Replication for Live Multi-Device Sync
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
    WHERE pubname = 'supabase_realtime' AND tablename = 'office_report_versions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.office_report_versions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'officer_audit_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.officer_audit_logs;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'officer_qualifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.officer_qualifications;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'mvd_office_locks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mvd_office_locks;
  END IF;
END $$;


