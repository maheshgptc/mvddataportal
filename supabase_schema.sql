-- SQL Schema for MVD IT Equipment List Web Application
-- Execute this SQL script in your Supabase SQL Editor (https://supabase.com)

-- 1. Create the equipment entries table
CREATE TABLE IF NOT EXISTS equipment_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    office_name TEXT NOT NULL,
    
    -- Monitors
    monitor_working INTEGER DEFAULT 0,
    monitor_not_working INTEGER DEFAULT 0,
    
    -- CPU
    cpu_working INTEGER DEFAULT 0,
    cpu_not_working INTEGER DEFAULT 0,
    
    -- Laptops
    laptops_working INTEGER DEFAULT 0,
    laptops_not_working INTEGER DEFAULT 0,
    
    -- All-in-One PCs
    aio_working INTEGER DEFAULT 0,
    aio_not_working INTEGER DEFAULT 0,
    
    -- UPS
    ups_working INTEGER DEFAULT 0,
    ups_not_working INTEGER DEFAULT 0,
    
    -- Batteries
    batteries_working INTEGER DEFAULT 0, -- "No of Batteries using in the office"
    batteries_not_working INTEGER DEFAULT 0, -- "No. of Batteries not in use"
    
    -- Special aggregates requested
    working_dot_matrix INTEGER DEFAULT 0, -- "No of working Dot Matrix Printer in the office"
    not_working_desktop INTEGER DEFAULT 0, -- "No of Desk top unit which are not working"
    
    -- Printers detailed counts (Stored as JSON for simplicity and future extensions)
    -- Format: {
    --   "dot_matrix": { "working": 0, "not_working": 0, "multipurpose": 0 },
    --   "ink_jet": { "working": 0, "not_working": 0, "multipurpose": 0 },
    --   "laser": { "working": 0, "not_working": 0, "multipurpose": 0 },
    --   "xerox": { "working": 0, "not_working": 0, "multipurpose": 0 },
    --   "others": { "working": 0, "not_working": 0, "multipurpose": 0 }
    -- }
    printers_data JSONB DEFAULT '{}'::jsonb,
    
    -- Network
    os_version TEXT,
    network_type TEXT, -- "KSWAN, KFONE, BSNL, JIO, Kerala Vision, Asianet, Others"
    network_other_detail TEXT,
    network_speed TEXT,
    
    -- Systems age distribution
    age_3yr INTEGER DEFAULT 0, -- "3 years old"
    age_3_5yr INTEGER DEFAULT 0, -- "3-5 years old"
    age_5_8yr INTEGER DEFAULT 0, -- "5-8 years old"
    age_above_8yr INTEGER DEFAULT 0, -- "more than 8 years old"
    
    -- Remarks
    remarks TEXT
);

-- Index for faster queries when retrieving latest office entry
CREATE INDEX IF NOT EXISTS idx_equipment_entries_office_created ON equipment_entries(office_name, created_at DESC);

-- 2. Create the settings table
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default value for public submissions hidden status (default: false)
INSERT INTO app_settings (key, value)
VALUES ('hide_public_submissions', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE equipment_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 3. Define policies for public access (or admin controls)
-- In a basic installation, we allow public read and write.
-- If required, restrict delete/update to admin or use an API key.

-- Policy for equipment_entries
CREATE POLICY "Allow public read of entries" 
    ON equipment_entries FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert of entries" 
    ON equipment_entries FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow admin delete of entries"
    ON equipment_entries FOR DELETE
    USING (true); -- In a production database, you can tie this to Auth, but since this is client-configured, we allow open access or restrict via RLS.

-- Policy for app_settings
CREATE POLICY "Allow public read of settings" 
    ON app_settings FOR SELECT 
    USING (true);

CREATE POLICY "Allow public update of settings" 
    ON app_settings FOR UPDATE 
    USING (true);

-- 4. Create the officer qualifications table
CREATE TABLE IF NOT EXISTS officer_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    office_name TEXT NOT NULL,
    
    -- Entry Officer Details
    entry_officer_name TEXT,
    entry_officer_designation TEXT,
    entry_officer_mobile TEXT,
    
    -- Officer Profile Details
    officer_name TEXT NOT NULL,
    officer_designation TEXT NOT NULL, -- "Regional Transport Officer", "Joint Regional Transport Officer", "Motor Vehicle Inspector", "Asst. Motor Vehicles Inspector"
    educational_qualification TEXT NOT NULL, -- "PHD with Postdoc", "PHD", "M.Tech", "B.Tech", "Diploma", "Other"
    qualification_other TEXT,
    specialization TEXT,
    training_attended TEXT
);

-- Index for fast office & officer lookup
CREATE INDEX IF NOT EXISTS idx_officer_qualifications_office_created ON officer_qualifications(office_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_officer_qualifications_designation ON officer_qualifications(officer_designation);

-- Enable RLS
ALTER TABLE officer_qualifications ENABLE ROW LEVEL SECURITY;

-- Policies for officer_qualifications
CREATE POLICY "Allow public read of officer qualifications" 
    ON officer_qualifications FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert of officer qualifications" 
    ON officer_qualifications FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow admin delete of officer qualifications" 
    ON officer_qualifications FOR DELETE 
    USING (true);

