import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

createRoot(document.getElementById('app-root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

