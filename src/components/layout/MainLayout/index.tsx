import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";
import "./index.scss";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout className="main-layout">
      <Sidebar />
      <Layout>
        <Header />
        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
