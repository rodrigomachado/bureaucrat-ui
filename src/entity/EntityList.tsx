import React from "react"

import Header from "../layout/Header"
import IconButton, { Color } from "../layout/IconButton"

import s from './EntityList.css'

type User = {
  id: string,
  firstName: string,
  middleName: string,
  lastName: string,
  birthDate: string,
}

function userDisplay(user: User) {
  return `${user.firstName} ${user.lastName}`
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
