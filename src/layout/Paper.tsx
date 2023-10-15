import React from 'react'

import s from './Paper.css'

export function Paper({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.main}>
      {children}
    </div>
  )
}
