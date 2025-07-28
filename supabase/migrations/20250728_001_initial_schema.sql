-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable Row Level Security (RLS)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff', 'customer');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE room_status AS ENUM ('active', 'maintenance', 'inactive');

-- =============================================================================
-- ORGANIZATIONS (Multi-tenant support)
-- =============================================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Spain',
  timezone VARCHAR(50) DEFAULT 'Europe/Madrid',
  currency VARCHAR(3) DEFAULT 'EUR',
  language VARCHAR(5) DEFAULT 'es',
  
  -- Subscription info
  subscription_plan VARCHAR(20) DEFAULT 'free', -- free, pro, enterprise
  subscription_status VARCHAR(20) DEFAULT 'active',
  subscription_ends_at TIMESTAMPTZ,
  
  -- Limits for different plans
  max_rooms INTEGER DEFAULT 1, -- free: 1, pro: 10, enterprise: unlimited
  max_bookings_per_month INTEGER DEFAULT 100, -- free: 100, pro: unlimited
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USERS (Extended from Supabase Auth)
-- =============================================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role user_role DEFAULT 'customer',
  
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  avatar_url TEXT,
  
  -- Preferences
  preferred_language VARCHAR(5) DEFAULT 'es',
  timezone VARCHAR(50) DEFAULT 'Europe/Madrid',
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  
  -- Customer specific fields
  total_bookings INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  favorite_rooms UUID[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ESCAPE ROOMS
-- =============================================================================
CREATE TABLE escape_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  story TEXT, -- Background story for the room
  image_url TEXT,
  gallery_urls TEXT[], -- Array of image URLs
  
  -- Room specifications
  min_players INTEGER DEFAULT 1,
  max_players INTEGER DEFAULT 6,
  duration_minutes INTEGER DEFAULT 60,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  
  -- Pricing
  base_price DECIMAL(8,2) NOT NULL,
  weekend_price DECIMAL(8,2),
  holiday_price DECIMAL(8,2),
  group_discount_threshold INTEGER DEFAULT 4,
  group_discount_percentage DECIMAL(3,2) DEFAULT 0.10,
  
  -- Availability
  status room_status DEFAULT 'active',
  is_bookable BOOLEAN DEFAULT true,
  advance_booking_days INTEGER DEFAULT 30, -- How many days in advance can be booked
  min_advance_hours INTEGER DEFAULT 2, -- Minimum hours in advance
  
  -- SEO and marketing
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags TEXT[], -- For categorization and search
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, slug)
);

-- Enable RLS
ALTER TABLE escape_rooms ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ROOM AVAILABILITY TEMPLATES
-- =============================================================================
CREATE TABLE room_availability_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES escape_rooms(id) ON DELETE CASCADE,
  
  -- Day of week (0 = Sunday, 6 = Saturday)
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  
  -- Time slots
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Capacity for this time slot
  max_concurrent_bookings INTEGER DEFAULT 1,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(room_id, day_of_week, start_time)
);

-- Enable RLS
ALTER TABLE room_availability_templates ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ROOM AVAILABILITY EXCEPTIONS
-- =============================================================================
CREATE TABLE room_availability_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES escape_rooms(id) ON DELETE CASCADE,
  
  exception_date DATE NOT NULL,
  
  -- Override normal schedule
  is_closed BOOLEAN DEFAULT false,
  custom_start_time TIME,
  custom_end_time TIME,
  custom_price DECIMAL(8,2),
  
  reason TEXT, -- Holiday, maintenance, special event, etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(room_id, exception_date)
);

