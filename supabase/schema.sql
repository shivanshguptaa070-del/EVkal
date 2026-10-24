-- ====================================================================
-- EVkal Production Supabase PostgreSQL Schema
-- Hackathon Problem Statement #053
-- Complies with PostgreSQL & Supabase Security & RLS Best Practices
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('CONSUMER', 'DISCOM_ADMIN', 'FLEET_OPERATOR', 'COMMUNITY_HOST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('AVAILABLE', 'REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'CONSUMER'::user_role,
    account_type TEXT DEFAULT 'Individual',
    phone TEXT,
    city TEXT DEFAULT 'New Delhi',
    state TEXT DEFAULT 'Delhi NCR',
    ev_model TEXT DEFAULT 'Tata Nexon EV Max',
    battery_capacity_kwh NUMERIC(5, 2) DEFAULT 40.50,
    is_admin BOOLEAN DEFAULT FALSE,
    admin_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on email & role
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 4. EV CHARGING SESSIONS (P0 Grid & Optimizer Sessions)
CREATE TABLE IF NOT EXISTS public.ev_charging_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    vehicle_name TEXT NOT NULL,
    battery_capacity_kwh NUMERIC(5, 2) NOT NULL,
    current_soc_pct NUMERIC(5, 2) NOT NULL,
    target_soc_pct NUMERIC(5, 2) NOT NULL,
    arrival_hour INT NOT NULL CHECK (arrival_hour >= 0 AND arrival_hour <= 23),
    departure_hour INT NOT NULL CHECK (departure_hour >= 0 AND departure_hour <= 23),
    max_charge_power_kw NUMERIC(5, 2) NOT NULL DEFAULT 7.40,
    is_flexible BOOLEAN DEFAULT TRUE,
    energy_needed_kwh NUMERIC(6, 2) GENERATED ALWAYS AS (battery_capacity_kwh * (target_soc_pct - current_soc_pct) / 100.0) STORED,
    status session_status DEFAULT 'PENDING'::session_status,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.ev_charging_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.ev_charging_sessions(status);

-- 5. P2P CHARGER LISTINGS (P1 Community Sharing Network)
CREATE TABLE IF NOT EXISTS public.p2p_charger_listings (
    id TEXT PRIMARY KEY,
    host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    host_name TEXT NOT NULL,
    title TEXT NOT NULL,
    locality TEXT NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    power_kw NUMERIC(5, 2) NOT NULL,
    rate_per_kwh NUMERIC(6, 2) NOT NULL,
    connector_type TEXT NOT NULL,
    access_type TEXT DEFAULT 'RESIDENTIAL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_p2p_listings_host ON public.p2p_charger_listings(host_id);
CREATE INDEX IF NOT EXISTS idx_p2p_listings_active ON public.p2p_charger_listings(is_active);

-- 6. P2P BOOKINGS
CREATE TABLE IF NOT EXISTS public.p2p_bookings (
    id TEXT PRIMARY KEY,
    driver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    driver_name TEXT NOT NULL,
    listing_id TEXT REFERENCES public.p2p_charger_listings(id) ON DELETE CASCADE,
    charger_title TEXT NOT NULL,
    location TEXT NOT NULL,
    booking_date DATE DEFAULT CURRENT_DATE,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    energy_kwh NUMERIC(5, 2) DEFAULT 0,
    cost_inr NUMERIC(8, 2) DEFAULT 0,
    co2_saved_kg NUMERIC(6, 2) DEFAULT 0,
    status booking_status DEFAULT 'REQUESTED'::booking_status,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_driver ON public.p2p_bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON public.p2p_bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.p2p_bookings(status);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Uses (SELECT auth.uid()) for query planner performance & isolation
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_charging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.p2p_charger_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.p2p_bookings ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read profiles; users can update/insert own profile
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users and system can insert profile"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- Sessions: Users see and create their own sessions; Admins see all
CREATE POLICY "Users can view own charging sessions"
    ON public.ev_charging_sessions FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = user_id 
        OR (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true
    );

CREATE POLICY "Users can insert own charging sessions"
    ON public.ev_charging_sessions FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- P2P Listings: Viewable by all; Host can update own listing
CREATE POLICY "Public listings viewable by all authenticated users"
    ON public.p2p_charger_listings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Hosts can manage own listings"
    ON public.p2p_charger_listings FOR ALL
    TO authenticated
    USING ((SELECT auth.uid()) = host_id)
    WITH CHECK ((SELECT auth.uid()) = host_id);

-- P2P Bookings: Drivers & Hosts can view their related bookings
CREATE POLICY "Users can view their bookings"
    ON public.p2p_bookings FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = driver_id 
        OR EXISTS (
            SELECT 1 FROM public.p2p_charger_listings 
            WHERE p2p_charger_listings.id = p2p_bookings.listing_id 
            AND p2p_charger_listings.host_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Drivers can insert bookings"
    ON public.p2p_bookings FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = driver_id);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        account_type,
        city,
        state
    ) VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        CASE 
            WHEN new.raw_user_meta_data->>'is_admin' = 'true' THEN 'DISCOM_ADMIN'::user_role
            ELSE 'CONSUMER'::user_role
        END,
        COALESCE(new.raw_user_meta_data->>'account_type', 'Individual'),
        COALESCE(new.raw_user_meta_data->>'city', 'New Delhi'),
        'Delhi NCR'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        RETURN new;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 7. INITIAL CHARGING NETWORK REGISTRY (DELHI NCR)
-- Pre-configured community and residential EV charging stations across key Delhi NCR localities
-- Provides instant regional discovery across Central, South, North, West, East Delhi, Noida & Gurugram
-- ====================================================================

INSERT INTO public.p2p_charger_listings (
    id,
    host_name,
    title,
    locality,
    latitude,
    longitude,
    power_kw,
    rate_per_kwh,
    connector_type,
    access_type,
    is_active
) VALUES
('HOST-DEL-001', 'Rajesh K.', 'Vasant Kunj Driveway Wallbox', 'Vasant Kunj Sector C, New Delhi', 28.524400, 77.155800, 7.40, 11.50, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-002', 'Dr. Neha Sharma', 'Hauz Khas Enclave Villa Charger', 'Hauz Khas Enclave, New Delhi', 28.541200, 77.173500, 11.00, 12.00, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-003', 'Arjun Bhasin', 'Saket Porch Charging Point', 'Saket Block J, New Delhi', 28.510300, 77.192100, 3.30, 9.50, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-004', 'GreenRide Community Hub', 'Chanakyapuri Diplomatic Fast DC', 'Chanakyapuri Diplomatic Enclave, New Delhi', 28.568200, 77.161100, 22.00, 14.50, 'CCS_2', 'COMMERCIAL', true),
('HOST-DEL-005', 'Vipin Singhal', 'Shivalik Basement Charging Slot', 'Malviya Nagar Shivalik, New Delhi', 28.535500, 77.210400, 7.40, 10.80, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-006', 'Suresh Goel', 'Mehrauli Heritage Bay', 'Mehrauli Heritage Zone, New Delhi', 28.498800, 77.172200, 15.00, 13.00, 'CHADEMO', 'COMMERCIAL', true),
('HOST-DEL-007', 'Vikramaditya Mehta', 'Connaught Place Inner Circle Port', 'Connaught Place Inner Circle, New Delhi', 28.631500, 77.216700, 22.00, 12.50, 'CCS_2', 'COMMERCIAL', true),
('HOST-DEL-008', 'Sunita Rao', 'Dwarka Sector 10 Society Charger', 'Dwarka Sector 10, New Delhi', 28.582300, 77.050000, 7.40, 10.50, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-009', 'Amit Malhotra', 'Rohini Sector 13 Driveway Portico', 'Rohini Sector 13, North Delhi', 28.716600, 77.124500, 11.00, 11.20, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-010', 'Priya Taneja', 'Greater Kailash II Stilt Bay', 'Greater Kailash II (GK-2), New Delhi', 28.535000, 77.241000, 7.40, 11.00, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-011', 'Raghav Singhania', 'Lajpat Nagar IV Community Charger', 'Lajpat Nagar IV, South Delhi', 28.569500, 77.243500, 7.40, 10.20, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-012', 'Harpreet Singh', 'Karol Bagh Pusa Road Canopy Port', 'Karol Bagh Pusa Road, Central Delhi', 28.646500, 77.190500, 11.00, 12.00, 'CCS_2', 'RESIDENTIAL', true),
('HOST-DEL-013', 'Deepa Nair', 'Janakpuri District Hub Station', 'Janakpuri District Centre, West Delhi', 28.629500, 77.081500, 7.40, 10.40, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-014', 'Aerocity EV Gateway', 'Aerocity 24/7 Hospitality DC Fast', 'Aerocity Hospitality District, New Delhi', 28.552000, 77.121500, 22.00, 13.80, 'CCS_2', 'COMMERCIAL', true),
('HOST-DEL-015', 'Alok Verma', 'Mayur Vihar Phase 1 Driveway Gun', 'Mayur Vihar Phase 1, East Delhi', 28.608000, 77.295000, 7.40, 9.80, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-016', 'Shivani Bansal', 'Noida Sector 62 Campus Port', 'Sector 62 IT Park, Noida', 28.628000, 77.365000, 11.00, 11.50, 'TYPE_2', 'COMMERCIAL', true),
('HOST-DEL-017', 'Kabir Oberoi', 'DLF Cyber City Dual Fast Bay', 'DLF Cyber City Phase 2, Gurugram', 28.495000, 77.089500, 22.00, 13.50, 'CCS_2', 'COMMERCIAL', true),
('HOST-DEL-018', 'Rakesh Aggarwal', 'Indirapuram Shaded Portico', 'Indirapuram Vaibhav Khand, Ghaziabad', 28.643000, 77.371000, 7.40, 10.00, 'TYPE_2', 'RESIDENTIAL', true),
('HOST-DEL-019', 'Ananya Kapoor', 'Nehru Place Commercial Port', 'Nehru Place Commercial Hub, South Delhi', 28.549000, 77.252000, 11.00, 11.80, 'TYPE_2', 'COMMERCIAL', true),
('HOST-DEL-020', 'Rohit Choudhary', 'South Extension II Fast Lane Point', 'South Extension Part 2, New Delhi', 28.567000, 77.219000, 7.40, 10.90, 'TYPE_2', 'RESIDENTIAL', true)
ON CONFLICT (id) DO NOTHING;
