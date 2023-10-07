import { Tooltip as AntTooltip } from 'antd'
import React from 'react'

import s from './Tooltip.css'

type TooltipProps = {
  title: string,
  shortcut?: string,
  children: React.ReactNode,
}
export function Tooltip({ title, shortcut, children }: TooltipProps) {
  const contents = shortcut ? (<div className={s.contents}>
    {title}<br />
    <span className={s.shortcut}>{shortcut}</span>
  </div>) : title

  return (
    <AntTooltip
      title={contents}
      className={s.main}
    >{children}</AntTooltip>
  )
}
