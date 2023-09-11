import { Avatar, Button, Dropdown, Empty, List, Skeleton, Space, Tooltip, Typography } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import {
  CaretDownOutlined, FilterFilled, PlusSquareFilled, ReloadOutlined, UserOutlined,
} from '@ant-design/icons'
import React from 'react'

import { Entity, EntityMeta } from '.'
import { ApiData } from '../api'
import Header from '../layout/Header'
import { emitError } from '../error'

import s from './EntityList.css'

type EntityListProps = {
  entityTypes: ApiData<EntityMeta[]>,
  selectedEntityType: EntityMeta | null,
  onEntityTypeSelected: (type: EntityMeta) => void,
  entities: ApiData<Entity[]>,
  onEntitySelected: (entity: Entity | null) => void,
}
const EntityList = ({
  entityTypes,
  selectedEntityType, onEntityTypeSelected,
  entities, onEntitySelected,
}: EntityListProps) => {
  const onSelectorSelect = (entityType: EntityMeta) => {
    onEntityTypeSelected(entityType)
    onEntitySelected(null)
  }

  return (<>
    <Header title={
      <EntityTypeSelector
        selected={selectedEntityType} options={entityTypes} onSelected={onSelectorSelect}
      />
    }>
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
            const titleFormat = entity.titleFormat()
            return (
              <List.Item onClick={() => onEntitySelected(entity)}>
                <List.Item.Meta
                  className={s.entityItem}
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={titleFormat.title}
                  description={titleFormat.subtitle}
                />
              </List.Item>
            )
          }} />
      )}</LoadedSuccessfully>
    </Content>
  </>)
}

export default EntityList

type EntityTypeSelectorProps = {
  selected: EntityMeta | null,
  options: ApiData<EntityMeta[]>,
  onSelected: (entityType: EntityMeta) => void,
}

const EntityTypeSelector = ({ selected, options, onSelected }: EntityTypeSelectorProps) => {
  if (!options.data || !selected) return <Skeleton />
  const keyToType = new Map<string, EntityMeta>(options.data.map(o => [o.id.toString(), o]))
  return (
    <Dropdown menu={{
      items: options.data.map(o => ({
        key: o.id, label: o.name, disabled: o.id === selected.id,
      })),
      onClick: ({ key }) => onSelected(keyToType.get(key)!),
    }}>
      <Typography.Title>{selected.name} <CaretDownOutlined style={{ fontSize: '0.5em' }} /></Typography.Title>
    </Dropdown >
  )
}

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
