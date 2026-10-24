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
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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
