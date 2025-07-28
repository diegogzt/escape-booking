import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select(`
      id,
      name,
      role,
      organization_id,
      organizations!inner(
        id,
        name,
        slug,
        subscription_plan
      )
    `)
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Panel Principal
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido al Dashboard!
          </h2>
          <p className="mt-2 text-gray-600">
            Gestiona tus escape rooms, reservas y clientes desde aquí.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reservas
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                +0% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Salas Activas
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Salas configuradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos del Mes
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">
                +0% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Activos
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Clientes registrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Gestiona tu escape room fácilmente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/bookings">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Crear Nueva Reserva
                </Button>
              </Link>
              <Link href="/dashboard/rooms">
                <Button variant="outline" className="w-full">
                  Gestionar Salas
                </Button>
              </Link>
              <Link href="/dashboard/bookings">
                <Button variant="outline" className="w-full">
                  Ver Calendario
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>
                Información de tu cuenta y configuración
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Plan actual:</span>
                <span className="text-sm font-medium capitalize">
                  {profile?.organizations?.[0]?.subscription_plan || 'Free'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Estado:</span>
                <span className="text-sm text-green-600 font-medium">
                  ✅ Activo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Base de datos:</span>
                <span className="text-sm text-green-600 font-medium">
                  ✅ Conectada
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
