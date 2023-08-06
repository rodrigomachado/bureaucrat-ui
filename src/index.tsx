import React from 'react'
import { createRoot } from 'react-dom/client'

import Page from './layout/Page'
import Paper from './layout/Paper'
import EntityList from './entity/EntityList'
import EntitySheet from './entity/EntitySheet'

const container = document.getElementById('app-root')!
const root = createRoot(container)
root.render(
  <Page>
    <Paper>
      <EntityList />
      <EntitySheet />
    </Paper>
  </Page>
)

