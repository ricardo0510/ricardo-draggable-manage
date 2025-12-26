import React, { useMemo, useState } from "react";
import { Table, Button, Space, Tag, Popconfirm, Input, Select } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  LayoutOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useFileSystemStore } from "@/store";
import { FileSystemItem, ItemType } from "@/types";
import ItemFormModal from "./components/ItemFormModal";
import ConfigurableForm, {
  type FormItemConfig,
} from "@/components/common/ConfigurableForm";
import PageContainer from "@/components/common/PageContainer";
import "./index.scss";

const FileSystemManage: React.FC = () => {
  const {
    items,
    searchTerm,
    filterType,
    setSearchTerm,
    setFilterType,
    addItem,
    updateItem,
    deleteItem,
  } = useFileSystemStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FileSystemItem | null>(null);

  // 定义表单配置项
  const formItems: FormItemConfig[] = [
    {
      name: "searchTerm",
      render: (form) => (
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索名称或ID..."
          style={{ width: 300 }}
          onBlur={(e) => {
            form.setFieldValue("searchTerm", e.target.value);
            form.submit(); // 触发onChange
          }}
        />
      ),
    },
    {
      name: "filterType",
      render: () => (
        <Select
          style={{ width: 200 }}
          placeholder="选择类型"
          options={[
            { value: "all", label: "全部" },
            { value: "app", label: "App" },
            { value: "folder", label: "Folder" },
            { value: "web", label: "Web" },
            { value: "widget", label: "Widget" },
          ]}
        />
      ),
    },
  ];

  const itemsList = useMemo(() => {
    return Object.values(items).filter((item: FileSystemItem) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [items, searchTerm, filterType]);

  const getIconForType = (type: ItemType) => {
    switch (type) {
      case "folder":
        return <FolderOutlined style={{ color: "#1890ff" }} />;
      case "app":
        return <AppstoreOutlined style={{ color: "#52c41a" }} />;
      case "web":
        return <GlobalOutlined style={{ color: "#722ed1" }} />;
      case "widget":
        return <LayoutOutlined style={{ color: "#faad14" }} />;
      default:
        return null;
    }
  };

  const columns: ColumnsType<FileSystemItem> = [
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: ItemType) => (
        <Space>
          {getIconForType(type)}
          <span style={{ textTransform: "capitalize" }}>{type}</span>
        </Space>
      ),
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: FileSystemItem) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#999" }}>ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: "父级ID",
      dataIndex: "parentId",
      key: "parentId",
      width: 120,
      render: (parentId: string) => <Tag>{parentId}</Tag>,
    },
    {
      title: "位置",
      key: "position",
      width: 120,
      render: (_, record: FileSystemItem) => (
        <code>
          ({record.position?.x ?? 0}, {record.position?.y ?? 0})
        </code>
      ),
    },
    {
      title: "详情",
      key: "details",
      render: (_, record: FileSystemItem) => {
        if (record.type === "web" && record.url) {
          return (
            <a href={record.url} target="_blank" rel="noreferrer">
              {record.url}
            </a>
          );
        }
        if (record.type === "widget") {
          return (
            <span>
              {record.widgetType} ({record.size})
            </span>
          );
        }
        if (record.content) {
          return <span style={{ color: "#999", fontSize: 12 }}>有内容</span>;
        }
        return "-";
      },
    },
    {
      title: "操作",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record: FileSystemItem) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定要删除这个项目吗?"
            onConfirm={() => deleteItem(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: FileSystemItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (itemData: Partial<FileSystemItem>) => {
    if (editingItem) {
      updateItem(editingItem.id, itemData);
    } else {
      const newItem: FileSystemItem = {
        id: crypto.randomUUID(),
        parentId: itemData.parentId || "root",
        name: itemData.name || "Untitled",
        type: itemData.type || "folder",
        position: itemData.position || { x: 0, y: 0 },
        ...itemData,
      };
      addItem(newItem);
    }
    setIsModalOpen(false);
  };

  return (
    <PageContainer
      title="文件系统管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建项目
        </Button>
      }
    >
      <ConfigurableForm
        items={formItems}
        initialValues={{
          searchTerm,
          filterType,
        }}
        onChange={(values) => {
          setSearchTerm(values.searchTerm || "");
          setFilterType(values.filterType || "all");
        }}
      />

      <Table
        columns={columns}
        dataSource={itemsList}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 项`,
        }}
      />

      <ItemFormModal
        open={isModalOpen}
        editingItem={editingItem}
        onSave={handleSave}
        onCancel={() => setIsModalOpen(false)}
      />
    </PageContainer>
  );
};

export default FileSystemManage;
