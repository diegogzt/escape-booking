-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- =============================================================================
-- ORGANIZATIONS POLICIES
-- =============================================================================

-- Users can only see their own organization
CREATE POLICY "Users can view their own organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Only admins can update their organization
CREATE POLICY "Admins can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- =============================================================================
-- USER PROFILES POLICIES
-- =============================================================================

-- Users can view profiles in their organization
CREATE POLICY "Users can view profiles in their organization" ON user_profiles
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Admins and managers can update profiles in their organization
CREATE POLICY "Admins and managers can update profiles in their organization" ON user_profiles
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- New users can insert their profile
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- =============================================================================
-- ESCAPE ROOMS POLICIES
-- =============================================================================

-- Users can view rooms in their organization
CREATE POLICY "Users can view rooms in their organization" ON escape_rooms
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Admins and managers can manage rooms
CREATE POLICY "Admins and managers can manage rooms" ON escape_rooms
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Public can view active rooms (for booking widget)
CREATE POLICY "Public can view active bookable rooms" ON escape_rooms
  FOR SELECT USING (status = 'active' AND is_bookable = true);

-- =============================================================================
-- ROOM AVAILABILITY POLICIES
-- =============================================================================

-- Users can view availability for rooms in their organization
CREATE POLICY "Users can view room availability in their organization" ON room_availability_templates
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM escape_rooms 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM user_profiles 
        WHERE id = auth.uid()
      )
    )
  );

-- Admins and managers can manage availability
CREATE POLICY "Admins and managers can manage room availability" ON room_availability_templates
  FOR ALL USING (
    room_id IN (
      SELECT id FROM escape_rooms 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'manager')
      )
    )
  );

-- Same policies for exceptions
CREATE POLICY "Users can view room exceptions in their organization" ON room_availability_exceptions
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM escape_rooms 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM user_profiles 
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and managers can manage room exceptions" ON room_availability_exceptions
  FOR ALL USING (
    room_id IN (
      SELECT id FROM escape_rooms 
      WHERE organization_id IN (
        SELECT organization_id 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'manager')
      )
    )
  );

-- =============================================================================
-- BOOKINGS POLICIES
-- =============================================================================

-- Users can view bookings in their organization
CREATE POLICY "Users can view bookings in their organization" ON bookings
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Customers can view their own bookings
CREATE POLICY "Customers can view their own bookings" ON bookings
  FOR SELECT USING (customer_id = auth.uid());

-- Staff can manage bookings in their organization
CREATE POLICY "Staff can manage bookings in their organization" ON bookings
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager', 'staff')
    )
  );

-- Customers can create bookings (for registered users)
CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() OR customer_id IS NULL
  );

-- Anonymous users can create bookings (customer_id will be NULL)
CREATE POLICY "Anonymous users can create bookings" ON bookings
  FOR INSERT WITH CHECK (customer_id IS NULL);

-- =============================================================================
-- BOOKING REVIEWS POLICIES
-- =============================================================================

-- Everyone can view public reviews
CREATE POLICY "Everyone can view public reviews" ON booking_reviews
  FOR SELECT USING (is_public = true);

-- Users can view reviews in their organization
CREATE POLICY "Users can view reviews in their organization" ON booking_reviews
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Customers can create reviews for their bookings
CREATE POLICY "Customers can create reviews for their bookings" ON booking_reviews
  FOR INSERT WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_id = auth.uid()
    )
  );

-- Staff can manage reviews in their organization
CREATE POLICY "Staff can manage reviews in their organization" ON booking_reviews
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- =============================================================================
-- GAME MASTER SCHEDULES POLICIES
-- =============================================================================

-- Game masters can view and manage their own schedules
CREATE POLICY "Game masters can manage their own schedules" ON game_master_schedules
  FOR ALL USING (game_master_id = auth.uid());

-- Admins and managers can view all schedules in their organization
CREATE POLICY "Admins and managers can view all schedules in their organization" ON game_master_schedules
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- =============================================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =============================================================================

-- Function to check if a user is admin/manager of an organization
CREATE OR REPLACE FUNCTION is_admin_or_manager(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND organization_id = org_id 
    AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM user_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check room availability for a specific time slot
CREATE OR REPLACE FUNCTION check_room_availability(
  room_uuid UUID,
  booking_date DATE,
  start_time TIME,
  end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  day_of_week INTEGER;
  is_available BOOLEAN := FALSE;
  max_concurrent INTEGER := 0;
  current_bookings INTEGER := 0;
BEGIN
  -- Get day of week (0 = Sunday, 6 = Saturday)
  day_of_week := EXTRACT(DOW FROM booking_date);
  
  -- Check if there's a template for this day and time
  SELECT max_concurrent_bookings INTO max_concurrent
  FROM room_availability_templates
  WHERE room_id = room_uuid
  AND day_of_week = day_of_week
  AND start_time <= start_time
  AND end_time >= end_time
  AND is_active = true;
  
  -- If no template found, room is not available
  IF max_concurrent IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check for exceptions on this date
  SELECT is_closed INTO is_available
  FROM room_availability_exceptions
  WHERE room_id = room_uuid
  AND exception_date = booking_date;
  
  -- If there's an exception saying it's closed, return false
  IF is_available = TRUE THEN
    RETURN FALSE;
  END IF;
  
  -- Count current bookings for this time slot
  SELECT COUNT(*) INTO current_bookings
  FROM bookings
  WHERE room_id = room_uuid
  AND booking_date = booking_date
  AND status IN ('confirmed', 'pending')
  AND (
    (start_time, end_time) OVERLAPS (start_time, end_time)
  );
  
  -- Check if we're under the limit
  RETURN current_bookings < max_concurrent;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate booking price with discounts
CREATE OR REPLACE FUNCTION calculate_booking_price(
  room_uuid UUID,
  booking_date DATE,
  number_of_players INTEGER
)
RETURNS DECIMAL(8,2) AS $$
DECLARE
  base_price DECIMAL(8,2);
  final_price DECIMAL(8,2);
  weekend_price DECIMAL(8,2);
  holiday_price DECIMAL(8,2);
  group_threshold INTEGER;
  group_discount DECIMAL(3,2);
  day_of_week INTEGER;
  exception_price DECIMAL(8,2);
BEGIN
  -- Get room pricing info
  SELECT 
    r.base_price, 
    r.weekend_price, 
    r.holiday_price,
    r.group_discount_threshold,
    r.group_discount_percentage
  INTO base_price, weekend_price, holiday_price, group_threshold, group_discount
  FROM escape_rooms r
  WHERE r.id = room_uuid;
  
  -- Start with base price
  final_price := base_price;
  
  -- Check for custom price on this date
  SELECT custom_price INTO exception_price
  FROM room_availability_exceptions
  WHERE room_id = room_uuid
  AND exception_date = booking_date
  AND custom_price IS NOT NULL;
  
  IF exception_price IS NOT NULL THEN
    final_price := exception_price;
  ELSE
    -- Check if it's weekend
    day_of_week := EXTRACT(DOW FROM booking_date);
    IF day_of_week IN (0, 6) AND weekend_price IS NOT NULL THEN
      final_price := weekend_price;
    END IF;
  END IF;
  
  -- Apply group discount if applicable
  IF number_of_players >= group_threshold THEN
    final_price := final_price * (1 - group_discount);
  END IF;
  
  RETURN final_price;
END;
$$ LANGUAGE plpgsql;
