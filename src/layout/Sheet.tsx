import React from 'react'

import { cx } from '../lib/classnames'

import s from './Sheet.css'

type SheetProps = {
  children: React.ReactNode,
  className?: string,
  slim?: boolean,
}
export function Sheet({ children, className, slim = false }: SheetProps) {
  return (
    <div className={cx(s.main, className, slim ? s.slim : s.normal)}>
      {children}
    </div>
  )
}
