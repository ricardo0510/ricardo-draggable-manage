import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FolderOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store";
import "./index.scss";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, setCollapsed } = useAppStore();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "仪表盘",
    },
    {
      key: "/file-system",
      icon: <FolderOutlined />,
      label: "文件系统",
    },
    {
      key: "/user",
      icon: <AppstoreOutlined />,
      label: "用户管理",
      children: [
        { key: "/user/list", label: "用户列表" },
        { key: "/user/detail", label: "用户详情" },
      ],
    },
    {
      key: "/setting",
      icon: <SettingOutlined />,
      label: "系统设置",
    },
  ];

  return (
    <Sider
      className="sidebar"
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="dark"
    >
      <div className="logo">
        <h1>{collapsed ? "AS" : "Admin System"}</h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
