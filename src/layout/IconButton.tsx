import React from "react"
import s from './IconButton.css'
import { cs } from "."

export enum Color {
  DARK = 'dark',
  LIGHT = 'light',
}

const colorMapper = new Map([
  [Color.DARK, s.dark],
  [Color.LIGHT, s.light]
])

type IconButtonProps = {
  label: string,
  color?: Color,
}
const IconButton = ({ label, color = Color.DARK }: IconButtonProps) => {
  return (
    <div className={cs(s.main, colorMapper.get(color))}>
      {label}
    </div>
  )
}

export default IconButton
