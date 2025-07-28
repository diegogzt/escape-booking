'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'

interface BookingData {
  id: string
  booking_date: string
  status: string
}

interface BookingCalendarProps {
  selectedDate: string
  bookingData: BookingData[]
}

export function BookingCalendar({ selectedDate, bookingData }: BookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date(selectedDate))

  // Group bookings by date
  const bookingsByDate = bookingData.reduce((acc, booking) => {
    const dateKey = booking.booking_date
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(booking)
    return acc
  }, {} as Record<string, BookingData[]>)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      const dateStr = selectedDate.toISOString().split('T')[0]
      window.location.href = `?date=${dateStr}`
    }
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-md border"
      />
      
      {/* Booking summary for selected date */}
      {date && (
        <div className="text-sm">
          <div className="font-medium mb-2">
            {date.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'short' 
            })}
          </div>
          {(() => {
            const dateKey = date.toISOString().split('T')[0]
            const dayBookings = bookingsByDate[dateKey] || []
            return dayBookings.length > 0 ? (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {dayBookings.length} reserva{dayBookings.length !== 1 ? 's' : ''}
              </Badge>
            ) : (
              <span className="text-gray-500">Sin reservas</span>
            )
          })()}
        </div>
      )}
      
      {/* Legend */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
          <span>Días con reservas</span>
        </div>
      </div>
    </div>
  )
}
