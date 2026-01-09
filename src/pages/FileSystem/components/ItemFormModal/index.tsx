import React, { useState, useEffect } from 'react'
import { Form, Input, Select, InputNumber, Button, Space, Modal } from 'antd'
import { MarketApp, MarketAppType } from '@/types'
import { useDictOptions } from '@/hooks/useDictOptions'
import './index.scss'

const { TextArea } = Input
const { Option } = Select

interface ItemFormModalProps {
  open: boolean
  editingItem: MarketApp | null
  onSave: (itemData: Partial<MarketApp>) => void
  onCancel: () => void
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ open, editingItem, onSave, onCancel }) => {
  const [form] = Form.useForm()
  const [appType, setAppType] = useState<MarketAppType>(editingItem?.type || 'app')
  const { options: categoryOptions, loading: categoryLoading } = useDictOptions('file_menu')

  useEffect(() => {
    if (open) {
      if (editingItem) {
        form.setFieldsValue({
          title: editingItem.title,
          description: editingItem.description,
          icon: editingItem.icon,
          category: editingItem.category,
          type: editingItem.type,
          widgetType: editingItem.widgetType,
          defaultSize: editingItem.defaultSize,
          url: editingItem.url,
          price: editingItem.price
        })
        setAppType(editingItem.type)
      } else {
        form.resetFields()
        form.setFieldsValue({
          type: 'app',
          price: 0
        })
        setAppType('app')
      }
    }
  }, [editingItem, form, open])

  const handleSubmit = (values: any) => {
    const formData: Partial<MarketApp> = {
      title: values.title,
      description: values.description,
      icon: values.icon,
      category: values.category,
      type: values.type,
      price: values.price ?? 0
    }

    if (values.type === 'link') {
      formData.url = values.url
    }

    if (values.type === 'widget') {
      formData.widgetType = values.widgetType
      formData.defaultSize = values.defaultSize
    }

    onSave(formData)
  }

  return (
    <Modal
      title={editingItem ? '编辑应用' : '新建应用'}
      open={open}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={() => form.submit()}>
            保存
          </Button>
        </Space>
      }
      width={600}
      destroyOnClose
    >
      <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="应用名称" name="title" rules={[{ required: true, message: '请输入应用名称' }]}>
            <Input placeholder="数字时钟" />
          </Form.Item>

          <Form.Item label="应用描述" name="description" rules={[{ required: true, message: '请输入应用描述' }]}>
            <TextArea rows={3} placeholder="简洁的数字时钟组件" />
          </Form.Item>

          <Form.Item label="图标" name="icon" rules={[{ required: true, message: '请输入图标' }]}>
            <Input placeholder="🕐 或图标 URL" />
          </Form.Item>

          <Form.Item label="分类" name="category">
            <Select options={categoryOptions} loading={categoryLoading} placeholder="请选择分类" allowClear />
          </Form.Item>

          <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
            <Select onChange={(value) => setAppType(value as MarketAppType)}>
              <Option value="app">应用 (App)</Option>
              <Option value="link">链接 (Link)</Option>
              <Option value="widget">小组件 (Widget)</Option>
            </Select>
          </Form.Item>

          {appType === 'link' && (
            <Form.Item label="链接 URL" name="url" rules={[{ type: 'url', message: '请输入有效的URL' }]}>
              <Input placeholder="https://example.com" />
            </Form.Item>
          )}

          {appType === 'widget' && (
            <>
              <Form.Item label="小组件类型" name="widgetType">
                <Select placeholder="选择小组件类型">
                  <Option value="clock">时钟 (Clock)</Option>
                  <Option value="calendar">日历 (Calendar)</Option>
                  <Option value="weather">天气 (Weather)</Option>
                </Select>
              </Form.Item>

              <Form.Item label="默认尺寸" name="defaultSize">
                <Select placeholder="选择默认尺寸">
                  <Option value="1x1">1x1</Option>
                  <Option value="1x2">1x2</Option>
                  <Option value="2x1">2x1</Option>
                  <Option value="2x2">2x2</Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item label="价格" name="price">
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              placeholder="0 表示免费"
              addonBefore="¥"
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default ItemFormModal
