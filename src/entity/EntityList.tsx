import React, { useContext } from 'react'

import { Entity } from '.'
import { ApiData } from '../api'
import { emitError } from '../error'
import Header from '../layout/Header'
import IconButton, { Color } from '../layout/IconButton'
import Loading from '../layout/Loading'

import s from './EntityList.css'

type EntityListProps = {
  entities: ApiData<Entity[]>,
}
const EntityList = ({ entities }: EntityListProps) => {
  return (
    <div className={s.main}>
      <Header title="Users">
        <IconButton label="+" color={Color.LIGHT} />
        <IconButton label="🔎" color={Color.LIGHT} />
      </Header>
      <LoadedSuccessfully entities={entities}>{data => (
        <div className={s.entities}>
          {data.map(e => (
            <div
              key={e.key()}
              className={s.entity}
            >{e.listData().displayName}</div>
          ))}
        </div>
      )}</LoadedSuccessfully>
    </div>
  )
}

export default EntityList

type LoadedSuccessfullyProps = {
  entities: ApiData<Entity[]>,
  children: (data: Entity[]) => React.ReactNode
}
function LoadedSuccessfully({ entities: { data, loading, error }, children }: LoadedSuccessfullyProps) {
  emitError(error)
  if (error) {
    return (
      // TODO Offer user the reload option
      < div > Error: {
        '' + error
      }</div >
    )
  }

  if (loading) return (<Loading />)

  if (!data) throw new Error('No data available for non-loading, non-error entites')
  return children(data)
}
