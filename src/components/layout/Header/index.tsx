import React from 'react'
import { Layout, Avatar, Dropdown, message } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { removeToken } from '@/utils/storage'
import './index.scss'

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const navigate = useNavigate()

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    console.log(key)

    if (key === 'logout') {
      console.log('退出登录')
      removeToken()
      message.success('已退出登录')
      navigate('/login', { replace: true })
    } else if (key === 'profile') {
      // TODO: 跳转个人中心
      message.info('个人中心功能开发中...')
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ]

  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <h2 className="page-title">文件系统管理</h2>
        <div className="header-right">
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <span className="username">Admin User</span>
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  )
}

export default Header
