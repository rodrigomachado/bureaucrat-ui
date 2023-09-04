import { Avatar, Button, Empty, List, Skeleton, Space, Tooltip } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { FilterFilled, PlusSquareFilled, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import React from 'react'

import { Entity } from '.'
import { ApiData } from '../api'
import Header from '../layout/Header'
import { emitError } from '../error'

import s from './EntityList.css'

type EntityListProps = {
  entities: ApiData<Entity[]>,
  onEntitySelected: (entity: Entity) => void,
}
const EntityList = ({ entities, onEntitySelected }: EntityListProps) => (<>
  <Header title='Users'>
    <Space.Compact block>
      <Tooltip title='New'><Button icon={<PlusSquareFilled />} /></Tooltip>
      <Tooltip title='Search'><Button icon={<FilterFilled />} /></Tooltip>
      <Tooltip title='Reload'><Button icon={<ReloadOutlined />} onClick={entities.reload} /></Tooltip>
    </Space.Compact>
  </Header>
  <Content className={s.content}>
    <LoadedSuccessfully entities={entities}>{data => (
      <List
        itemLayout='horizontal'
        dataSource={data}
        rowKey={entity => entity.key()}
        renderItem={entity => {
          const listData = entity.listData()
          return (
            <List.Item onClick={() => onEntitySelected(entity)}>
              <List.Item.Meta
                className={s.entityItem}
                avatar={<Avatar icon={<UserOutlined />} />}
                title={listData.short}
                description={listData.long}
              />
            </List.Item>
          )
        }} />
    )}</LoadedSuccessfully>
  </Content>
</>)

export default EntityList

type LoadedSuccessfullyProps = {
  entities: ApiData<Entity[]>,
  children: (data: Entity[]) => React.ReactNode
}
function LoadedSuccessfully({ entities: { data, loading, error }, children }: LoadedSuccessfullyProps) {
  emitError(error)
  if (error) {
    return (<Empty />)
  }

  if (loading) return (
    <List itemLayout='horizontal'>
      <List.Item>
        <Skeleton active avatar={{ shape: 'circle' }} paragraph={false} />
      </List.Item>
      <List.Item>
        <Skeleton active avatar={{ shape: 'circle' }} paragraph={false} />
      </List.Item>
      <List.Item>
        <Skeleton active avatar={{ shape: 'circle' }} paragraph={false} />
      </List.Item>
    </List>
  )

  if (!data) throw new Error('No data available for non-loading, non-error entites')
  return children(data)
}
