import React, { createContext, useContext, useEffect } from 'react'

export const ErrorContext = createContext<{
  errors: any[], setErrors: React.Dispatch<React.SetStateAction<any[]>>
}>({ errors: [], setErrors: () => { } })

export function emitError(error: any): void {
  const { errors, setErrors } = useContext(ErrorContext)
  useEffect(() => {
    if (!error) return
    setErrors([...errors, error])
    console.error(error)
  }, [error])
}
