import React from "react"

import Label, { Size } from "./Label"
import s from './Header.css'

type HeaderProps = {
  title?: string,
  controls: React.ReactNode[],
}
const Header = ({ title, controls }: HeaderProps) => {
  return (
    <div className={s.main}>
      <div className={s.label}><Label size={Size.Large}>{title}</Label></div>
      <div className={s.controls}>
        {controls}
      </div>
    </div>
  )
}

export default Header
