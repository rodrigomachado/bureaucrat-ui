import { notification } from 'antd'
import { NotificationInstance } from 'antd/es/notification/interface'
import React, { createContext, useContext } from 'react'

const NotificationContext = createContext<NotificationInstance | null>(null)

type NotificationProviderProps = {
  children: React.ReactNode,
}
export function NotificationProvider({ children }: NotificationProviderProps) {
  const [api, contextHolder] = notification.useNotification()
  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification(): NotificationInstance {
  const api = useContext(NotificationContext)
  if (!api) throw new Error(
    'Notification context not found. ' +
    'Check if the NotificationProvider component was applied up in the ' +
    'React component tree.',
  )
  return api
}
