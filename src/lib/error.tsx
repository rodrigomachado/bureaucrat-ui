import { Button, Modal } from 'antd'
import React, { createContext, useContext, useState } from 'react'

const ErrorContext = createContext<{
  errors: any[], setErrors?: React.Dispatch<React.SetStateAction<any[]>>
}>({ errors: [] })

type ErrorDialogProviderProps = {
  children: React.ReactNode,
}
export function ErrorDialogProvider({ children }: ErrorDialogProviderProps) {
  const [errors, setErrors] = useState<any[]>([])
  return (
    <ErrorContext.Provider value={{ errors, setErrors }}>
      {children}
      <ErrorDialog />
    </ErrorContext.Provider>
  )
}

export function useErrorEmitter(): (error: any) => void {
  const { errors, setErrors } = useContext(ErrorContext)
  if (!setErrors) throw new Error(
    'Error dialog context not found. ' +
    'Check if the ErrorDialogProvider component was applied up in the ' +
    'React component tree.',
  )
  return (error: any) => {
    if (!error) return
    setErrors([...errors, error])
  }
}

const ErrorDialog = () => {
  const { errors, setErrors } = useContext(ErrorContext)
  if (!setErrors) throw new Error('ErrorContext not found.')
  const close = () => setErrors([])

  return (
    <Modal
      title='Errors'
      centered
      open={!!errors.length}
      onOk={close}
      onCancel={close}
      footer={[
        <Button
          key='ok'
          type='primary'
          onClick={close}
          autoFocus
        >Ok</Button>,
      ]}
      width={1000}
    >
      <ul>
        {errors.map(e => (
          <li key={e}>{e.toString()}</li>
        ))}
      </ul>
    </Modal>
  )
}
