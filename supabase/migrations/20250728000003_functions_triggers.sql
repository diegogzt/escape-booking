-- Function to handle user registration and profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escape_rooms_updated_at BEFORE UPDATE ON escape_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_masters_updated_at BEFORE UPDATE ON game_masters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_slots_updated_at BEFORE UPDATE ON availability_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at BEFORE UPDATE ON ai_chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate confirmation codes
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
BEGIN
    code := UPPER(substring(encode(gen_random_bytes(10), 'base32'), 1, 8));
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically set confirmation code on booking insert
CREATE OR REPLACE FUNCTION set_booking_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL THEN
        NEW.confirmation_code := generate_confirmation_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_confirmation_code_trigger
    BEFORE INSERT ON bookings
    FOR EACH ROW EXECUTE FUNCTION set_booking_confirmation_code();

-- Function to get organization stats
CREATE OR REPLACE FUNCTION get_organization_stats(org_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_bookings', (
            SELECT COUNT(*) FROM bookings WHERE organization_id = org_id
        ),
        'total_revenue', (
            SELECT COALESCE(SUM(total_amount), 0) FROM bookings 
            WHERE organization_id = org_id AND status = 'completed'
        ),
        'active_rooms', (
            SELECT COUNT(*) FROM escape_rooms 
            WHERE organization_id = org_id AND status = 'active'
        ),
        'this_month_bookings', (
            SELECT COUNT(*) FROM bookings 
            WHERE organization_id = org_id 
            AND booking_date >= date_trunc('month', CURRENT_DATE)
        ),
        'this_month_revenue', (
            SELECT COALESCE(SUM(total_amount), 0) FROM bookings 
            WHERE organization_id = org_id 
            AND booking_date >= date_trunc('month', CURRENT_DATE)
            AND status = 'completed'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check room availability
CREATE OR REPLACE FUNCTION check_room_availability(
    room_id UUID,
    booking_date DATE,
    start_time TIME,
    duration INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
    end_time TIME;
    conflicts INTEGER;
BEGIN
    end_time := start_time + (duration || ' minutes')::INTERVAL;
    
    SELECT COUNT(*) INTO conflicts
    FROM bookings b
    WHERE b.escape_room_id = room_id
    AND b.booking_date = booking_date
    AND b.status NOT IN ('cancelled')
    AND (
        (b.booking_time, b.booking_time + (b.duration_minutes || ' minutes')::INTERVAL) 
        OVERLAPS 
        (start_time, end_time)
    );
    
    RETURN conflicts = 0;
END;
$$ LANGUAGE plpgsql;

-- Function for AI to get booking recommendations
CREATE OR REPLACE FUNCTION get_booking_recommendations(
    org_id UUID,
    room_id UUID,
    requested_date DATE,
    num_players INTEGER
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    room_info RECORD;
BEGIN
    -- Get room information
    SELECT * INTO room_info
    FROM escape_rooms
    WHERE id = room_id AND organization_id = org_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Room not found');
    END IF;
    
    -- Build recommendations
    SELECT json_build_object(
        'room', json_build_object(
            'name', room_info.name,
            'difficulty', room_info.difficulty_level,
            'duration', room_info.duration_minutes,
            'min_players', room_info.min_players,
            'max_players', room_info.max_players
        ),
        'player_fit', CASE
            WHEN num_players < room_info.min_players THEN 'below_minimum'
            WHEN num_players > room_info.max_players THEN 'above_maximum'
            ELSE 'perfect_fit'
        END,
        'suggested_times', (
            SELECT json_agg(time_slot) FROM (
                SELECT to_char(generate_series(
                    '10:00'::TIME,
                    '21:00'::TIME,
                    '1 hour'::INTERVAL
                ), 'HH24:MI') as time_slot
                WHERE check_room_availability(room_id, requested_date, generate_series::TIME)
                LIMIT 5
            ) available_times
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
