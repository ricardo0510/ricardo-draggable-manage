import React, { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login } from './services'
import type { LoginParams } from './types'
import './index.scss'
import { setToken } from '@/utils'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: LoginParams) => {
    setLoading(true)
    try {
      const result = await login(values)
      setToken(result.access_token)
      // 可选:保存用户信息
      localStorage.setItem('user', JSON.stringify(result.user))
      message.success('登录成功!')
      // 跳转到主页
      navigate('/')
    } catch (error: any) {
      message.error(error.message || '登录失败,请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card" title="用户登录">
        <Form
          name="login"
          initialValues={{ email: '', password: '' }}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="邮箱" autoComplete="email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" autoComplete="current-password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
