# Supabase Configuration Guide - Escape Booking

## 🚀 Database Setup

### 1. Execute SQL Migrations

Go to your Supabase dashboard SQL Editor and execute these files in order:

1. **Initial Schema** (`supabase/migrations/20250728_001_initial_schema.sql`)
   - Creates all tables, views, functions, and indexes
   - Sets up multi-tenant architecture
   - Configures automatic triggers for `updated_at` fields

2. **RLS Policies** (`supabase/migrations/20250728_002_rls_policies.sql`)
   - Configures Row Level Security policies
   - Sets up multi-tenant data isolation
   - Creates helper functions for common operations

### 2. Environment Variables

Your `.env.local` is already configured with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vacokylwmswklrlsjynq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Database Schema Overview

### Core Tables

#### **organizations** (Multi-tenant)
- Main organization/company data
- Subscription plans (free, pro, enterprise)
- Limits based on subscription

#### **user_profiles** (Extended Auth)
- Links to Supabase Auth users
- Role-based permissions (admin, manager, staff, customer)
- Organization membership

#### **escape_rooms**
- Room details, pricing, availability rules
- SEO optimization fields
- Gallery and descriptions

#### **bookings**
- Complete booking lifecycle management
- Payment tracking with Stripe integration
- AI game master assignment

#### **room_availability_templates**
- Weekly recurring availability schedules
- Configurable time slots per room

#### **room_availability_exceptions**
- Override normal schedule for holidays, maintenance
- Custom pricing for special dates

#### **booking_reviews**
- Customer feedback and ratings
- Public/private review management

### Key Features

#### **Multi-tenant Architecture**
- Complete data isolation between organizations
- RLS policies ensure data security
- Scalable for thousands of escape room businesses

#### **Advanced Availability System**
- Flexible scheduling with templates and exceptions
- Support for multiple concurrent bookings per time slot
- Holiday and special event pricing

#### **AI-Ready Structure**
- Game master scheduling and automatic assignment
- Customer preference tracking
- Booking pattern analysis for AI optimization

#### **Payment Integration**
- Stripe payment intent tracking
- Multiple payment statuses
- Refund management

## 🔧 Usage Examples

### Check Room Availability

```typescript
const isAvailable = await supabase.rpc('check_room_availability', {
  room_uuid: 'room-id',
  booking_date: '2025-07-30',
  start_time: '14:00:00',
  end_time: '15:00:00'
})
```

### Calculate Dynamic Pricing

```typescript
const price = await supabase.rpc('calculate_booking_price', {
  room_uuid: 'room-id',
  booking_date: '2025-07-30',
  number_of_players: 4
})
```

### Get Organization Data (RLS Protected)

```typescript
const { data: org } = await supabase
  .from('organizations')
  .select('*')
  .single() // RLS automatically filters to user's org
```

## 🛡️ Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access data from their organization
- Admins have elevated permissions within their org
- Customers can only see their own bookings

### API Functions
- Helper functions for common operations
- Server-side validation and calculations
- Secure data access patterns

## 📈 Analytics & Reporting

### Built-in Views

#### **daily_booking_stats**
- Daily booking summaries by organization
- Revenue tracking
- Booking status distribution

#### **room_performance_stats**
- Room utilization metrics
- Revenue per room
- Average ratings

### Performance Optimizations

- Strategic indexes on frequently queried fields
- Optimized queries for booking calendar
- Efficient RLS policies

## 🚀 Next Steps

1. ✅ Execute SQL migrations in Supabase dashboard
2. 🔄 Test database connection with your app
3. 🔄 Create sample organization and rooms
4. 🔄 Implement authentication flow
5. 🔄 Build booking calendar component

## 📞 Support

If you encounter any issues:
1. Check Supabase logs in dashboard
2. Verify RLS policies are working correctly
3. Test with service role key for debugging
4. Ensure all environment variables are set

---

**Database Status**: ✅ Schema ready, ⏳ Awaiting migration execution
