import { Typography } from 'antd'
import React from 'react'

import s from './Header.css'

type HeaderProps = {
  title: React.ReactNode,
  children: React.ReactNode,
}
const Header = ({ title, children }: HeaderProps) => (
  <div className={s.header}>
    <div className={s.headerMain}>{
      typeof title === 'string' ? (
        <Typography.Title className={s.headerTitle}>
          {title}
        </Typography.Title>
      ) : title
    } </div>
    <div className={s.headerButtons}>
      {children}
    </div>
  </div>
)

export default Header
