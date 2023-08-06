import React from "react"
import s from './Paper.css'

type PaperProps = {
  children: React.ReactNode,
}
const Paper = ({ children }: PaperProps) => {
  return (
    <div className={s.main}>
      {children}
    </div>
  )
}

export default Paper
