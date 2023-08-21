import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ErrorContext } from '.'

const ErrorDialog = () => {
  const { errors } = useContext(ErrorContext)

  // TODO Report unknown server errors as a dialog
  return !!errors.length && (
    <div>
      This will be a dialog presenting these errors:
      <ul>
        {errors.map(e => (
          // TODO Format error
          <li key={e}>{e.toString()}</li>
        ))}
      </ul>
    </div>
  )
}

export default ErrorDialog
