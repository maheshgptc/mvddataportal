-- ============================================================================
-- SQL Schema for Keralam Motor Vehicles Department (MVD) Portal
-- Modules:
--   1. IT Equipment & Power Infrastructure Inventory (mvd_it_equipment)
--   2. Officer Training & Educational Qualification Registry (officer_profiles & relations)
--   3. Office Master Data (mvd_offices_master)
--   4. Office-wise Report Snapshots & Verification Versions (office_report_versions)
--   5. Officer Audit Trail (officer_audit_logs)
--   6. Global App Settings (mvd_app_settings)
-- Execute this SQL script in your Supabase SQL Editor (https://supabase.com)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. IT Equipment & Power Infrastructure Inventory Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mvd_it_equipment (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    office_name TEXT NOT NULL UNIQUE,
    
    -- Submitter & Officer Info
    entry_officer_name TEXT,
    entry_officer_designation TEXT,
    entry_officer_mobile TEXT,
    submitted_by_email TEXT,
    created_officer_name TEXT,
    created_officer_designation TEXT,
    created_officer_mobile TEXT,
    created_officer_email TEXT,
    created_date TEXT,
    updated_officer_name TEXT,
    updated_officer_designation TEXT,
    updated_officer_mobile TEXT,
    updated_officer_email TEXT,

    -- Network Infrastructure
    network_provider TEXT,
    network_provider_other TEXT,
    network_speed TEXT,
    switches_available TEXT,
    switches_details TEXT,
    servers_available TEXT,
    servers_details TEXT,
    os_with_version TEXT,
    
    -- Core IT Systems
    monitors_working INTEGER DEFAULT 0,
    monitors_not_working INTEGER DEFAULT 0,
    cpu_working INTEGER DEFAULT 0,
    cpu_not_working INTEGER DEFAULT 0,
    laptops_working INTEGER DEFAULT 0,
    laptops_not_working INTEGER DEFAULT 0,
    aio_working INTEGER DEFAULT 0,
    aio_not_working INTEGER DEFAULT 0,
    desktop_units_not_working INTEGER DEFAULT 0,

    -- Printers
    printers_data JSONB DEFAULT '{}'::jsonb,
    dot_matrix_working INTEGER DEFAULT 0,

    -- Power & Battery Infrastructure
    ups_working INTEGER DEFAULT 0,
    ups_not_working INTEGER DEFAULT 0,
    ups_available TEXT,
    ups_units_count INTEGER DEFAULT 0,
    ups_capacity TEXT,
    ups_capacity_other TEXT,
    ups_condition TEXT,
    battery_make TEXT,
    battery_ah INTEGER DEFAULT 0,
    batteries_in_use INTEGER DEFAULT 0,
    batteries_not_in_use INTEGER DEFAULT 0,
    min_batteries_required INTEGER DEFAULT 0,
    service_report_sent TEXT,
    service_report_date TEXT,
    power_remarks TEXT,
    certified BOOLEAN DEFAULT TRUE,

    -- Hardware Lifecycle Age Profile
    systems_under_3yrs INTEGER DEFAULT 0,
    systems_3_to_5yrs INTEGER DEFAULT 0,
    systems_5_to_8yrs INTEGER DEFAULT 0,
    systems_above_8yrs INTEGER DEFAULT 0,

    -- Remarks
    remarks TEXT
);

CREATE INDEX IF NOT EXISTS idx_mvd_it_equipment_office ON mvd_it_equipment(office_name);

