import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Popconfirm, Input, Select, message, Modal, Form } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import PageContainer from '@/components/PageContainer'
import * as userServices from './services'
import type { User, UserQueryParams, CreateUserParams } from './types'
import './index.scss'

const UserManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState<UserQueryParams>({
    page: 1,
    pageSize: 10
    // sortBy: "createdAt",
    // sortOrder: "desc",
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadUsers()
  }, [queryParams])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const result = await userServices.getUserList(queryParams)
      setUsers(result.data)
      setTotal(result.total)
    } catch (error: any) {
      message.error(error.message || '加载用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, page: 1, email: value })
  }

  const handleRoleFilter = (value: string) => {
    setQueryParams({
      ...queryParams,
      page: 1,
      role: value === 'all' ? undefined : value
    })
  }

  const handleTableChange = (pagination: any) => {
    setQueryParams({
      ...queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    })
  }

  const handelCreate = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue({
      email: user.email,
      role: user.role
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await userServices.deleteUser(id)
      message.success('删除成功')
      loadUsers()
    } catch (error: any) {
      message.error(error.message || '删除失败')
    } finally {
      setLoading(false)
    }
  }

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户')
      return
    }
    setLoading(true)
    try {
      await userServices.batchDeleteUsers({ ids: selectedRowKeys })
      message.success(`成功删除 ${selectedRowKeys.length} 个用户`)
      setSelectedRowKeys([])
      loadUsers()
    } catch (error: any) {
      message.error(error.message || '批量删除失败')
    } finally {
      setLoading(false)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (editingUser) {
        // 更新用户
        const updateData: Partial<User> = { role: values.role }
        if (values.password) {
          updateData.password = values.password
        }
        await userServices.updateUser(editingUser.id, updateData)
        message.success('更新成功')
      } else {
        // 创建用户
        const createData: CreateUserParams = {
          email: values.email,
          password: values.password,
          role: values.role || 'user'
        }
        await userServices.createUser(createData)
        message.success('创建成功')
      }

      setIsModalOpen(false)
      loadUsers()
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return
      }
      message.error(error.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<User> = [
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <Space>
          <UserOutlined />
          {email}
        </Space>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          admin: 'red',
          developer: 'blue',
          user: 'default'
        }
        return <Tag color={colorMap[role]}>{role.toUpperCase()}</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN')
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString('zh-CN')
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record: User) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗?"
            onConfirm={() => handleDelete(record.id)}
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
      title="用户管理"
      extra={
        <Space>
          <Button danger disabled={selectedRowKeys.length === 0} onClick={handleBatchDelete}>
            批量删除
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handelCreate}>
            新建用户
          </Button>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索邮箱..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
          onSearch={handleSearch}
          allowClear
        />
        <Select
          style={{ width: 150 }}
          placeholder="筛选角色"
          onChange={handleRoleFilter}
          defaultValue="all"
          options={[
            { value: 'all', label: '全部' },
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
            { value: 'developer', label: 'Developer' }
          ]}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        pagination={{
          current: queryParams.page,
          pageSize: queryParams.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input disabled={!!editingUser} placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: !editingUser,
                message: '请输入密码!'
              },
              {
                min: 6,
                message: '密码至少6位!'
              }
            ]}
          >
            <Input.Password placeholder={editingUser ? '留空表示不修改密码' : '请输入密码'} />
          </Form.Item>

          <Form.Item label="角色" name="role" initialValue="user">
            <Select
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'developer', label: 'Developer' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}

export default UserManage
