import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  FileOutlined,
  FolderOutlined,
  GlobalOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useFileSystemStore } from "@/store";
import PageContainer from "@/components/common/PageContainer";
import "./index.scss";

const Dashboard: React.FC = () => {
  const { items } = useFileSystemStore();
  const itemsList = Object.values(items);

  const stats = {
    total: itemsList.length,
    folders: itemsList.filter((item) => item.type === "folder").length,
    apps: itemsList.filter((item) => item.type === "app").length,
    web: itemsList.filter((item) => item.type === "web").length,
  };

  return (
    <PageContainer title="仪表盘">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总项目"
              value={stats.total}
              prefix={<FileOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="文件夹"
              value={stats.folders}
              prefix={<FolderOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="应用"
              value={stats.apps}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="网页"
              value={stats.web}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
