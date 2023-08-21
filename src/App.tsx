import React, { useState } from "react"

import { Api, useApi } from "./api"
import EntityList from "./entity/EntityList"
import EntitySheet from "./entity/EntitySheet"
import { ErrorContext, ErrorDialog } from "./error"
import Page from "./layout/Page"
import Paper from "./layout/Paper"

const api = new Api()

const App = () => {
  const entities = useApi((signal) => api.users({ signal }))
  const [errors, setErrors] = useState<any[]>([])

  return (
    <Page>
      <ErrorContext.Provider value={{ errors, setErrors }}>
        <Paper>
          <EntityList entities={entities} />
          <EntitySheet />
        </Paper>
        <ErrorDialog />
      </ErrorContext.Provider>
    </Page>
  )
}

export default App
