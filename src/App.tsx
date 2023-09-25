import { ConfigProvider, Layout, theme } from 'antd'
import React, { useState } from 'react'

import { Api, useApi } from './api'
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
  const types = useApi(async (signal) => {
    const types = await api.entityTypes({ signal })
    if (types.length && !selectedType) setSelectedType(types[0])
    return types
  })

  // State: entities, selectedEntity
  const entities = useApi(async (signal) => {
    if (!types.data || !selectedType) return []
    return api.entities({ entityType: selectedType!, signal })
  }, [selectedType, types.loading, types.error])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)

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
          <EntitySheet type={selectedType} initialValue={selectedEntity} />
        </Layout>
        <ErrorDialog />
      </ErrorContext.Provider>
    </ConfigProvider>
  )
}

export default App
