import { Modal, notification } from 'antd'
import { NotificationInstance } from 'antd/es/notification/interface'
import React, { createContext, useContext, useState } from 'react'

const NotificationContext = createContext<NotificationInstance | null>(null)
const DialogsContext = createContext<DialogsContextInstance | null>(null)

type NotificationProviderProps = {
  children: React.ReactNode,
}
export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, notificationsHolder] = notification.useNotification()
  const [dialogs, setDialogs] = useState<Dialog[]>([])
  return (
    <NotificationContext.Provider value={notifications}>
      <DialogsContext.Provider value={{ dialogs, setDialogs }}>
        {children}
        <DialogsHolder dialogs={dialogs} />
      </DialogsContext.Provider>
      {notificationsHolder}
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


type Dialog = {
  key: string
  title: string
  content: string
  open: boolean
  onOk?: (() => void)
  onCancel?: (() => void)
  afterClose?: (() => void)
}
type DialogsSetter = (dialogSetter: ((dialogs: Dialog[]) => Dialog[])) => void
type DialogsContextInstance = { dialogs: Dialog[], setDialogs: DialogsSetter }

export function useDialogs(): DialogsApi {
  const api = useContext(DialogsContext)
  if (!api) throw new Error(
    'Dialogs context not found. ' +
    'Check if the NotificationProvider component was applied up in the ' +
    'React component tree.',
  )
  return new DialogsApi(api.dialogs, api.setDialogs)
}

class DialogsApi {
  private dialogs: Dialog[]
  private setDialogs: DialogsSetter

  constructor(dialogs: Dialog[], setDialogs: DialogsSetter) {
    this.dialogs = dialogs
    this.setDialogs = setDialogs
  }

  async confirm(
    { title, content }: { title: string, content: string },
  ) {
    return new Promise<boolean>((res) => {
      const key = crypto.randomUUID()
      const confirmCallback = (confirmed: boolean) => () => {
        this.setDialogs((dialogs: Dialog[]) => {
          const index = dialogs.findIndex(d => d.key === key)
          if (index < 0) throw new Error(`Dialog ${key} not found`)
          return [
            ...dialogs.slice(0, index - 1),
            { ...dialogs[index], open: false },
            ...dialogs.slice(index + 1, dialogs.length),
          ]
        })
        res(confirmed)
      }
      this.setDialogs(dialogs => [...dialogs, {
        key,
        title, content,
        open: true,
        onOk: confirmCallback(true),
        onCancel: confirmCallback(false),
        afterClose: () => this.setDialogs(
          dialogs => dialogs.filter(x => x.key !== key),
        ),
      }])
    })
  }
}

function DialogsHolder({ dialogs }: { dialogs: Dialog[] }) {
  return dialogs.map(d => (
    <Modal
      key={d.key}
      title={d.title}
      open={d.open}
      onOk={d.onOk}
      onCancel={d.onCancel}
      afterClose={d.afterClose}
    >{d.content}</Modal>
  ))
}
