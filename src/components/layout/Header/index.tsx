import React from "react";
import { Layout, Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./index.scss";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人中心",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <h2 className="page-title">文件系统管理</h2>
        <div className="header-right">
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <div className="user-info">
              <Avatar icon={<UserOutlined />} />
              <span className="username">Admin User</span>
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
