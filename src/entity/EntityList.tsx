import React from 'react'

import { Entity } from '.'
import Header from '../layout/Header'
import IconButton, { Color } from '../layout/IconButton'
import Loading from '../layout/Loading'

import s from './EntityList.css'

type EntityListProps = {
  entities: { data?: Entity[], loading: boolean, errors: any },
}
const EntityList = ({ entities }: EntityListProps) => {
  return (
    <div className={s.main}>
      <Header title="Users">
        <IconButton label="+" color={Color.LIGHT} />
        <IconButton label="🔎" color={Color.LIGHT} />
      </Header>
      <LoadError entities={entities}>{data => (
        <div className={s.entities}>
          {data.map(e => (
            <div
              key={e.key()}
              className={s.entity}
            >{e.listData().displayName}</div>
          ))}
        </div>
      )}</LoadError>
    </div>
  )
}

export default EntityList

type LoadErorrProps = {
  entities: {
    data?: Entity[],
    loading: boolean,
    errors: any,
  },
  children: (data: Entity[]) => React.ReactNode
}
function LoadError({ entities: { data, loading, errors }, children }: LoadErorrProps) {
  if (errors) return (
    // TODO Better error UI
    <div>Error: {'' + errors}</div>
  )

  if (loading) return (<Loading />)

  if (!data) throw new Error('No data available for non-loading, non-error entites')
  return children(data)
}
