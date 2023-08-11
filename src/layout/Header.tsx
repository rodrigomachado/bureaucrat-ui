import React from "react"

import Label, { Size } from "./Label"
import s from './Header.css'

type HeaderProps = {
  title?: string,
  children: React.ReactNode,
}
const Header = ({ title, children }: HeaderProps) => {
  return (
    <div className={s.main}>
      <div className={s.label}><Label size={Size.Large}>{title}</Label></div>
      <div className={s.controls}>
        {children}
      </div>
    </div>
  )
}

export default Header
