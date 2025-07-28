import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, Users, MapPin, Plus } from 'lucide-react'

export default async function RoomsPage() {
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

  // Get rooms for the organization
  const { data: rooms } = await supabase
    .from('rooms')
    .select(`
      id,
      name,
      description,
      capacity,
      duration_minutes,
      base_price,
      status,
      difficulty_level,
      theme,
      image_url,
      location:locations(
        id,
        name,
        address_line1,
        city
      )
    `)
    .eq('organization_id', userProfile?.organization_id)
    .order('name')

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Salas
              </h1>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sala
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!rooms || rooms.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <MapPin className="h-24 w-24" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No hay salas configuradas
            </h3>
            <p className="mt-1 text-gray-500">
              Comienza creando tu primera escape room
            </p>
            <div className="mt-6">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Sala
              </Button>
            </div>
          </div>
        ) : (
          // Rooms Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {room.image_url ? (
                    <img
                      src={room.image_url}
                      alt={room.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{room.name}</CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : room.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {room.status === 'active' ? 'Activa' : 
                       room.status === 'maintenance' ? 'Mantenimiento' : 'Inactiva'}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {room.description || 'Sin descripción'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{room.capacity} jugadores</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{room.duration_minutes} min</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Dificultad: {room.difficulty_level}/5</span>
                      <span className="font-semibold text-red-600">
                        ${room.base_price?.toLocaleString()}
                      </span>
                    </div>
                    
                    {room.theme && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Tema:</span> {room.theme}
                      </div>
                    )}
                    
                    {room.location && Array.isArray(room.location) && room.location.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Ubicación:</span> {room.location[0].name}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Horarios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
