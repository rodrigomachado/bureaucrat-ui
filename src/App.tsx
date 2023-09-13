import { ConfigProvider, Layout, theme } from 'antd'
import React, { useEffect, useState } from 'react'

import { Api, useApi } from './api'
import { Entity, EntityMeta } from './entity'
import EntityList from './entity/EntityList'
import EntitySheet from './entity/EntitySheet'
import { ErrorContext, ErrorDialog } from './error'

import s from './App.css'

const { Sider } = Layout

const api = new Api()

const App = () => {
  // State: entityTypes , selectedEntityType
  const [selectedEntityType, setSelectedEntityType] = useState<EntityMeta | null>(null)
  const entityTypes = useApi(async (signal) => {
    const entityTypes = await api.entityTypes({ signal })
    if (entityTypes.length && !selectedEntityType) setSelectedEntityType(entityTypes[0])
    return entityTypes
  })

  // State: entities, selectedEntity
  const entities = useApi(async (signal) => {
    if (!entityTypes.data || !selectedEntityType) return []
    return api.entities({ entityType: selectedEntityType!, signal })
  }, [selectedEntityType, entityTypes.loading, entityTypes.error])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)

  // State: errors
  const [errors, setErrors] = useState<any[]>([])

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <ErrorContext.Provider value={{ errors, setErrors }}>
        <Layout hasSider className={s.main}>
          <Sider className={s.sider} width={360}>
            <EntityList
              entityTypes={entityTypes}
              selectedEntityType={selectedEntityType} onEntityTypeSelected={setSelectedEntityType}
              entities={entities} onEntitySelected={setSelectedEntity}
            />
          </Sider>
          <EntitySheet entity={selectedEntity} />
        </Layout>
        <ErrorDialog />
      </ErrorContext.Provider>
    </ConfigProvider>
  )
}

export default App
