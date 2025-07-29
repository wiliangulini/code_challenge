'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import Alert from '@/components/Alert'

type AlertType = 'success' | 'error' | 'info'

type AlertState = {
  type: AlertType
  message: string
}

type AlertContextType = {
  showAlert: (message: string, type?: AlertType) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<AlertState | null>(null)

  const showAlert = useCallback((message: string, type: AlertType = 'info') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 4000)
  }, [])

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert deve ser usado dentro de AlertProvider')
  }
  return context
}
