import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Input,
  message,
  Modal,
  Form,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PageContainer from "@/components/common/PageContainer";
import * as categoryServices from "./services";
import type {
  Category,
  CategoryQueryParams,
  CreateCategoryParams,
} from "./types";
import "./index.scss";

const MenuManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
    page: 1,
    pageSize: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories();
  }, [queryParams]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await categoryServices.getCategoryList(queryParams);
      setCategories(result.data);
      setTotal(result.total);
    } catch (error: any) {
      message.error(error.message || "加载分类列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, page: 1, name: value });
  };

  const handleTableChange = (pagination: any) => {
    setQueryParams({
      ...queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await categoryServices.deleteCategory(id);
      message.success("删除成功");
      loadCategories();
    } catch (error: any) {
      message.error(error.message || "删除失败");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请选择要删除的分类");
      return;
    }
    setLoading(true);
    try {
      await categoryServices.batchDeleteCategories({ ids: selectedRowKeys });
      message.success(`成功删除 ${selectedRowKeys.length} 个分类`);
      setSelectedRowKeys([]);
      loadCategories();
    } catch (error: any) {
      message.error(error.message || "批量删除失败");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCategory) {
        // 更新分类
        await categoryServices.updateCategory(editingCategory.id, values);
        message.success("更新成功");
      } else {
        // 创建分类
        const createData: CreateCategoryParams = {
          name: values.name,
          description: values.description,
          icon: values.icon,
          color: values.color,
        };
        await categoryServices.createCategory(createData);
        message.success("创建成功");
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error(error.message || "操作失败");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Category) => (
        <Space>
          {record.icon ? (
            <span style={{ fontSize: 18 }}>{record.icon}</span>
          ) : (
            <TagOutlined />
          )}
          {name}
        </Space>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      render: (description?: string) => description || "-",
    },
    {
      title: "颜色",
      dataIndex: "color",
      key: "color",
      width: 120,
      render: (color?: string) => {
        if (!color) return "-";
        return (
          <Tag color={color}>
            <span style={{ color: color }}>{color}</span>
          </Tag>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (time: string) => new Date(time).toLocaleString("zh-CN"),
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (time: string) => new Date(time).toLocaleString("zh-CN"),
    },
    {
      title: "操作",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record: Category) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个分类吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="分类管理"
      extra={
        <Space>
          <Button
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建分类
          </Button>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="搜索分类名称..."
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
          onSearch={handleSearch}
          allowClear
        />
      </Space>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          current: queryParams.page,
          pageSize: queryParams.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingCategory ? "编辑分类" : "新建分类"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入分类名称!" }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea placeholder="请输入分类描述(可选)" rows={3} />
          </Form.Item>

          <Form.Item label="图标" name="icon">
            <Input placeholder="请输入图标(可选,如: 📁 🎨 ⚙️)" />
          </Form.Item>

          <Form.Item label="颜色" name="color">
            <Input placeholder="请输入颜色(可选,如: #1890ff)" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default MenuManage;
