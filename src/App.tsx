import { Empty, Layout } from 'antd'
import React, { useState } from 'react'

import { Api, useQueryApi } from './api'
import { Entity, EntityMeta } from './entity'
import EntityList from './entity/EntityList'
import EntitySheet from './entity/EntitySheet'

import s from './App.css'

const api = new Api()

const App = () => {
  // State: type , selectedType
  const [selectedType, setSelectedType] = useState<EntityMeta | null>(null)
  const types = useQueryApi(async (signal) => {
    const types = await api.entityTypes({ signal })
    if (types.length && !selectedType) setSelectedType(types[0])
    return types
  })

  // State: entities, selectedEntity, updateEntity
  const entities = useQueryApi(async (signal) => {
    if (!types.data || !selectedType) return []
    return api.entities({ entityType: selectedType!, signal })
  }, [selectedType, types.loading, types.error])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)

  const saveEntity = async (type: EntityMeta, entity: Entity) => {
    const saved = await (
      entity.new ?
        api.createEntity({ entityType: type, entity }) :
        api.updateEntity({ entityType: type, entity })
    )
    await entities.reload()
    setSelectedEntity(saved)
  }

  const newEntity = selectedType && (() => {
    setSelectedEntity(selectedType.createEntity())
  })

  return (
    <Layout hasSider className={s.main}>
      <EntityList
        types={types}
        selectedType={selectedType} onTypeSelected={setSelectedType}
        entities={entities} onEntitySelected={setSelectedEntity}
        onNewEntity={newEntity}
      />
      {(!selectedType || !selectedEntity) ? (
        <Layout className={s.emptyLayout}>
          <Empty description={selectedType ?
            `No ${selectedType.name} selected` :
            'No data selected'
          } />
        </Layout>
      ) : (
        <EntitySheet
          key={selectedEntity.key}
          type={selectedType}
          initialValue={selectedEntity}
          onSave={
            (updated: Entity) => saveEntity(selectedType, updated)
          }
        />
      )}
    </Layout>
  )
}

export default App
