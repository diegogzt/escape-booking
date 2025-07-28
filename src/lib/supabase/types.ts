export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type UserRole = 'admin' | 'manager' | 'staff' | 'customer'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'
export type RoomStatus = 'active' | 'maintenance' | 'inactive'
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise'

// Database Types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          phone: string | null
          email: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string
          timezone: string
          currency: string
          language: string
          subscription_plan: SubscriptionPlan
          subscription_status: string
          subscription_ends_at: string | null
          max_rooms: number
          max_bookings_per_month: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          phone?: string | null
          email?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          timezone?: string
          currency?: string
          language?: string
          subscription_plan?: SubscriptionPlan
          subscription_status?: string
          subscription_ends_at?: string | null
          max_rooms?: number
          max_bookings_per_month?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          phone?: string | null
          email?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          timezone?: string
          currency?: string
          language?: string
          subscription_plan?: SubscriptionPlan
          subscription_status?: string
          subscription_ends_at?: string | null
          max_rooms?: number
          max_bookings_per_month?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          organization_id: string | null
          role: UserRole
          first_name: string | null
          last_name: string | null
          phone: string | null
          date_of_birth: string | null
          avatar_url: string | null
          preferred_language: string
          timezone: string
          email_notifications: boolean
          sms_notifications: boolean
          total_bookings: number
          total_spent: number
          favorite_rooms: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          role?: UserRole
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          avatar_url?: string | null
          preferred_language?: string
          timezone?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          total_bookings?: number
          total_spent?: number
          favorite_rooms?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          role?: UserRole
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          avatar_url?: string | null
          preferred_language?: string
          timezone?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          total_bookings?: number
          total_spent?: number
          favorite_rooms?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      escape_rooms: {
        Row: {
          id: string
          organization_id: string
          name: string
          slug: string
          description: string | null
          story: string | null
          image_url: string | null
          gallery_urls: string[] | null
          min_players: number
          max_players: number
          duration_minutes: number
          difficulty_level: number | null
          base_price: number
          weekend_price: number | null
          holiday_price: number | null
          group_discount_threshold: number
          group_discount_percentage: number
          status: RoomStatus
          is_bookable: boolean
          advance_booking_days: number
          min_advance_hours: number
          meta_title: string | null
          meta_description: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          slug: string
          description?: string | null
          story?: string | null
          image_url?: string | null
          gallery_urls?: string[] | null
          min_players?: number
          max_players?: number
          duration_minutes?: number
          difficulty_level?: number | null
          base_price: number
          weekend_price?: number | null
          holiday_price?: number | null
          group_discount_threshold?: number
          group_discount_percentage?: number
          status?: RoomStatus
          is_bookable?: boolean
          advance_booking_days?: number
          min_advance_hours?: number
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          slug?: string
          description?: string | null
          story?: string | null
          image_url?: string | null
          gallery_urls?: string[] | null
          min_players?: number
          max_players?: number
          duration_minutes?: number
          difficulty_level?: number | null
          base_price?: number
          weekend_price?: number | null
          holiday_price?: number | null
          group_discount_threshold?: number
          group_discount_percentage?: number
          status?: RoomStatus
          is_bookable?: boolean
          advance_booking_days?: number
          min_advance_hours?: number
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          organization_id: string
          room_id: string
          customer_id: string | null
          booking_date: string
          start_time: string
          end_time: string
          duration_minutes: number
          customer_name: string
          customer_email: string
          customer_phone: string | null
          number_of_players: number
          player_names: string[] | null
          special_requests: string | null
          base_price: number
          discount_amount: number
          tax_amount: number
          total_amount: number
          payment_status: PaymentStatus
          payment_method: string | null
          payment_intent_id: string | null
          paid_at: string | null
          status: BookingStatus
          confirmed_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          assigned_game_master_id: string | null
          game_master_notes: string | null
          internal_notes: string | null
          booking_source: string
          reminder_sent_at: string | null
          confirmation_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          room_id: string
          customer_id?: string | null
          booking_date: string
          start_time: string
          end_time: string
          duration_minutes: number
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          number_of_players: number
          player_names?: string[] | null
          special_requests?: string | null
          base_price: number
          discount_amount?: number
          tax_amount?: number
          total_amount: number
          payment_status?: PaymentStatus
          payment_method?: string | null
          payment_intent_id?: string | null
          paid_at?: string | null
          status?: BookingStatus
          confirmed_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          assigned_game_master_id?: string | null
          game_master_notes?: string | null
          internal_notes?: string | null
          booking_source?: string
          reminder_sent_at?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          room_id?: string
          customer_id?: string | null
          booking_date?: string
          start_time?: string
          end_time?: string
          duration_minutes?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          number_of_players?: number
          player_names?: string[] | null
          special_requests?: string | null
          base_price?: number
          discount_amount?: number
          tax_amount?: number
          total_amount?: number
          payment_status?: PaymentStatus
          payment_method?: string | null
          payment_intent_id?: string | null
          paid_at?: string | null
          status?: BookingStatus
          confirmed_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          assigned_game_master_id?: string | null
          game_master_notes?: string | null
          internal_notes?: string | null
          booking_source?: string
          reminder_sent_at?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      room_availability_templates: {
        Row: {
          id: string
          room_id: string
          day_of_week: number | null
          start_time: string
          end_time: string
          max_concurrent_bookings: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          day_of_week?: number | null
          start_time: string
          end_time: string
          max_concurrent_bookings?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          day_of_week?: number | null
          start_time?: string
          end_time?: string
          max_concurrent_bookings?: number
          is_active?: boolean
          created_at?: string
        }
      }
      room_availability_exceptions: {
        Row: {
          id: string
          room_id: string
          exception_date: string
          is_closed: boolean
          custom_start_time: string | null
          custom_end_time: string | null
          custom_price: number | null
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          exception_date: string
          is_closed?: boolean
          custom_start_time?: string | null
          custom_end_time?: string | null
          custom_price?: number | null
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          exception_date?: string
          is_closed?: boolean
          custom_start_time?: string | null
          custom_end_time?: string | null
          custom_price?: number | null
          reason?: string | null
          created_at?: string
        }
      }
      booking_reviews: {
        Row: {
          id: string
          booking_id: string
          organization_id: string
          overall_rating: number | null
          room_rating: number | null
          staff_rating: number | null
          value_rating: number | null
          review_title: string | null
          review_text: string | null
          would_recommend: boolean | null
          is_public: boolean
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          organization_id: string
          overall_rating?: number | null
          room_rating?: number | null
          staff_rating?: number | null
          value_rating?: number | null
          review_title?: string | null
          review_text?: string | null
          would_recommend?: boolean | null
          is_public?: boolean
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          organization_id?: string
          overall_rating?: number | null
          room_rating?: number | null
          staff_rating?: number | null
          value_rating?: number | null
          review_title?: string | null
          review_text?: string | null
          would_recommend?: boolean | null
          is_public?: boolean
          is_verified?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      daily_booking_stats: {
        Row: {
          organization_id: string
          booking_date: string
          total_bookings: number
          confirmed_bookings: number
          completed_bookings: number
          cancelled_bookings: number
          total_revenue: number
          avg_group_size: number
        }
      }
      room_performance_stats: {
        Row: {
          room_id: string
          room_name: string
          organization_id: string
          total_bookings: number
          completed_bookings: number
          total_revenue: number
          avg_rating: number
          total_reviews: number
        }
      }
    }
    Functions: {
      check_room_availability: {
        Args: {
          room_uuid: string
          booking_date: string
          start_time: string
          end_time: string
        }
        Returns: boolean
      }
      calculate_booking_price: {
        Args: {
          room_uuid: string
          booking_date: string
          number_of_players: number
        }
        Returns: number
      }
      is_admin_or_manager: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
      get_user_organization: {
        Args: {}
        Returns: string
      }
    }
  }
}

// Utility types for easier use
export type Organization = Database['public']['Tables']['organizations']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type EscapeRoom = Database['public']['Tables']['escape_rooms']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingReview = Database['public']['Tables']['booking_reviews']['Row']
export type RoomAvailabilityTemplate = Database['public']['Tables']['room_availability_templates']['Row']
export type RoomAvailabilityException = Database['public']['Tables']['room_availability_exceptions']['Row']

// Insert types
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type EscapeRoomInsert = Database['public']['Tables']['escape_rooms']['Insert']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingReviewInsert = Database['public']['Tables']['booking_reviews']['Insert']

// Update types
export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type EscapeRoomUpdate = Database['public']['Tables']['escape_rooms']['Update']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

// View types
export type DailyBookingStats = Database['public']['Views']['daily_booking_stats']['Row']
export type RoomPerformanceStats = Database['public']['Views']['room_performance_stats']['Row']