import React from "react"

import Header from "../layout/Header"
import IconButton, { Color } from "../layout/IconButton"

import s from './EntityList.css'

type EntityListProps = {}
const EntityList = ({ }: EntityListProps) => {
  return (
    <div className={s.main}>
      <Header title="Users" controls={[
        <IconButton label="+" color={Color.LIGHT} />,
        <IconButton label="🔎" color={Color.LIGHT} />
      ]} />
      <div className={s.entities}>
        <div className={s.entity}>Jon Doe</div>
        <div className={s.entity}>Jane Doe</div>
      </div>
    </div>
  )
}

export default EntityList
