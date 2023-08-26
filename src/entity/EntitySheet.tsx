import { Button, DatePicker, Form, Input, Layout, Space, Tooltip } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { DeleteFilled, SaveFilled, SettingFilled } from '@ant-design/icons'
import React from 'react'

import Header from '../layout/Header'

import s from './EntitySheet.css'

const DATE_FORMAT = 'YYYY-MM-DD'

type EntitySheetProps = {}
const EntitySheet = ({ }: EntitySheetProps) => (
  <Layout>
    <Header title='<New User>'>
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
          <Form.Item label='First Name'>
            <Input placeholder='Douglas' />
          </Form.Item>
          <Form.Item label='Middle Name'>
            <Input placeholder='Noël' />
          </Form.Item>
          <Form.Item label='Last Name'>
            <Input placeholder='Adams' />
          </Form.Item>
          <Form.Item label='Birth Date'>
            <DatePicker placeholder='1952-03-11' format={DATE_FORMAT} />
          </Form.Item>
        </Form>
      </div>
    </Content>
  </Layout>
)

export default EntitySheet
