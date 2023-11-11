import {
  Button, DatePicker, Form as AntForm, Input, Space,
} from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { DeleteFilled, SaveFilled, SettingFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import React from 'react'

import {
  Entity, EntityMeta, FieldMeta, FieldType,
} from './entity'
import Header from '../layout/Header'
import { Sheet } from '../layout/Sheet'
import { Tooltip } from '../layout/Tooltip'
import { FormField, Rules, useForm } from '../lib/form'
import { useKeyboardShortcut } from '../lib/keyboardShortcuts'
import { useNotification } from '../lib/notification'

import s from './EntitySheet.css'

const DATE_FORMAT = 'YYYY-MM-DD'

type EntitySheetProps = {
  type: EntityMeta,
  initialValue: Entity,
  onSave: (entity: Entity) => Promise<void>,
}
const EntitySheet = ({ type, initialValue, onSave }: EntitySheetProps) => {
  const notify = useNotification()
  useKeyboardShortcut([{ meta: true, key: 's' }], () => doSave())
  // TODO WIP Move FormRules builder to `EntityMeta`
  const formRules: Rules = Object.values(type.fields).reduce((acc, f) => {
    acc[f.code] = {}
    if (f.mandatory && !f.generated) acc[f.code].required = true
    return acc
  }, {} as Rules)
  const form = useForm(Object.keys(type.fields), initialValue.fields, formRules)

  const doSave = async () => {
    if (form.pristine) return
    form.touch()

    const title = type.formatTitle(form.values).title

    if (!form.valuesOk) {
      notify.error({
        message: 'Oops... Not able to save.',
        description: `${title} contains errors.`,
      })
      return
    }

    await onSave({
      ...initialValue,
      fields: form.values,
    })
    notify.success({
      message: 'Saved!',
      description: `${title} saved successfully.`,
    })
  }

  // Show all fields when creating a new entity
  const formFields = initialValue.new ?
    Object.values(type.fields) :
    Object.values(type.fields).filter(f => !f.hidden)

  return (
    <Sheet className={s.root}>
      <Header title={type.formatTitle(form.values).title}>
        <Space.Compact block>
          <Tooltip title='Save' shortcut='⌘ + S'>
            <Button
              icon={<SaveFilled />}
              disabled={form.pristine}
              onClick={doSave}
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
          <AntForm>
            {formFields.map(f => (
              <Field key={f.code} type={f} formField={form.field(f.code)} />
            ))}
          </AntForm>
        </div>
      </Content>
    </Sheet>
  )
}

type FieldProps = {
  type: FieldMeta,
  formField: FormField,
}
const Field = ({ type, formField: field }: FieldProps) => {
  const itemProps: {
    help?: string, validateStatus?: 'error',
  } = field.errorMessage ? {
    help: field.errorMessage, validateStatus: 'error',
  } : {}

  switch (type.type) {
    case FieldType.STRING:
    case FieldType.NUMBER:
      return (
        <AntForm.Item label={type.name} {...itemProps}>
          <Input
            value={field.value as never}
            onChange={(e) => field.value = e.target.value}
            onBlur={() => field.touch()}
          />
        </AntForm.Item>
      )
    case FieldType.DATE:
      return (
        <AntForm.Item label={type.name}>
          <DatePicker
            format={DATE_FORMAT}
            value={dayjs(field.value, DATE_FORMAT)}
            onChange={e => field.value = e?.format(DATE_FORMAT)}
          />
        </AntForm.Item>
      )
    default:
      throw new Error(`Fields of type '${type.type}' not yet support`)
  }
}

export default EntitySheet
