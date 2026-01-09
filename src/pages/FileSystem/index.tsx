import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Space, Tag, Popconfirm, Input, Select, message } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  LayoutOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { MarketApp, MarketAppType, MarketQueryParams } from '@/types'
import ItemFormModal from './components/ItemFormModal'
import ConfigurableForm, { type FormItemConfig } from '@/components/ConfigurableForm'
import PageContainer from '@/components/PageContainer'
import { useDictOptions } from '@/hooks/useDictOptions'
import * as marketServices from './services'
import './index.scss'

const MarketManage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MarketApp | null>(null)
  const [loading, setLoading] = useState(false)
  const [appsList, setAppsList] = useState<MarketApp[]>([])
  const [queryParams, setQueryParams] = useState<MarketQueryParams>({})

  const { options: categoryOptions, loading: categoryLoading } = useDictOptions('file_menu')

  // 加载应用列表
  const loadApps = useCallback(async (params?: MarketQueryParams) => {
    setLoading(true)
    try {
      const apps = await marketServices.getMarketApps(params)
      setAppsList(apps)
    } catch (error: any) {
      message.error(error.message || '加载应用列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadApps(queryParams)
  }, [loadApps, queryParams])

  // 定义表单配置项
  const formItems: FormItemConfig[] = [
    {
      name: 'search',
      render: (form) => (
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索应用名称..."
          style={{ width: 300 }}
          allowClear
          onBlur={(e) => {
            form.setFieldValue('search', e.target.value)
            form.submit()
          }}
          onPressEnter={(e) => {
            form.setFieldValue('search', (e.target as HTMLInputElement).value)
            form.submit()
          }}
        />
      )
    },
    {
      name: 'category',
      render: () => (
        <Select
          style={{ width: 200 }}
          placeholder="选择分类"
          allowClear
          loading={categoryLoading}
          options={[{ value: undefined, label: '全部分类' }, ...categoryOptions]}
        />
      )
    }
  ]

  const getIconForType = (type: MarketAppType) => {
    switch (type) {
      case 'app':
        return <AppstoreOutlined style={{ color: '#52c41a' }} />
      case 'link':
        return <GlobalOutlined style={{ color: '#722ed1' }} />
      case 'widget':
        return <LayoutOutlined style={{ color: '#faad14' }} />
      default:
        return null
    }
  }

  const columns: ColumnsType<MarketApp> = [
    {
      title: '应用',
      key: 'app',
      render: (_, record: MarketApp) => (
        <Space>
          <img style={{ width: 40, height: 40 }} src={record.icon} alt="" />
          <div>
            <div style={{ fontWeight: 500 }}>{record.title}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.description}</div>
          </div>
        </Space>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (category ? <Tag>{category}</Tag> : '-')
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: MarketAppType) => (
        <Space>
          {getIconForType(type)}
          <span style={{ textTransform: 'capitalize' }}>{type}</span>
        </Space>
      )
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => (price === 0 ? <Tag color="green">免费</Tag> : `¥${price.toFixed(2)}`)
    },
    {
      title: '安装次数',
      dataIndex: 'installCount',
      key: 'installCount',
      width: 100,
      render: (count: number) => count.toLocaleString()
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record: MarketApp) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="确定要删除这个应用吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const handleCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: MarketApp) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleSave = async (itemData: Partial<MarketApp>) => {
    setLoading(true)
    try {
      if (editingItem) {
        await marketServices.updateMarketApp(editingItem.id, itemData)
        message.success('更新成功')
      } else {
        await marketServices.createMarketApp(itemData as any)
        message.success('创建成功')
      }
      setIsModalOpen(false)
      loadApps(queryParams)
    } catch (error: any) {
      message.error(error.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await marketServices.deleteMarketApp(id)
      message.success('删除成功')
      loadApps(queryParams)
    } catch (error: any) {
      message.error(error.message || '删除失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer
      title="应用市场管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建应用
        </Button>
      }
    >
      <ConfigurableForm
        items={formItems}
        initialValues={queryParams}
        onChange={(values) => {
          setQueryParams({
            search: values.search || undefined,
            category: values.category || undefined
          })
        }}
      />

      <Table
        columns={columns}
        dataSource={appsList}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个应用`
        }}
      />

      <ItemFormModal
        open={isModalOpen}
        editingItem={editingItem}
        onSave={handleSave}
        onCancel={() => setIsModalOpen(false)}
      />
    </PageContainer>
  )
}

export default MarketManage
