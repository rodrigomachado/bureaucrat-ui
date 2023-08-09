import React from "react"

import Header from "../layout/Header"
import IconButton, { Color } from "../layout/IconButton"

import s from './EntityList.css'

type User = {
  id: string,
  first_name: string,
  middle_name: string,
  last_name: string,
  birth_date: string,
}

function userDisplay(user: User) {
  return `${user.first_name} ${user.last_name}`
}

type EntityListProps = {
  users: User[]
}
const EntityList = ({ users }: EntityListProps) => {
  return (
    <div className={s.main}>
      <Header title="Users" controls={[
        <IconButton label="+" color={Color.LIGHT} />,
        <IconButton label="🔎" color={Color.LIGHT} />
      ]} />
      <div className={s.entities}>
        {users.map(user => (
          <div className={s.entity}>{userDisplay(user)}</div>
        ))}
      </div>
    </div>
  )
}

export default EntityList
