import React from "react"

import Header from "../layout/Header"
import IconButton from "../layout/IconButton"
import Label from "../layout/Label"

import s from './EntitySheet.css'

type EntitySheetProps = {}
const EntitySheet = ({ }: EntitySheetProps) => {
  return (
    <div className={s.main}>
      <Header>
        <IconButton label="💾" />
        <IconButton label="🗑️" />
        <IconButton label="⚙️" />
      </Header>
      <div className={s.fields}>
        <Field label="First Name" />
        <Field label="Middle Name" />
        <Field label="Last Name" />
        <Field label="Birth Date" />
      </div>
    </div >
  )
}

type FieldProps = {
  label: string,
}
const Field = ({ label }: FieldProps) => {
  return (
    <div>
      <Label>{label}</Label>
      <input className={s.input} type="text" />
    </div>
  )
}

export default EntitySheet
