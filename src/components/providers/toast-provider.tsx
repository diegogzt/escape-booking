'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      expand={false}
      richColors
      closeButton
    />
  )
}
