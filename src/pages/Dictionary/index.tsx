import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Popconfirm, Input, message, Modal, Form, Drawer, InputNumber } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import PageContainer from '@/components/PageContainer'
import * as dictServices from './services'
import type { DictType, DictData, CreateDictTypeParams, CreateDictDataParams, BatchCreateItem } from './types'
import './index.scss'

const DictionaryManage: React.FC = () => {
  // 字典类型状态
  const [loading, setLoading] = useState(false)
  const [dictTypes, setDictTypes] = useState<DictType[]>([])
  const [filteredTypes, setFilteredTypes] = useState<DictType[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // 类型弹窗状态
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
  const [editingType, setEditingType] = useState<DictType | null>(null)
  const [typeForm] = Form.useForm()

  // 数据弹窗状态
  const [isDataModalOpen, setIsDataModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<DictData | null>(null)
  const [currentTypeForData, setCurrentTypeForData] = useState<DictType | null>(null)
  const [dataForm] = Form.useForm()

  // 批量新增弹窗状态
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [currentTypeForBatch, setCurrentTypeForBatch] = useState<DictType | null>(null)
  const [batchForm] = Form.useForm()

  // 详情抽屉状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<DictType | null>(null)
  const [drawerData, setDrawerData] = useState<DictData[]>([])
  const [drawerLoading, setDrawerLoading] = useState(false)

  useEffect(() => {
    loadDictTypes()
  }, [])

  useEffect(() => {
    if (searchKeyword) {
      const filtered = dictTypes.filter(
        (item) =>
          item.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
      setFilteredTypes(filtered)
    } else {
      setFilteredTypes(dictTypes)
    }
  }, [searchKeyword, dictTypes])

  // ==================== 数据加载 ====================

  const loadDictTypes = async () => {
    setLoading(true)
    try {
      const result = await dictServices.getDictTypes()
      setDictTypes(result)
    } catch (error: any) {
      message.error(error.message || '加载字典类型失败')
    } finally {
      setLoading(false)
    }
  }

  const loadDictData = async (code: string) => {
    setDrawerLoading(true)
    try {
      const result = await dictServices.getDictDataByCode(code)
      setDrawerData(result)
    } catch (error: any) {
      message.error(error.message || '加载字典数据失败')
    } finally {
      setDrawerLoading(false)
    }
  }

  // ==================== 字典类型操作 ====================

  const handleCreateType = () => {
    setEditingType(null)
    typeForm.resetFields()
    setIsTypeModalOpen(true)
  }

  const handleEditType = (record: DictType) => {
    setEditingType(record)
    typeForm.setFieldsValue({
      code: record.code,
      name: record.name,
      description: record.description
    })
    setIsTypeModalOpen(true)
  }

  const handleDeleteType = async (id: string) => {
    setLoading(true)
    try {
      await dictServices.deleteDictType(id)
      message.success('删除成功')
      loadDictTypes()
    } catch (error: any) {
      message.error(error.message || '删除失败')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeModalOk = async () => {
    try {
      const values = await typeForm.validateFields()
      setLoading(true)

      if (editingType) {
        await dictServices.updateDictType(editingType.id, values)
        message.success('更新成功')
      } else {
        const createData: CreateDictTypeParams = {
          code: values.code,
          name: values.name,
          description: values.description
        }
        await dictServices.createDictType(createData)
        message.success('创建成功')
      }

      setIsTypeModalOpen(false)
      loadDictTypes()
    } catch (error: any) {
      if (error.errorFields) return
      message.error(error.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // ==================== 字典数据操作 ====================

  const handleAddData = (record: DictType) => {
    setEditingData(null)
    setCurrentTypeForData(record)
    dataForm.resetFields()
    setIsDataModalOpen(true)
  }

  const handleEditData = (record: DictData) => {
    setEditingData(record)
    dataForm.setFieldsValue({
      label: record.label,
      value: record.value,
      order: record.order
    })
    setIsDataModalOpen(true)
  }

  const handleDeleteData = async (id: string) => {
    setDrawerLoading(true)
    try {
      await dictServices.deleteDictData(id)
      message.success('删除成功')
      if (drawerType) {
        loadDictData(drawerType.code)
      }
    } catch (error: any) {
      message.error(error.message || '删除失败')
    } finally {
      setDrawerLoading(false)
    }
  }

  const handleDataModalOk = async () => {
    try {
      const values = await dataForm.validateFields()
      setLoading(true)

      if (editingData) {
        await dictServices.updateDictData(editingData.id, values)
        message.success('更新成功')
      } else if (currentTypeForData) {
        const createData: CreateDictDataParams = {
          typeId: currentTypeForData.id,
          label: values.label,
          value: values.value,
          order: values.order
        }
        await dictServices.createDictData(createData)
        message.success('创建成功')
      }

      setIsDataModalOpen(false)
      if (drawerType) {
        loadDictData(drawerType.code)
      }
    } catch (error: any) {
      if (error.errorFields) return
      message.error(error.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // ==================== 批量新增操作 ====================

  const handleBatchAdd = (record: DictType) => {
    setCurrentTypeForBatch(record)
    batchForm.resetFields()
    batchForm.setFieldsValue({
      items: [{ label: '', value: '' }]
    })
    setIsBatchModalOpen(true)
  }

  const handleBatchModalOk = async () => {
    try {
      const values = await batchForm.validateFields()
      setLoading(true)

      if (currentTypeForBatch) {
        const batchData = {
          code: currentTypeForBatch.code,
          name: currentTypeForBatch.name,
          items: values.items as BatchCreateItem[]
        }
        await dictServices.batchCreateDict(batchData)
        message.success('批量创建成功')
      }

      setIsBatchModalOpen(false)
      if (drawerType && drawerType.code === currentTypeForBatch?.code) {
        loadDictData(drawerType.code)
      }
    } catch (error: any) {
      if (error.errorFields) return
      message.error(error.message || '批量创建失败')
    } finally {
      setLoading(false)
    }
  }

  // ==================== 详情抽屉 ====================

  const handleViewDetail = (record: DictType) => {
    setDrawerType(record)
    setIsDrawerOpen(true)
    loadDictData(record.code)
  }

  // ==================== 表格列定义 ====================

  const typeColumns: ColumnsType<DictType> = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 150
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (description?: string) => description || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN')
    },
    {
      title: '操作',
      key: 'actions',
      width: 320,
      fixed: 'right',
      render: (_, record: DictType) => (
        <Space size="small" className="action-buttons">
          <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => handleAddData(record)}>
            新增
          </Button>
          <Button type="link" size="small" icon={<UnorderedListOutlined />} onClick={() => handleBatchAdd(record)}>
            批量新增
          </Button>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditType(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个字典类型吗？"
            description="删除后该类型下的所有数据也会被删除"
            onConfirm={() => handleDeleteType(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const dataColumns: ColumnsType<DictData> = [
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label'
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (order?: number) => order ?? '-'
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: DictData) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditData(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条数据吗？"
            onConfirm={() => handleDeleteData(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <PageContainer
      title="字典管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateType}>
          新建字典类型
        </Button>
      }
    >
      <div className="dictionary-manage">
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="搜索编码或名称..."
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            onSearch={(value) => setSearchKeyword(value)}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </Space>

        <Table
          columns={typeColumns}
          dataSource={filteredTypes}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ x: 1000 }}
        />

        {/* 字典类型编辑弹窗 */}
        <Modal
          title={editingType ? '编辑字典类型' : '新建字典类型'}
          open={isTypeModalOpen}
          onOk={handleTypeModalOk}
          onCancel={() => setIsTypeModalOpen(false)}
          confirmLoading={loading}
        >
          <Form form={typeForm} layout="vertical">
            <Form.Item
              label="编码"
              name="code"
              rules={[
                { required: true, message: '请输入编码!' },
                {
                  pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                  message: '编码只能包含字母、数字和下划线，且不能以数字开头'
                }
              ]}
            >
              <Input placeholder="请输入编码，如: priority" disabled={!!editingType} />
            </Form.Item>

            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
              <Input placeholder="请输入名称，如: 优先级" />
            </Form.Item>

            <Form.Item label="描述" name="description">
              <Input.TextArea placeholder="请输入描述(可选)" rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 字典数据编辑弹窗 */}
        <Modal
          title={editingData ? '编辑字典数据' : `新增字典数据 - ${currentTypeForData?.name || ''}`}
          open={isDataModalOpen}
          onOk={handleDataModalOk}
          onCancel={() => setIsDataModalOpen(false)}
          confirmLoading={loading}
        >
          <Form form={dataForm} layout="vertical">
            <Form.Item label="标签" name="label" rules={[{ required: true, message: '请输入标签!' }]}>
              <Input placeholder="请输入标签，如: 高" />
            </Form.Item>

            <Form.Item label="值" name="value" rules={[{ required: true, message: '请输入值!' }]}>
              <Input placeholder="请输入值，如: high" />
            </Form.Item>

            <Form.Item label="排序" name="order">
              <InputNumber placeholder="请输入排序(可选)" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 批量新增弹窗 */}
        <Modal
          title={`批量新增字典数据 - ${currentTypeForBatch?.name || ''}`}
          open={isBatchModalOpen}
          onOk={handleBatchModalOk}
          onCancel={() => setIsBatchModalOpen(false)}
          confirmLoading={loading}
          width={600}
        >
          <Form form={batchForm} layout="vertical" className="batch-form-list">
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'label']}
                        rules={[{ required: true, message: '请输入标签' }]}
                      >
                        <Input placeholder="标签" style={{ width: 200 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: '请输入值' }]}
                      >
                        <Input placeholder="值" style={{ width: 200 }} />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button type="link" danger onClick={() => remove(name)}>
                          删除
                        </Button>
                      )}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加一行
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>

        {/* 详情抽屉 */}
        <Drawer
          title={`字典数据 - ${drawerType?.name || ''} (${drawerType?.code || ''})`}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          width={700}
          extra={
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                if (drawerType) {
                  handleAddData(drawerType)
                }
              }}
            >
              新增数据
            </Button>
          }
        >
          <div className="drawer-data-table">
            <Table
              columns={dataColumns}
              dataSource={drawerData}
              rowKey="id"
              loading={drawerLoading}
              pagination={false}
              size="small"
            />
          </div>
        </Drawer>
      </div>
    </PageContainer>
  )
}

export default DictionaryManage
