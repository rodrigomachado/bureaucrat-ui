import { ConfigProvider, Layout, theme } from 'antd'
import React, { useState } from 'react'

import { Api, useApi } from './api'
import { Entity } from './entity'
import EntityList from './entity/EntityList'
import EntitySheet from './entity/EntitySheet'
import { ErrorContext, ErrorDialog } from './error'

import s from './App.css'

const { Sider } = Layout

const api = new Api()

const App = () => {
  const entities = useApi((signal) => api.users({ signal }))
  const [errors, setErrors] = useState<any[]>([])

  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <ErrorContext.Provider value={{ errors, setErrors }}>
        <Layout hasSider className={s.main}>
          <Sider className={s.sider} width={360}>
            <EntityList entities={entities} onEntitySelected={setSelectedEntity} />
          </Sider>
          <EntitySheet entity={selectedEntity} />
        </Layout>
        <ErrorDialog />
      </ErrorContext.Provider>
    </ConfigProvider>
  )
}

export default App
