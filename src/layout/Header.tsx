import { Typography } from 'antd'
import React from 'react'

import s from './Header.css'

type HeaderProps = {
  title: React.ReactNode,
  children: React.ReactNode,
}
const Header = ({ title, children }: HeaderProps) => (
  <div className={s.header}>
    {typeof title === 'string' ? (
      <Typography.Title className={s.title}>
        {title}
      </Typography.Title>
    ) : (
      <div className={s.component}>{title}</div>
    )}
    <div className={s.buttons}>
      {children}
    </div>
  </div>
)

export default Header
