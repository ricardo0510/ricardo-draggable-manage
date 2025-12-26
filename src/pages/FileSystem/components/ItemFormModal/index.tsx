import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Modal,
  Upload,
  message,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import type { UploadChangeParam, UploadFile } from "antd/es/upload";
import { FileSystemItem, ItemType } from "@/types/models/fileSystem";
import "./index.scss";

const { TextArea } = Input;
const { Option } = Select;

interface ItemFormModalProps {
  open: boolean;
  editingItem: FileSystemItem | null;
  onSave: (itemData: Partial<FileSystemItem>) => void;
  onCancel: () => void;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({
  open,
  editingItem,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [itemType, setItemType] = useState<ItemType>(
    editingItem?.type || "folder"
  );
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue({
        ...editingItem,
        posX: editingItem.position?.x ?? 0,
        posY: editingItem.position?.y ?? 0,
      });
      setItemType(editingItem.type);
    } else {
      form.setFieldsValue({
        parentId: "root",
        type: "folder",
        posX: 0,
        posY: 0,
      });
    }
  }, [editingItem, form]);

  // 处理图片上传前的验证
  const beforeUpload = (file: File) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/svg+xml";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG/SVG 格式的图片!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB!");
      return false;
    }
    return true;
  };

  // 将图片转换为base64
  const getBase64 = (img: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  // 处理上传变化
  const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done" || info.file.originFileObj) {
      getBase64(info.file.originFileObj as File, (url) => {
        setLoading(false);
        setImageUrl(url);
        form.setFieldValue("icon", url);
      });
    }
  };

  const handleSubmit = (values: any) => {
    const formData: Partial<FileSystemItem> = {
      name: values.name,
      type: values.type,
      parentId: values.parentId,
      icon: values.icon,
      position: {
        x: values.posX,
        y: values.posY,
      },
    };

    if (values.type === "web") {
      formData.url = values.url;
    }

    if (values.type === "widget") {
      formData.widgetType = values.widgetType;
      formData.size = values.size;
    }

    if (["app", "folder"].includes(values.type)) {
      formData.content = values.content;
    }

    onSave(formData);
  };

  return (
    <Modal
      title={editingItem ? "编辑项目" : "新建项目"}
      open={open}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={() => form.submit()}>
            保存
          </Button>
        </Space>
      }
      width={700}
    >
      <div style={{ height: "60vh", overflow: "auto" }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入名称" }]}
          >
            <Input placeholder="My Document" />
          </Form.Item>

          <Form.Item label="类型" name="type" rules={[{ required: true }]}>
            <Select onChange={(value) => setItemType(value as ItemType)}>
              <Option value="app">App</Option>
              <Option value="folder">Folder</Option>
              <Option value="web">Web</Option>
              <Option value="widget">Widget</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="父级ID"
            name="parentId"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="图标名称" name="icon">
            <Input placeholder="folder, file, etc." />
          </Form.Item>

          <Form.Item label="上传图标">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              customRequest={({ onSuccess }) => {
                // 自定义上传,直接返回成功
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 0);
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="icon" style={{ width: "100%" }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>上传图标</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Space style={{ width: "100%" }}>
            <Form.Item label="位置 X" name="posX" style={{ marginBottom: 0 }}>
              <InputNumber style={{ width: 150 }} />
            </Form.Item>

            <Form.Item label="位置 Y" name="posY" style={{ marginBottom: 0 }}>
              <InputNumber style={{ width: 150 }} />
            </Form.Item>
          </Space>

          {itemType === "web" && (
            <Form.Item
              label="URL"
              name="url"
              rules={[{ type: "url", message: "请输入有效的URL" }]}
            >
              <Input placeholder="https://example.com" />
            </Form.Item>
          )}

          {itemType === "widget" && (
            <>
              <Form.Item label="小部件类型" name="widgetType">
                <Select>
                  <Option value="clock">Clock</Option>
                  <Option value="calendar">Calendar</Option>
                  <Option value="weather">Weather</Option>
                </Select>
              </Form.Item>

              <Form.Item label="尺寸" name="size">
                <Select>
                  <Option value="1x1">1x1</Option>
                  <Option value="1x2">1x2</Option>
                  <Option value="2x1">2x1</Option>
                  <Option value="2x2">2x2</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {["app", "folder"].includes(itemType) && (
            <Form.Item label="内容/元数据" name="content">
              <TextArea rows={3} placeholder="可选的文本内容或JSON配置" />
            </Form.Item>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default ItemFormModal;
