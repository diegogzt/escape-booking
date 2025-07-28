import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type Tables = Database['public']['Tables']

export class SupabaseService {
  // Organizations
  async getOrganization(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async createOrganization(organization: Tables['organizations']['Insert']) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('organizations')
      .insert(organization)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Profiles
  async getProfile(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        organizations (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async updateProfile(id: string, updates: Tables['profiles']['Update']) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Escape Rooms
  async getEscapeRooms(organizationId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('escape_rooms')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .order('name')

    if (error) throw error
    return data
  }

  async getEscapeRoom(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('escape_rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async createEscapeRoom(room: Tables['escape_rooms']['Insert']) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('escape_rooms')
      .insert(room)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Bookings
  async getBookings(organizationId: string, filters?: {
    status?: string
    dateFrom?: string
    dateTo?: string
    escapeRoomId?: string
  }) {
    const supabase = await createClient()
    let query = supabase
      .from('bookings')
      .select(`
        *,
        escape_rooms (name),
        game_masters (name),
        payments (*)
      `)
      .eq('organization_id', organizationId)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.dateFrom) {
      query = query.gte('booking_date', filters.dateFrom)
    }

    if (filters?.dateTo) {
      query = query.lte('booking_date', filters.dateTo)
    }

    if (filters?.escapeRoomId) {
      query = query.eq('escape_room_id', filters.escapeRoomId)
    }

    const { data, error } = await query.order('booking_date', { ascending: false })

    if (error) throw error
    return data
  }

  async createBooking(booking: Tables['bookings']['Insert']) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateBooking(id: string, updates: Tables['bookings']['Update']) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Game Masters
  async getGameMasters(organizationId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('game_masters')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  }

  // Availability
  async checkRoomAvailability(
    roomId: string,
    date: string,
    startTime: string,
    duration = 60
  ) {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('check_room_availability', {
      room_id: roomId,
      booking_date: date,
      start_time: startTime,
      duration,
    })

    if (error) throw error
    return data
  }

  // Analytics
  async getOrganizationStats(organizationId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_organization_stats', {
      org_id: organizationId,
    })

    if (error) throw error
    return data
  }

  // AI Recommendations
  async getBookingRecommendations(
    organizationId: string,
    roomId: string,
    date: string,
    numPlayers: number
  ) {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_booking_recommendations', {
      org_id: organizationId,
      room_id: roomId,
      requested_date: date,
      num_players: numPlayers,
    })

    if (error) throw error
    return data
  }

  // Auth helpers
  async getCurrentUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  async signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}
