import React from 'react'
import { createRoot } from 'react-dom/client'

import Page from './layout/Page'
import Paper from './layout/Paper'
import EntityList from './entity/EntityList'
import EntitySheet from './entity/EntitySheet'

const users = await fetch('/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `{
      users { id firstName middleName lastName birthDate }
    }`
  }),
}).then(res => res.json()).then(res => res.data.users)

const container = document.getElementById('app-root')!
const root = createRoot(container)
root.render(
  <Page>
    <Paper>
      <EntityList users={users} />
      <EntitySheet />
    </Paper>
  </Page>
)

