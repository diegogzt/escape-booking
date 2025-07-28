-- Fix for infinite recursion in RLS policies
-- Execute this in Supabase SQL Editor

-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view organization data" ON organizations;

-- Create simpler policies without recursion
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view organization data" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id 
            FROM users 
            WHERE id = auth.uid()
        )
    );

-- Ensure the policies are working correctly
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('users', 'organizations');
