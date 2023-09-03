import React, { useContext } from 'react'
import { ErrorContext } from '.'
import { Button, Modal } from 'antd'

const ErrorDialog = () => {
  const { errors, setErrors } = useContext(ErrorContext)
  const close = () => setErrors([])
  return (
    <Modal
      title="Errors"
      centered
      open={!!errors.length}
      onOk={close}
      onCancel={close}
      footer={[<Button key='ok' type='primary' onClick={close} autoFocus>Ok</Button>]}
      width={1000}
    >
      <ul>
        {errors.map(e => (
          <li key={e}>{e.toString()}</li>
        ))}
      </ul>
    </Modal>
  )
}

export default ErrorDialog