-- ----------------------------------------------------------------------------
-- 2. Master Offices Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mvd_offices_master (
    office_code TEXT PRIMARY KEY,
    office_name TEXT NOT NULL,
    office_category TEXT NOT NULL, -- Commissionerate & DTC, RTO, Sub-RTO, Enforcement RTO
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. Officer Profiles Table (Section 1 & 2 Core Entity)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officer_profiles (
    id TEXT PRIMARY KEY,
    officer_full_name TEXT NOT NULL,
    pen TEXT NOT NULL UNIQUE, -- Unique PEN/Employee ID constraint
    current_designation TEXT NOT NULL CHECK (current_designation IN ('RTO', 'Joint RTO', 'MVI', 'AMVI')),
    office_code TEXT NOT NULL,
    office_name TEXT NOT NULL,
    
    -- Academic & Technical Credentials
    general_education TEXT NOT NULL CHECK (general_education IN ('SSLC', 'Plus Two', 'Others')),
    general_education_other TEXT,
    technical_qualification TEXT NOT NULL CHECK (technical_qualification IN ('PhD with Postdoctoral Research', 'PhD', 'M.Tech', 'B.Tech', 'Diploma', 'Others')),
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
    entered_by_name TEXT NOT NULL,
    entered_by_designation TEXT NOT NULL,
    entered_by_mobile TEXT NOT NULL,
    entered_by_user_id TEXT,
    entered_by_timestamp TIMESTAMPTZ DEFAULT NOW(),

    -- Status & Metadata
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted')),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_officer_profiles_pen ON officer_profiles(pen);
CREATE INDEX IF NOT EXISTS idx_officer_profiles_office ON officer_profiles(office_code, status);
CREATE INDEX IF NOT EXISTS idx_officer_profiles_desig ON officer_profiles(current_designation);

-- ----------------------------------------------------------------------------
-- 4. Additional Qualifications Structured Table (1:N)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officer_additional_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES officer_profiles(id) ON DELETE CASCADE,
    officer_pen TEXT NOT NULL,
    qualification_name TEXT NOT NULL,
    completion_status TEXT NOT NULL CHECK (completion_status IN ('Completed', 'Pursuing')),
    institution TEXT,
    year INTEGER,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_officer_add_qual_pen ON officer_additional_qualifications(officer_pen);

-- ----------------------------------------------------------------------------
-- 5. Specialized Skills Structured Table (1:N)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officer_specialized_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id TEXT NOT NULL REFERENCES officer_profiles(id) ON DELETE CASCADE,
    officer_pen TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_officer_skills_pen ON officer_specialized_skills(officer_pen);

-- ----------------------------------------------------------------------------
-- 6. In-Service Training Records Table (1:N)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officer_training_records (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES officer_profiles(id) ON DELETE CASCADE,
    officer_pen TEXT NOT NULL,
    training_attended TEXT NOT NULL,
    conducted_by TEXT NOT NULL,
    duration_value NUMERIC NOT NULL,
    duration_unit TEXT NOT NULL CHECK (duration_unit IN ('Hours', 'Days', 'Weeks', 'Months')),
    month_year TEXT NOT NULL, -- YYYY-MM
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_officer_training_pen ON officer_training_records(officer_pen, month_year DESC);

-- ----------------------------------------------------------------------------
-- 7. Office-wise Report Versions & Verification Snapshots
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS office_report_versions (
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

CREATE INDEX IF NOT EXISTS idx_report_versions_office ON office_report_versions(office_code, version DESC);

-- ----------------------------------------------------------------------------
-- 8. Officer Module Audit Trail Log
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officer_audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    reference TEXT NOT NULL,
    user_role TEXT NOT NULL,
    user_name TEXT,
    user_email TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    changed_fields JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_officer_audit_time ON officer_audit_logs(timestamp DESC);

-- ----------------------------------------------------------------------------
-- 9. Legacy officer_qualifications Compatibility View/Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officer_qualifications (
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
    qualification_stream TEXT,
    qualification_stream_other TEXT,
    specialization TEXT,
    technical_certifications TEXT,
    training_attended TEXT,
    training_institutes TEXT,
    recent_training_year INTEGER,
    training_details TEXT,
    willingness_to_contribute TEXT
);

-- ----------------------------------------------------------------------------
-- 10. Global App Settings Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mvd_app_settings (
    id TEXT PRIMARY KEY,
    public_visible BOOLEAN DEFAULT TRUE,
    admin_passcode TEXT DEFAULT 'A!cell@2026',
    google_client_id TEXT,
    menu_visibility JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. Dedicated Office Locks Table (Strict Concurrency & Race Condition Control)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mvd_office_locks (
    office_code TEXT PRIMARY KEY,
    locked_email TEXT NOT NULL,
    locked_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mvd_office_locks_office_code ON public.mvd_office_locks(office_code);

-- ----------------------------------------------------------------------------
-- Row Level Security (RLS) Policies (Idempotent: Drop & Recreate)
-- ----------------------------------------------------------------------------
ALTER TABLE mvd_it_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE mvd_offices_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_additional_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_specialized_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_report_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mvd_app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mvd_office_locks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read of all tables" ON mvd_it_equipment;
DROP POLICY IF EXISTS "Allow public write of it equipment" ON mvd_it_equipment;
CREATE POLICY "Allow public read of all tables" ON mvd_it_equipment FOR SELECT USING (true);
CREATE POLICY "Allow public write of it equipment" ON mvd_it_equipment FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of offices master" ON mvd_offices_master;
DROP POLICY IF EXISTS "Allow write of offices master" ON mvd_offices_master;
CREATE POLICY "Allow read of offices master" ON mvd_offices_master FOR SELECT USING (true);
CREATE POLICY "Allow write of offices master" ON mvd_offices_master FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of officer profiles" ON officer_profiles;
DROP POLICY IF EXISTS "Allow write of officer profiles" ON officer_profiles;
CREATE POLICY "Allow read of officer profiles" ON officer_profiles FOR SELECT USING (true);
CREATE POLICY "Allow write of officer profiles" ON officer_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of add quals" ON officer_additional_qualifications;
DROP POLICY IF EXISTS "Allow write of add quals" ON officer_additional_qualifications;
CREATE POLICY "Allow read of add quals" ON officer_additional_qualifications FOR SELECT USING (true);
CREATE POLICY "Allow write of add quals" ON officer_additional_qualifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of skills" ON officer_specialized_skills;
DROP POLICY IF EXISTS "Allow write of skills" ON officer_specialized_skills;
CREATE POLICY "Allow read of skills" ON officer_specialized_skills FOR SELECT USING (true);
CREATE POLICY "Allow write of skills" ON officer_specialized_skills FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of training records" ON officer_training_records;
DROP POLICY IF EXISTS "Allow write of training records" ON officer_training_records;
CREATE POLICY "Allow read of training records" ON officer_training_records FOR SELECT USING (true);
CREATE POLICY "Allow write of training records" ON officer_training_records FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of report versions" ON office_report_versions;
DROP POLICY IF EXISTS "Allow write of report versions" ON office_report_versions;
CREATE POLICY "Allow read of report versions" ON office_report_versions FOR SELECT USING (true);
CREATE POLICY "Allow write of report versions" ON office_report_versions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow read of audit logs" ON officer_audit_logs;
DROP POLICY IF EXISTS "Allow write of audit logs" ON officer_audit_logs;
CREATE POLICY "Allow read of audit logs" ON officer_audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow write of audit logs" ON officer_audit_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read of officer qualifications" ON officer_qualifications;
DROP POLICY IF EXISTS "Allow public upsert of officer qualifications" ON officer_qualifications;
CREATE POLICY "Allow public read of officer qualifications" ON officer_qualifications FOR SELECT USING (true);
CREATE POLICY "Allow public upsert of officer qualifications" ON officer_qualifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read of app settings" ON mvd_app_settings;
DROP POLICY IF EXISTS "Allow public update of app settings" ON mvd_app_settings;
CREATE POLICY "Allow public read of app settings" ON mvd_app_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update of app settings" ON mvd_app_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read of office locks" ON public.mvd_office_locks;
DROP POLICY IF EXISTS "Allow public write of office locks" ON public.mvd_office_locks;
CREATE POLICY "Allow public read of office locks" ON public.mvd_office_locks FOR SELECT USING (true);
CREATE POLICY "Allow public write of office locks" ON public.mvd_office_locks FOR ALL USING (true);

-- ----------------------------------------------------------------------------
-- Atomic Lock Acquisition & Concurrency Verification Stored Procedure
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- Explicit Table Grants for PostgREST Data API Access
-- ----------------------------------------------------------------------------
GRANT ALL ON TABLE public.mvd_it_equipment TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mvd_offices_master TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_additional_qualifications TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_specialized_skills TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_training_records TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.office_report_versions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_audit_logs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.officer_qualifications TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mvd_app_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mvd_office_locks TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.acquire_or_verify_office_lock(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- Enable Realtime Replication for mvd_office_locks
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mvd_office_locks;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END;
$$;

-- ----------------------------------------------------------------------------
-- Reload PostgREST Schema Cache
-- ----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
