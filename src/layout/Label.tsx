import React from "react"
import s from './Label.css'
import { cs } from "."

export enum Size {
  Medium = 'medium',
  Large = 'large',
}

const sizeMap = new Map([
  [Size.Medium, s.medium],
  [Size.Large, s.large],
])

type LabelProps = {
  children: React.ReactNode,
  size?: Size,
}
const Label = ({ children, size = Size.Medium }: LabelProps) => {
  return (
    <div className={cs(s.heading, sizeMap.get(size))}>
      {children}
    </div>
  )
}

export default Label
