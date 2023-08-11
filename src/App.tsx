import React, { useEffect, useState } from "react"

import { Api } from "./api"
import { Entity } from "./entity"
import EntityList from "./entity/EntityList"
import EntitySheet from "./entity/EntitySheet"
import Page from "./layout/Page"
import Paper from "./layout/Paper"

const api = new Api()

const App = () => {
  // TODO: Handle loading state.
  const [users, setUsers] = useState<Entity[]>([])

  // TODO: Extract this into a hook?
  useEffect(() => {
    (async () => {
      setUsers(await api.users())
    })()
  }, [])

  return (
    <Page>
      <Paper>
        <EntityList entities={users} />
        <EntitySheet />
      </Paper>
    </Page>
  )
}

export default App