-- Enable RLS
ALTER TABLE room_availability_exceptions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- BOOKINGS
-- =============================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES escape_rooms(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Booking details
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Customer information (stored even if not registered user)
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  
  -- Group details
  number_of_players INTEGER NOT NULL,
  player_names TEXT[], -- Optional: names of all players
  special_requests TEXT,
  
  -- Pricing
  base_price DECIMAL(8,2) NOT NULL,
  discount_amount DECIMAL(8,2) DEFAULT 0,
  tax_amount DECIMAL(8,2) DEFAULT 0,
  total_amount DECIMAL(8,2) NOT NULL,
  
  -- Payment
  payment_status payment_status DEFAULT 'pending',
  payment_method VARCHAR(50), -- stripe, cash, bank_transfer
  payment_intent_id TEXT, -- Stripe payment intent ID
  paid_at TIMESTAMPTZ,
  
  -- Status and workflow
  status booking_status DEFAULT 'pending',
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Game Master assignment (AI will help with this)
  assigned_game_master_id UUID REFERENCES user_profiles(id),
  game_master_notes TEXT,
  
  -- Internal notes and tracking
  internal_notes TEXT,
  booking_source VARCHAR(50) DEFAULT 'website', -- website, phone, walk-in, widget
  
  -- Reminders and notifications
  reminder_sent_at TIMESTAMPTZ,
  confirmation_sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- BOOKING REVIEWS AND FEEDBACK
-- =============================================================================
CREATE TABLE booking_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Ratings (1-5 scale)
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  room_rating INTEGER CHECK (room_rating >= 1 AND room_rating <= 5),
  staff_rating INTEGER CHECK (staff_rating >= 1 AND staff_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  -- Written feedback
  review_title VARCHAR(255),
  review_text TEXT,
  
  -- Metadata
  would_recommend BOOLEAN,
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE booking_reviews ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- GAME MASTER SCHEDULES
-- =============================================================================
CREATE TABLE game_master_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_master_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Availability
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Preferences
  preferred_rooms UUID[], -- Array of room IDs they prefer
  max_concurrent_games INTEGER DEFAULT 1,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(game_master_id, day_of_week, start_time)
);

-- Enable RLS
ALTER TABLE game_master_schedules ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ANALYTICS AND REPORTING VIEWS
-- =============================================================================

-- Daily booking summary view
CREATE VIEW daily_booking_stats AS
SELECT 
  organization_id,
  booking_date,
  COUNT(*) as total_bookings,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
  SUM(total_amount) FILTER (WHERE payment_status = 'paid') as total_revenue,
  AVG(number_of_players) as avg_group_size
FROM bookings
GROUP BY organization_id, booking_date;

-- Room performance view
CREATE VIEW room_performance_stats AS
SELECT 
  r.id as room_id,
  r.name as room_name,
  r.organization_id,
  COUNT(b.id) as total_bookings,
  COUNT(b.id) FILTER (WHERE b.status = 'completed') as completed_bookings,
  SUM(b.total_amount) FILTER (WHERE b.payment_status = 'paid') as total_revenue,
  AVG(br.overall_rating) as avg_rating,
  COUNT(br.id) as total_reviews
FROM escape_rooms r
LEFT JOIN bookings b ON r.id = b.room_id
LEFT JOIN booking_reviews br ON b.id = br.booking_id
GROUP BY r.id, r.name, r.organization_id;

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Booking queries (most common)
CREATE INDEX idx_bookings_organization_date ON bookings(organization_id, booking_date);
CREATE INDEX idx_bookings_room_date ON bookings(room_id, booking_date);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- Room queries
CREATE INDEX idx_rooms_organization ON escape_rooms(organization_id);
CREATE INDEX idx_rooms_status ON escape_rooms(status);
CREATE INDEX idx_rooms_slug ON escape_rooms(organization_id, slug);

-- User queries
CREATE INDEX idx_user_profiles_organization ON user_profiles(organization_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Availability queries
CREATE INDEX idx_availability_templates_room_day ON room_availability_templates(room_id, day_of_week);
CREATE INDEX idx_availability_exceptions_room_date ON room_availability_exceptions(room_id, exception_date);

-- Review queries
CREATE INDEX idx_reviews_booking ON booking_reviews(booking_id);
CREATE INDEX idx_reviews_organization ON booking_reviews(organization_id);
CREATE INDEX idx_reviews_public ON booking_reviews(is_public) WHERE is_public = true;

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables that need updated_at tracking
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escape_rooms_updated_at BEFORE UPDATE ON escape_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
