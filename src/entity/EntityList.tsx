import React from "react"

import { Entity } from "."
import Header from "../layout/Header"
import IconButton, { Color } from "../layout/IconButton"

import s from './EntityList.css'

type EntityListProps = {
  entities?: Entity[],
}
const EntityList = ({ entities }: EntityListProps) => {
  return (
    <div className={s.main}>
      <Header title="Users">
        <IconButton label="+" color={Color.LIGHT} />
        <IconButton label="🔎" color={Color.LIGHT} />
      </Header>
      <div className={s.entities}>
        {entities?.map(e => (
          <div
            key={e.key()}
            className={s.entity}
          >{e.listData().displayName}</div>
        ))}
      </div>
    </div>
  )
}

export default EntityList
