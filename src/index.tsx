import { ConfigProvider, theme } from 'antd'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ErrorDialogProvider } from './lib/error'
import { NotificationProvider } from './lib/notification'
import App from './App'

import './index.css'

createRoot(document.getElementById('app-root')!).render(
  <StrictMode>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <ErrorDialogProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider >
      </ErrorDialogProvider >
    </ConfigProvider >
  </StrictMode>
)

