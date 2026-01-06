# ConfigurableForm 通用表单组件

极简的可配置表单组件,通过 render 函数自定义表单控件。

## 特性

- ✅ **极简配置** - 只需要 name、title、render 三个属性
- ✅ **完全自定义** - 通过 render 函数完全控制表单控件
- ✅ **Form 实例暴露** - render 函数可访问 form 实例
- ✅ **灵活触发** - 在 render 函数中自定义触发逻辑
- ✅ **TypeScript 支持** - 完整的类型定义

## 基础用法

```tsx
import ConfigurableForm, { type FormItemConfig } from '@/components/common/ConfigurableForm'
import { Input, Select } from 'antd'

const formItems: FormItemConfig[] = [
  {
    name: 'searchTerm',
    render: (form) => (
      <Input
        placeholder="搜索..."
        onBlur={(e) => {
          form.setFieldValue('searchTerm', e.target.value)
          form.submit() // 触发onChange
        }}
      />
    )
  },
  {
    name: 'category',
    title: '分类', // 可选的标签
    render: () => (
      <Select placeholder="选择分类">
        <Select.Option value="all">全部</Select.Option>
        <Select.Option value="option1">选项1</Select.Option>
      </Select>
    )
  }
]

;<ConfigurableForm
  items={formItems}
  initialValues={{ searchTerm: '', category: 'all' }}
  onChange={(values) => {
    console.log('表单值变更:', values)
  }}
/>
```

## 完整示例

### 失焦触发的搜索框

```tsx
{
  name: "keyword",
  render: (form) => (
    <Input
      prefix={<SearchOutlined />}
      placeholder="搜索..."
      style={{ width: 300 }}
      onBlur={(e) => {
        form.setFieldValue("keyword", e.target.value);
        form.submit(); // 手动触发onChange
      }}
    />
  ),
}
```

### 回车触发的搜索框

```tsx
{
  name: "keyword",
  render: (form) => (
    <Input
      placeholder="按回车搜索"
      onPressEnter={(e) => {
        form.setFieldValue("keyword", e.currentTarget.value);
        form.submit();
      }}
    />
  ),
}
```

### 立即触发的下拉框

```tsx
{
  name: "status",
  title: "状态",
  render: () => (
    <Select style={{ width: 200 }}>
      <Select.Option value="active">启用</Select.Option>
      <Select.Option value="inactive">禁用</Select.Option>
    </Select>
  ),
}
```

### 自定义复杂控件

```tsx
{
  name: "dateRange",
  title: "日期范围",
  render: (form) => {
    const handleChange = (dates: any) => {
      form.setFieldValue("dateRange", dates);
      // 可以在这里添加额外的逻辑
      if (dates && dates[0] && dates[1]) {
        console.log("选择了日期范围");
      }
    };

    return (
      <DatePicker.RangePicker onChange={handleChange} />
    );
  },
}
```

## API

### ConfigurableForm Props

| 属性          | 说明                | 类型                                     | 默认值     |
| ------------- | ------------------- | ---------------------------------------- | ---------- |
| items         | 表单项配置数组      | `FormItemConfig[]`                       | -          |
| initialValues | 初始值              | `Record<string, any>`                    | -          |
| onChange      | 值变更回调          | `(values: Record<string, any>) => void`  | -          |
| layout        | 表单布局            | `'horizontal' \| 'vertical' \| 'inline'` | `'inline'` |
| form          | 外部 Form 实例      | `FormInstance`                           | -          |
| formProps     | Form 组件的其他属性 | `FormProps`                              | -          |

### FormItemConfig

| 属性   | 说明     | 类型                                      | 是否必填 |
| ------ | -------- | ----------------------------------------- | -------- |
| name   | 字段名   | `string`                                  | 是       |
| title  | 标签文本 | `string`                                  | 否       |
| render | 渲染函数 | `(form: FormInstance) => React.ReactNode` | 是       |

## Form 实例方法

在 render 函数中可以使用的 form 实例方法:

- `form.setFieldValue(name, value)` - 设置字段值
- `form.getFieldValue(name)` - 获取字段值
- `form.submit()` - 手动触发表单提交(会触发 onChange)
- `form.validateFields()` - 验证表单
- 更多方法见 [Ant Design Form API](https://ant.design/components/form-cn#FormInstance)

## 实际应用场景

### 文件系统筛选 ([示例](file:///c:/Users/Ricardo/Downloads/os-dashboard-manager/src/pages/FileSystem/index.tsx))

```tsx
const formItems: FormItemConfig[] = [
  {
    name: 'searchTerm',
    render: (form) => (
      <Input
        prefix={<SearchOutlined />}
        placeholder="搜索名称或ID..."
        style={{ width: 300 }}
        onBlur={(e) => {
          form.setFieldValue('searchTerm', e.target.value)
          form.submit()
        }}
      />
    )
  },
  {
    name: 'filterType',
    render: () => (
      <Select style={{ width: 200 }} placeholder="选择类型">
        <Select.Option value="all">全部</Select.Option>
        <Select.Option value="app">App</Select.Option>
        <Select.Option value="folder">Folder</Select.Option>
        <Select.Option value="web">Web</Select.Option>
        <Select.Option value="widget">Widget</Select.Option>
      </Select>
    )
  }
]
```

## 设计理念

ConfigurableForm 只做三件事:

1. **提供 Form 容器** - 管理表单状态和布局
2. **暴露 Form 实例** - 让使用者完全控制表单行为
3. **统一 onChange** - 提供统一的值变更回调

所有其他逻辑(触发时机、验证、格式化等)都在 render 函数中自行处理,保持组件的简单和灵活。

## 为什么这样设计?

- ❌ 不需要定义 type、trigger、options 等复杂配置
- ✅ 使用者可以使用任何 Ant Design 组件或自定义组件
- ✅ 完全控制事件处理逻辑
- ✅ 易于理解和维护
- ✅ 更小的学习成本
