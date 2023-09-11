import { Button, DatePicker, Empty, Form, Input, Layout, Space, Tooltip } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { DeleteFilled, SaveFilled, SettingFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import React from 'react'

import { Entity, FieldMeta, FieldType } from '.'
import Header from '../layout/Header'

import s from './EntitySheet.css'

// TODO Show dates in the browser's default date format
const DATE_FORMAT = 'YYYY-MM-DD'

type EntitySheetProps = {
  entity: Entity | null,
}
const EntitySheet = ({ entity }: EntitySheetProps) => {
  if (!entity) {
    return (
      <Layout className={s.emptyLayout}>
        <Empty description='No selected data' />
      </Layout>
    )
  }

  return (
    <Layout>
      <Header title={entity.titleFormat().title}>
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
            Object.values(entity.meta.fields).map(f => (
              <Field key={f.id} fieldMeta={f} fieldValue={entity.fieldValue(f.code)} />
            ))
          }
          </Form>
        </div>
      </Content>
    </Layout>
  )
}

type FieldProps = {
  fieldMeta: FieldMeta,
  fieldValue: any,
}
const Field = ({ fieldMeta, fieldValue }: FieldProps) => {
  if (fieldMeta.hidden) return null

  switch (fieldMeta.type) {
    case FieldType.STRING:
      return (
        <Form.Item label={fieldMeta.name}>
          <Input value={fieldValue} />
        </Form.Item>
      )
    case FieldType.DATE:
      return (
        <Form.Item label={fieldMeta.name}>
          <DatePicker
            format={DATE_FORMAT}
            value={dayjs(fieldValue, DATE_FORMAT)}
          />
        </Form.Item>
      )
    default:
      throw new Error(`Fields of type ${fieldMeta.type} not yet support`)
  }
}

export default EntitySheet
