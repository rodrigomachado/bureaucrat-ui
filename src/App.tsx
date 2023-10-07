import { ConfigProvider, Layout, theme } from 'antd'
import React, { useState } from 'react'

import { Api, useQueryApi } from './api'
import { Entity, EntityMeta } from './entity'
import EntityList from './entity/EntityList'
import EntitySheet from './entity/EntitySheet'
import { ErrorContext, ErrorDialog } from './error'

import s from './App.css'

const { Sider } = Layout

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

  const updateEntity = async (type: EntityMeta, entity: Entity) => {
    // TODO Double check IDs did not change?
    // TODO Optimistically update `entity` and `entity.reload(…)` in case of
    // error / abort
    await api.updateEntity({ entityType: type, entity })
    await entities.reload()
    setSelectedEntity(entity)
  }

  // State: errors
  const [errors, setErrors] = useState<any[]>([])

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <ErrorContext.Provider value={{ errors, setErrors }}>
        <Layout hasSider className={s.main}>
          <Sider className={s.sider} width={360}>
            <EntityList
              types={types}
              selectedType={selectedType} onTypeSelected={setSelectedType}
              entities={entities} onEntitySelected={setSelectedEntity}
            />
          </Sider>
          <EntitySheet
            type={selectedType}
            initialValue={selectedEntity}
            onUpdate={(updated: Entity) => updateEntity(selectedType!, updated)}
          />
        </Layout>
        <ErrorDialog />
      </ErrorContext.Provider>
    </ConfigProvider>
  )
}

export default App
