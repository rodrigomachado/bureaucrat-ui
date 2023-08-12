import React from "react"

import { Api, useApi } from "./api"
import EntityList from "./entity/EntityList"
import EntitySheet from "./entity/EntitySheet"
import Page from "./layout/Page"
import Paper from "./layout/Paper"

const api = new Api()

const App = () => {
  const [
    // TODO: Handle loading and errors
    users, usersLoading, usersErrors,
  ] = useApi((signal) => api.users({ signal }))

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
