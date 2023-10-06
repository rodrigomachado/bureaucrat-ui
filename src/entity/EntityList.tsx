import {
  Avatar, Button, Dropdown, Empty, List, Skeleton, Space, Tooltip, Typography,
} from 'antd'
import { Content } from 'antd/lib/layout/layout'
import {
  CaretDownOutlined, FilterFilled, PlusSquareFilled, ReloadOutlined, FireFilled,
} from '@ant-design/icons'
import React from 'react'

import { Entity, EntityMeta } from './entity'
import { ApiData } from '../api'
import Header from '../layout/Header'
import { emitError } from '../error'

import s from './EntityList.css'

type EntityListProps = {
  types: ApiData<EntityMeta[]>,
  selectedType: EntityMeta | null,
  onTypeSelected: (type: EntityMeta) => void,
  entities: ApiData<Entity[]>,
  onEntitySelected: (entity: Entity | null) => void,
}
const EntityList = ({
  types,
  selectedType, onTypeSelected,
  entities, onEntitySelected,
}: EntityListProps) => {
  const onSelect = (type: EntityMeta) => {
    onTypeSelected(type)
    onEntitySelected(null)
  }

  return (<>
    <Header title={
      <EntityTypeSelector
        selected={selectedType} options={types} onSelected={onSelect}
      />
    }>
      <Space.Compact block>
        <Tooltip title='New'><Button icon={<PlusSquareFilled />} /></Tooltip>
        <Tooltip title='Search'><Button icon={<FilterFilled />} /></Tooltip>
        <Tooltip title='Reload'>
          <Button icon={<ReloadOutlined />} onClick={entities.reload} />
        </Tooltip>
      </Space.Compact>
    </Header>
    <Content className={s.content}>
      <LoadedSuccessfully
        type={selectedType} entities={entities}
      >{(type, data) => (
        <List
          itemLayout='horizontal'
          dataSource={data}
          rowKey={entity => type.keyFor(entity)}
          renderItem={entity => {
            const titleFormat = type.formatTitle(entity)
            return (
              <List.Item onClick={() => onEntitySelected(entity)}>
                <List.Item.Meta
                  className={s.entityItem}
                  avatar={<Avatar icon={<FireFilled />} />}
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

const EntityTypeSelector = (
  { selected, options, onSelected }: EntityTypeSelectorProps,
) => {
  if (!options.data || !selected) return <Skeleton />
  const keyToType = new Map<string, EntityMeta>(
    options.data.map(o => [o.code, o]),
  )
  return (
    <Dropdown menu={{
      items: options.data.map(o => ({
        key: o.code, label: o.name, disabled: o.code === selected.code,
      })),
      onClick: ({ key }) => onSelected(keyToType.get(key)!),
    }}>
      <Typography.Title>{
        selected.name
      } <CaretDownOutlined style={{ fontSize: '0.5em' }} /></Typography.Title>
    </Dropdown >
  )
}

type LoadedSuccessfullyProps = {
  type: EntityMeta | null,
  entities: ApiData<Entity[]>,
  children: (type: EntityMeta, data: Entity[]) => React.ReactNode
}
function LoadedSuccessfully({
  type,
  entities: { data, loading, error },
  children,
}: LoadedSuccessfullyProps) {
  emitError(error)
  if (error) return (<Empty />)
  if (!type) return (<Empty />)

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

  if (!data) throw new Error(
    'No data available for non-loading, non-error entites',
  )
  return children(type, data)
}
