import { Button, DatePicker, Empty, Form, Input, Layout, Space, Tooltip } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { DeleteFilled, SaveFilled, SettingFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import React from 'react'

import { Entity } from '.'
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
      <Header title={entity.listData().short}>
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
          <Form>
            {/* TODO Iterate over fields metadata to render the inputs */}
            <Form.Item label='First Name'>
              <Input placeholder='Douglas' value={entity.fieldValue('firstName')} />
            </Form.Item>
            <Form.Item label='Middle Name'>
              <Input placeholder='Noël' value={entity.fieldValue('middleName')} />
            </Form.Item>
            <Form.Item label='Last Name'>
              <Input placeholder='Adams' value={entity.fieldValue('lastName')} />
            </Form.Item>
            <Form.Item label='Birth Date'>
              <DatePicker
                placeholder='1952-03-11'
                format={DATE_FORMAT}
                value={dayjs(entity.fieldValue('birthDate'), DATE_FORMAT)}
              />
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  )
}

export default EntitySheet
