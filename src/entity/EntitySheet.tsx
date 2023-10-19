import {
  Button, DatePicker, Form, Input, Space,
} from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { DeleteFilled, SaveFilled, SettingFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import React, { useState } from 'react'

import { Entity, EntityMeta, FieldMeta, FieldType } from './entity'
import Header from '../layout/Header'
import { Sheet } from '../layout/Sheet'
import { Tooltip } from '../layout/Tooltip'
import { useKeyboardShortcut } from '../lib/keyboardShortcuts'
import { useNotification } from '../lib/notification'

import s from './EntitySheet.css'

// TODO Show dates in the browser's default date format
const DATE_FORMAT = 'YYYY-MM-DD'

type EntitySheetProps = {
  type: EntityMeta,
  initialValue: Entity,
  onUpdate: (entity: Entity) => Promise<void>,
}
const EntitySheet = ({ type, initialValue, onUpdate }: EntitySheetProps) => {
  const [value, setValue] = useState<Entity>(initialValue)

  const notify = useNotification()
  useKeyboardShortcut([{ meta: true, key: 's' }], () => doUpdate())

  const setField = (fCode: string) => (fieldValue: any) => {
    setValue({
      ...value,
      [fCode]: fieldValue,
    })
  }

  const pristine = Object.keys(type.fields)
    .reduce((acc, fCode) => acc && value[fCode] === initialValue[fCode], true)

  const doUpdate = async () => {
    if (pristine) return
    await onUpdate(value)
    notify.success({
      message: 'Saved!',
      description: `${type.formatTitle(value).title} saved successfully.`,
    })
  }

  return (
    <Sheet className={s.root}>
      <Header title={type.formatTitle(value).title}>
        <Space.Compact block>
          <Tooltip title='Save' shortcut='⌘ + S'>
            <Button
              icon={<SaveFilled />}
              disabled={pristine}
              onClick={doUpdate}
            />
          </Tooltip>
          <Tooltip title='Delete'><Button icon={<DeleteFilled />} /></Tooltip>
        </Space.Compact>
        <Space.Compact block>
          <Tooltip title='Config'><Button icon={<SettingFilled />} /></Tooltip>
        </Space.Compact>
      </Header>
      <Content className={s.content}>
        <div className={s.fields}>
          <Form>{
            Object.values(type.fields).map(f => (
              <Field
                key={f.code}
                type={f}
                value={value[f.code]}
                setValue={setField(f.code)}
              />
            ))
          }
          </Form>
        </div>
      </Content>
    </Sheet>
  )
}

type FieldProps = {
  type: FieldMeta,
  value: any,
  setValue: (value: any) => void,
}
const Field = ({ type, value, setValue }: FieldProps) => {
  if (type.hidden) return null

  switch (type.type) {
    case FieldType.STRING:
      return (
        <Form.Item label={type.name}>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Item>
      )
    case FieldType.DATE:
      return (
        <Form.Item label={type.name}>
          <DatePicker
            format={DATE_FORMAT}
            value={dayjs(value, DATE_FORMAT)}
            onChange={e => setValue(e?.format(DATE_FORMAT))}
          />
        </Form.Item>
      )
    default:
      throw new Error(`Fields of type '${type.type}' not yet support`)
  }
}

export default EntitySheet
