import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Calendar, Home, MapPin, Users, Settings, LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Reservas', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Salas', href: '/dashboard/rooms', icon: MapPin },
    { name: 'Clientes', href: '/dashboard/customers', icon: Users },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">
              Escape Booking
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t px-4 py-4">
            <div className="flex items-center mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.name || user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.organizations?.[0]?.name || 'Sin organización'}
                </p>
              </div>
            </div>
            <form action={handleSignOut}>
              <Button 
                variant="outline" 
                size="sm" 
                type="submit"
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {children}
      </div>
    </div>
  )
}
