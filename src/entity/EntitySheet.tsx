import { Button, DatePicker, Empty, Form, Input, Layout, Space, Tooltip } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { DeleteFilled, SaveFilled, SettingFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

import { Entity, EntityMeta, FieldMeta, FieldType } from './entity'
import Header from '../layout/Header'

import s from './EntitySheet.css'

// TODO Show dates in the browser's default date format
const DATE_FORMAT = 'YYYY-MM-DD'

type EntitySheetProps = {
  type: EntityMeta | null,
  initialValue: Entity | null,
}
const EntitySheet = ({ type, initialValue }: EntitySheetProps) => {
  const [value, setValue] = useState<Entity>({})
  useEffect(() => setValue(initialValue || {}), [initialValue])
  const setField = (fCode: string) => (fieldValue: any) => {
    setValue({
      ...value,
      [fCode]: fieldValue,
    })
  }

  if (!type || !initialValue) {
    return (
      <Layout className={s.emptyLayout}>
        <Empty description='No selected data' />
      </Layout>
    )
  }

  return (
    <Layout>
      <Header title={type.formatTitle(value).title}>
        <Space.Compact block>
          <Tooltip title='Save'><Button icon={<SaveFilled />} /></Tooltip>
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
                key={f.id}
                type={f}
                value={value[f.code]}
                setValue={setField(f.code)}
              />
            ))
          }
          </Form>
        </div>
      </Content>
    </Layout>
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
