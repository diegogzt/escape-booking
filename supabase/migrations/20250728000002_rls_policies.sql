-- Enable Row Level Security (RLS) on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE escape_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their own organization" ON organizations
    FOR SELECT USING (id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Admins can update their organization" ON organizations
    FOR UPDATE USING (id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    ));

-- Profiles policies
CREATE POLICY "Users can view profiles in their organization" ON profiles
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage profiles in their organization" ON profiles
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager')
    ));

-- Escape rooms policies
CREATE POLICY "Users can view escape rooms in their organization" ON escape_rooms
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Admins can manage escape rooms" ON escape_rooms
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager')
    ));

-- Game masters policies
CREATE POLICY "Users can view game masters in their organization" ON game_masters
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Admins can manage game masters" ON game_masters
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager')
    ));

-- Bookings policies
CREATE POLICY "Users can view bookings in their organization" ON bookings
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Staff can manage bookings in their organization" ON bookings
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager', 'staff')
    ));

CREATE POLICY "Customers can view their own bookings" ON bookings
    FOR SELECT USING (customer_id = auth.uid());

-- Payments policies
CREATE POLICY "Users can view payments in their organization" ON payments
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Admins can manage payments" ON payments
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager')
    ));

-- Availability slots policies
CREATE POLICY "Users can view availability in their organization" ON availability_slots
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Staff can manage availability" ON availability_slots
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager', 'staff')
    ));

-- AI chat sessions policies
CREATE POLICY "Users can view chat sessions in their organization" ON ai_chat_sessions
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Staff can manage chat sessions" ON ai_chat_sessions
    FOR ALL USING (organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager', 'staff')
    ));

-- Analytics events policies
CREATE POLICY "Admins can view analytics in their organization" ON analytics_events
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'manager')
    ));

CREATE POLICY "System can insert analytics events" ON analytics_events
    FOR INSERT WITH CHECK (true);
