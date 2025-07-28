import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Plus, Clock, Users, MapPin } from 'lucide-react'
import { BookingCalendar } from '@/components/booking/booking-calendar'

interface PageProps {
  searchParams: {
    date?: string
    room?: string
  }
}

export default async function BookingsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth')
  }

  // Get user's organization
  const { data: userProfile } = await supabase
    .from('users')
    .select(`
      id,
      organization_id,
      organizations!inner(
        id,
        name
      )
    `)
    .eq('id', user.id)
    .single()

  // Get rooms for filter
  const { data: rooms } = await supabase
    .from('rooms')
    .select('id, name, status')
    .eq('organization_id', userProfile?.organization_id)
    .eq('status', 'active')
    .order('name')

  // Get bookings for today or selected date
  const selectedDate = searchParams.date || new Date().toISOString().split('T')[0]
  const selectedRoom = searchParams.room

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_date,
      start_time,
      end_time,
      status,
      total_players,
      total_amount,
      customer_name,
      customer_email,
      customer_phone,
      special_requests,
      room_id,
      room:rooms!inner(
        id,
        name,
        capacity
      )
    `)
    .eq('organization_id', userProfile?.organization_id)
    .gte('booking_date', selectedDate)
    .lte('booking_date', selectedDate)
    .order('start_time')

  // Filter by room if selected
  const filteredBookings = selectedRoom 
    ? bookings?.filter(booking => booking.room_id === selectedRoom)
    : bookings

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Calendario de Reservas
              </h1>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reserva
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendario</CardTitle>
                <CardDescription>
                  Selecciona una fecha para ver las reservas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingCalendar 
                  selectedDate={selectedDate}
                  bookingData={bookings || []}
                />
              </CardContent>
            </Card>

            {/* Room Filter */}
            {rooms && rooms.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Filtrar por Sala</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={!selectedRoom ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    Todas las salas
                  </Button>
                  {rooms.map((room) => (
                    <Button
                      key={room.id}
                      variant={selectedRoom === room.id ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      {room.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bookings List */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Reservas para {new Date(selectedDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <p className="text-gray-600">
                {filteredBookings?.length || 0} reservas encontradas
              </p>
            </div>

            {!filteredBookings || filteredBookings.length === 0 ? (
              // Empty State
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No hay reservas para esta fecha
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Las reservas aparecerán aquí cuando los clientes las hagan
                  </p>
                  <div className="mt-6">
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Nueva Reserva
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Bookings Grid
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(`2000-01-01T${booking.start_time}`).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} - {new Date(`2000-01-01T${booking.end_time}`).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>
                                {booking.room && Array.isArray(booking.room) && booking.room.length > 0 
                                  ? booking.room[0].name 
                                  : 'Sala no disponible'}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{booking.total_players} jugadores</span>
                            </div>
                          </div>

                          <div className="mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.customer_name}
                            </h3>
                            <p className="text-gray-600">
                              {booking.customer_email} • {booking.customer_phone}
                            </p>
                          </div>

                          {booking.special_requests && (
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Solicitudes especiales:</span> {booking.special_requests}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {booking.status === 'confirmed' ? 'Confirmada' :
                             booking.status === 'pending' ? 'Pendiente' :
                             booking.status === 'completed' ? 'Completada' :
                             booking.status === 'cancelled' ? 'Cancelada' : 
                             booking.status === 'no_show' ? 'No Show' : booking.status}
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            ${booking.total_amount?.toLocaleString()}
                          </span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
