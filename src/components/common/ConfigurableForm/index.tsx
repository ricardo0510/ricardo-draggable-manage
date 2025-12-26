import React, { useEffect } from "react";
import { Form } from "antd";
import type { FormInstance, FormProps } from "antd";
import "./index.scss";

// 表单项配置
export interface FormItemConfig {
  name: string;
  title?: string;
  render?: (form: FormInstance) => React.ReactNode;
}

interface ConfigurableFormProps {
  items: FormItemConfig[];
  initialValues?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  layout?: "horizontal" | "vertical" | "inline";
  form?: FormInstance;
  formProps?: Omit<
    FormProps,
    "form" | "layout" | "initialValues" | "onValuesChange"
  >;
}

const ConfigurableForm: React.FC<ConfigurableFormProps> = ({
  items,
  initialValues,
  onChange,
  layout = "inline",
  form: externalForm,
  formProps,
}) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleValuesChange = (_: any, allValues: any) => {
    onChange?.(allValues);
  };

  return (
    <Form
      form={form}
      layout={layout}
      className="configurable-form"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
      {...formProps}
    >
      {items.map((item) => (
        <Form.Item key={item.name} name={item.name} label={item.title}>
          {item.render?.(form)}
        </Form.Item>
      ))}
    </Form>
  );
};

export default ConfigurableForm;
