# macOS Backend API 文档

## 项目概述

这是一个基于 NestJS + Prisma + PostgreSQL 的后端项目,为 macOS 风格的桌面系统提供完整的后端支持。

### 技术栈

- **框架**: NestJS (TypeScript)
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **认证**: JWT (Json Web Token)
- **密码加密**: bcrypt

### 基础信息

- **基础URL**: `http://localhost:3000`
- **认证方式**: JWT Bearer Token
- **内容类型**: `application/json`

### 统一响应格式

**所有接口都会返回统一的数据结构:**

```typescript
{
  code: number // 状态码: 0表示成功,其他值表示错误
  data: T | null // 响应数据,错误时为null
  msg: string // 提示信息: "success" 或错误描述
}
```

**成功响应示例**:

```json
{
  "code": 0,
  "data": {
    "id": "123",
    "name": "示例数据"
  },
  "msg": "success"
}
```

**错误响应示例**:

```json
{
  "code": 404,
  "data": null,
  "msg": "资源不存在"
}
```

**注意**: 文档中的响应示例为了简洁,直接展示 `data` 字段的内容。实际使用时请注意所有响应都会包装在上述统一格式中。

---

## 认证说明

### JWT Token 使用

大部分接口需要在请求头中携带 JWT Token:

```http
Authorization: Bearer <your_jwt_token>
```

### 获取 Token

通过登录接口获取 Token,详见 [登录接口](#1-用户登录)。

---

## 数据模型

### User (用户)

```typescript
{
  id: string // UUID
  email: string // 邮箱,唯一
  password: string // 密码 (已加密,不返回给前端)
  role: string // 角色: "user" | "admin" | "developer"
  createdAt: DateTime // 创建时间
  updatedAt: DateTime // 更新时间
}
```

### File (文件/文件夹)

```typescript
{
  id: string              // UUID
  userId: string          // 所属用户ID
  parentId: string        // 父文件夹ID,桌面为 "root"
  name: string            // 文件名
  type: string            // 类型: "file" | "folder" | "widget" | "link"
  content?: string        // 文本内容 (可选)
  icon?: string           // 图标URL (可选)
  url?: string            // 链接地址 (可选)
  widgetType?: string     // 组件类型: "clock" | "calendar" (可选)
  size?: string           // 组件尺寸: "1x1" | "2x2" (可选)
  createdAt: DateTime     // 创建时间
  updatedAt: DateTime     // 更新时间
}
```

### MarketApp (应用市场)

```typescript
{
  id: string              // UUID
  title: string           // 应用标题
  description: string     // 应用描述
  icon: string            // 图标URL或CSS类名
  category: string        // 分类: "productivity" | "games" | "widgets"
  type: string            // 类型: "widget" | "link" | "app"
  widgetType?: string     // 组件类型 (可选)
  defaultSize?: string    // 默认尺寸 (可选)
  url?: string            // 链接地址 (可选)
  price: number           // 价格,默认0.0
  installCount: number    // 安装次数
  createdAt: DateTime     // 创建时间
  updatedAt: DateTime     // 更新时间
}
```

### DesktopLayout (桌面布局)

```typescript
{
  id: string              // UUID
  userId: string          // 用户ID,唯一
  desktopOrder: string[]  // 桌面图标顺序数组
  folderOrders: {         // 文件夹内应用顺序映射
    [folderId: string]: string[]
  }
  createdAt: DateTime     // 创建时间
  updatedAt: DateTime     // 更新时间
}
```

---

## API 接口

## 1. 认证模块 (Auth)

### 1.1 用户登录

**接口**: `POST /auth/login`

**认证**: 无需认证

**请求体**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应** (200):

```json
{
  "code": 0,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "role": "user"
    }
  },
  "msg": "success"
}
```

**错误响应** (401):

```json
{
  "code": 401,
  "data": null,
  "msg": "账号或密码错误"
}
```

---

## 2. 用户模块 (User)

### 2.1 创建用户(注册)

**接口**: `POST /user`

**认证**: 无需认证

**请求体**:

```json
{
  "email": "newuser@example.com",
  "password": "securePassword123"
}
```

**成功响应** (201):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "newuser@example.com",
  "role": "user"
}
```

**错误响应** (409):

```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

### 2.2 查询所有用户

**接口**: `GET /user`

**认证**: 无需认证

**成功响应** (200):

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user1@example.com",
    "role": "user"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user2@example.com",
    "role": "admin"
  }
]
```

### 2.3 查询单个用户

**接口**: `GET /user/:id`

**认证**: 无需认证

**成功响应** (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "user"
}
```

### 2.4 更新用户

**接口**: `PATCH /user/:id`

**认证**: 无需认证

**请求体**:

```json
{
  "email": "updated@example.com",
  "password": "newPassword456"
}
```

**成功响应** (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "updated@example.com",
  "role": "user"
}
```

### 2.5 删除用户

**接口**: `DELETE /user/:id`

**认证**: 无需认证

**成功响应** (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "user"
}
```

---

## 3. 文件管理模块 (File)

所有接口需要 JWT 认证。

### 3.1 创建文件/文件夹

**接口**: `POST /files`

**认证**: 需要 JWT

**请求体**:

```json
{
  "parentId": "root",
  "name": "我的文件夹",
  "type": "folder"
}
```

或创建一个组件:

```json
{
  "parentId": "root",
  "name": "时钟",
  "type": "widget",
  "widgetType": "clock",
  "size": "2x2"
}
```

**成功响应** (201):

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "parentId": "root",
  "name": "我的文件夹",
  "type": "folder",
  "createdAt": "2025-12-30T03:00:00.000Z",
  "updatedAt": "2025-12-30T03:00:00.000Z"
}
```

### 3.2 查询所有文件

**接口**: `GET /files`

**认证**: 需要 JWT

**成功响应** (200):

```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": "root",
    "name": "我的文件夹",
    "type": "folder",
    "createdAt": "2025-12-30T03:00:00.000Z",
    "updatedAt": "2025-12-30T03:00:00.000Z"
  },
  {
    "id": "a58de563-1234-5678-9abc-def012345678",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": "root",
    "name": "时钟",
    "type": "widget",
    "widgetType": "clock",
    "size": "2x2",
    "createdAt": "2025-12-30T03:05:00.000Z",
    "updatedAt": "2025-12-30T03:05:00.000Z"
  }
]
```

### 3.3 查询单个文件

**接口**: `GET /files/:id`

**认证**: 需要 JWT

**成功响应** (200):

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "parentId": "root",
  "name": "我的文件夹",
  "type": "folder",
  "createdAt": "2025-12-30T03:00:00.000Z",
  "updatedAt": "2025-12-30T03:00:00.000Z"
}
```

**错误响应** (404):

```json
{
  "statusCode": 404,
  "message": "File not found"
}
```

### 3.4 更新文件

**接口**: `PATCH /files/:id`

**认证**: 需要 JWT

**请求体**:

```json
{
  "name": "重命名的文件夹",
  "parentId": "another-folder-id"
}
```

**成功响应** (200):

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "parentId": "another-folder-id",
  "name": "重命名的文件夹",
  "type": "folder",
  "createdAt": "2025-12-30T03:00:00.000Z",
  "updatedAt": "2025-12-30T03:10:00.000Z"
}
```

### 3.5 删除文件

**接口**: `DELETE /files/:id`

**认证**: 需要 JWT

**说明**: 删除文件夹时会递归删除其中所有子文件

**成功响应** (200):

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "parentId": "root",
  "name": "我的文件夹",
  "type": "folder"
}
```

---

## 4. 应用市场模块 (Market)

所有接口需要 JWT 认证。管理接口需要 admin 角色。

### 4.1 查询应用列表

**接口**: `GET /market`

**认证**: 需要 JWT

**查询参数**:

- `category`: 分类筛选 (可选)
- `search`: 搜索关键字 (可选)

**示例**: `GET /market?category=widgets&search=clock`

**成功响应** (200):

```json
[
  {
    "id": "c9bf9e57-1685-4c89-bafb-ff5af830be8a",
    "title": "数字时钟",
    "description": "简洁的数字时钟组件",
    "icon": "🕐",
    "category": "widgets",
    "type": "widget",
    "widgetType": "clock",
    "defaultSize": "2x2",
    "price": 0,
    "installCount": 1523,
    "createdAt": "2025-12-30T00:00:00.000Z",
    "updatedAt": "2025-12-30T00:00:00.000Z"
  }
]
```

### 4.2 查询单个应用

**接口**: `GET /market/:id`

**认证**: 需要 JWT

**成功响应** (200):

```json
{
  "id": "c9bf9e57-1685-4c89-bafb-ff5af830be8a",
  "title": "数字时钟",
  "description": "简洁的数字时钟组件",
  "icon": "🕐",
  "category": "widgets",
  "type": "widget",
  "widgetType": "clock",
  "defaultSize": "2x2",
  "price": 0,
  "installCount": 1523,
  "createdAt": "2025-12-30T00:00:00.000Z",
  "updatedAt": "2025-12-30T00:00:00.000Z"
}
```

### 4.3 安装应用

**接口**: `POST /market/:id/install`

**认证**: 需要 JWT

**说明**: 将市场中的应用安装到用户桌面(自动创建文件记录)

**成功响应** (201):

```json
{
  "id": "new-file-id",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "parentId": "root",
  "name": "数字时钟",
  "type": "widget",
  "widgetType": "clock",
  "size": "2x2",
  "createdAt": "2025-12-30T03:20:00.000Z",
  "updatedAt": "2025-12-30T03:20:00.000Z"
}
```

### 4.4 创建应用 (管理员)

**接口**: `POST /market`

**认证**: 需要 JWT + admin 角色

**请求体**:

```json
{
  "title": "新应用",
  "description": "应用描述",
  "icon": "🎮",
  "category": "games",
  "type": "app",
  "price": 0
}
```

**成功响应** (201):

```json
{
  "id": "new-app-id",
  "title": "新应用",
  "description": "应用描述",
  "icon": "🎮",
  "category": "games",
  "type": "app",
  "price": 0,
  "installCount": 0,
  "createdAt": "2025-12-30T03:25:00.000Z",
  "updatedAt": "2025-12-30T03:25:00.000Z"
}
```

**错误响应** (403 - 权限不足):

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 4.5 更新应用 (管理员)

**接口**: `PATCH /market/:id`

**认证**: 需要 JWT + admin 角色

**请求体**:

```json
{
  "title": "更新后的标题",
  "price": 9.99
}
```

**成功响应** (200):

```json
{
  "id": "app-id",
  "title": "更新后的标题",
  "description": "应用描述",
  "icon": "🎮",
  "category": "games",
  "type": "app",
  "price": 9.99,
  "installCount": 100,
  "createdAt": "2025-12-30T03:25:00.000Z",
  "updatedAt": "2025-12-30T03:30:00.000Z"
}
```

### 4.6 删除应用 (管理员)

**接口**: `DELETE /market/:id`

**认证**: 需要 JWT + admin 角色

**成功响应** (200):

```json
{
  "id": "app-id",
  "title": "已删除的应用",
  "message": "删除成功"
}
```

---

## 5. 桌面布局模块 (Desktop)

所有接口需要 JWT 认证。

### 5.1 保存桌面布局

**接口**: `POST /desktop/layout`

**认证**: 需要 JWT

**请求体**:

```json
{
  "desktopOrder": ["file-id-1", "folder-id-1", "widget-id-1"],
  "folderOrders": {
    "folder-id-1": ["app-id-1", "app-id-2"],
    "folder-id-2": ["app-id-3", "app-id-4"]
  }
}
```

**成功响应** (200):

```json
{
  "id": "layout-id",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "desktopOrder": ["file-id-1", "folder-id-1", "widget-id-1"],
  "folderOrders": {
    "folder-id-1": ["app-id-1", "app-id-2"],
    "folder-id-2": ["app-id-3", "app-id-4"]
  },
  "createdAt": "2025-12-30T03:35:00.000Z",
  "updatedAt": "2025-12-30T03:35:00.000Z"
}
```

### 5.2 获取桌面布局

**接口**: `GET /desktop/layout`

**认证**: 需要 JWT

**成功响应** (200):

```json
{
  "desktopOrder": ["file-id-1", "folder-id-1", "widget-id-1"],
  "folderOrders": {
    "folder-id-1": ["app-id-1", "app-id-2"],
    "folder-id-2": ["app-id-3", "app-id-4"]
  }
}
```

**响应** (未保存过布局时):

```json
{
  "desktopOrder": [],
  "folderOrders": {}
}
```

---

## 6. 用户管理模块 (User Manage)

所有接口需要 JWT 认证。

### 6.1 查询用户列表 (分页)

**接口**: `GET /user-manage`

**认证**: 需要 JWT

**查询参数**:

- `page`: 页码,默认 1
- `pageSize`: 每页数量,默认 10
- `email`: 邮箱搜索关键字 (可选,不区分大小写)
- `role`: 角色筛选 (可选)
- `sortBy`: 排序字段,默认 `createdAt`
- `sortOrder`: 排序方向 `asc` | `desc`,默认 `desc`

**示例**: `GET /user-manage?page=1&pageSize=10&email=test&role=user&sortBy=createdAt&sortOrder=desc`

**成功响应** (200):

```json
{
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2025-12-30T00:00:00.000Z",
      "updatedAt": "2025-12-30T00:00:00.000Z"
    }
  ]
}
```

### 6.2 创建用户

**接口**: `POST /user-manage`

**认证**: 需要 JWT

**请求体**:

```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**成功响应** (201):

```json
{
  "id": "new-user-id",
  "email": "newuser@example.com",
  "role": "user",
  "createdAt": "2025-12-30T03:40:00.000Z",
  "updatedAt": "2025-12-30T03:40:00.000Z"
}
```

**错误响应** (409):

```json
{
  "statusCode": 409,
  "message": "邮箱已存在"
}
```

### 6.3 更新用户

**接口**: `PATCH /user-manage/:id`

**认证**: 需要 JWT

**请求体** (所有字段可选):

```json
{
  "email": "updated@example.com",
  "password": "newPassword456",
  "role": "admin"
}
```

**成功响应** (200):

```json
{
  "id": "user-id",
  "email": "updated@example.com",
  "role": "admin",
  "createdAt": "2025-12-30T03:40:00.000Z",
  "updatedAt": "2025-12-30T03:45:00.000Z"
}
```

**错误响应** (404):

```json
{
  "statusCode": 404,
  "message": "用户不存在"
}
```

**错误响应** (409):

```json
{
  "statusCode": 409,
  "message": "邮箱已被其他用户使用"
}
```

### 6.4 删除用户

**接口**: `DELETE /user-manage/:id`

**认证**: 需要 JWT

**成功响应** (200):

```json
{
  "message": "删除成功"
}
```

**错误响应** (404):

```json
{
  "statusCode": 404,
  "message": "用户不存在"
}
```

### 6.5 批量删除用户

**接口**: `POST /user-manage/batch-delete`

**认证**: 需要 JWT

**请求体**:

```json
{
  "ids": ["user-id-1", "user-id-2", "user-id-3"]
}
```

**成功响应** (200):

```json
{
  "message": "批量删除成功",
  "count": 3
}
```

---

## 通用错误响应

所有错误响应都遵循统一格式,HTTP状态码会设置为对应的错误状态,同时 `code` 字段也会包含错误码。

### 401 未授权

```json
{
  "code": 401,
  "data": null,
  "msg": "Unauthorized"
}
```

### 403 权限不足

```json
{
  "code": 403,
  "data": null,
  "msg": "Forbidden resource"
}
```

### 404 资源不存在

```json
{
  "code": 404,
  "data": null,
  "msg": "Not Found"
}
```

### 409 资源冲突

```json
{
  "code": 409,
  "data": null,
  "msg": "邮箱已存在"
}
```

### 500 服务器错误

```json
{
  "code": -1,
  "data": null,
  "msg": "Internal Server Error"
}
```

### DTO 验证错误 (400)

```json
{
  "code": 400,
  "data": null,
  "msg": "email must be an email, password should not be empty"
}
```

---

## 前端集成示例

### 响应数据解包

由于后端使用统一响应格式,前端需要从 `data` 字段中提取实际数据:

```typescript
// 所有成功的响应格式
interface ApiResponse<T> {
  code: number // 0 表示成功
  data: T | null // 实际数据
  msg: string // 提示信息
}
```

### 1. 用户登录并保存 Token

```typescript
// 登录
const loginResponse = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})

const result = await loginResponse.json()

// 检查业务状态码
if (result.code === 0) {
  const { access_token, user } = result.data
  // 保存 Token 到 localStorage
  localStorage.setItem('access_token', access_token)
  console.log('登录成功:', user)
} else {
  console.error('登录失败:', result.msg)
}
```

### 2. 使用 Token 请求受保护的接口

```typescript
const token = localStorage.getItem('access_token')

const filesResponse = await fetch('http://localhost:3000/files', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const result = await filesResponse.json()

if (result.code === 0) {
  const files = result.data
  console.log('文件列表:', files)
} else {
  console.error('获取文件失败:', result.msg)
}
```

### 3. 创建文件

```typescript
const token = localStorage.getItem('access_token')

const createFileResponse = await fetch('http://localhost:3000/files', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    parentId: 'root',
    name: '我的文档',
    type: 'folder'
  })
})

const result = await createFileResponse.json()

if (result.code === 0) {
  const newFile = result.data
  console.log('创建成功:', newFile)
} else {
  console.error('创建失败:', result.msg)
}
```

### 4. 保存桌面布局

```typescript
const token = localStorage.getItem('access_token')

const saveLayoutResponse = await fetch('http://localhost:3000/desktop/layout', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    desktopOrder: ['file-id-1', 'folder-id-1'],
    folderOrders: {
      'folder-id-1': ['app-id-1', 'app-id-2']
    }
  })
})

const result = await saveLayoutResponse.json()

if (result.code === 0) {
  const layout = result.data
  console.log('保存成功:', layout)
} else {
  console.error('保存失败:', result.msg)
}
```

### 5. 分页查询用户列表

```typescript
const token = localStorage.getItem('access_token')

const queryUsersResponse = await fetch('http://localhost:3000/user-manage?page=1&pageSize=10&email=test', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const result = await queryUsersResponse.json()

if (result.code === 0) {
  const { total, page, pageSize, data } = result.data
  console.log(`共 ${total} 条记录,当前第 ${page} 页:`, data)
} else {
  console.error('查询失败:', result.msg)
}
```

---

## 开发建议

### 1. 统一的请求封装

建议封装一个统一的请求函数来处理响应格式:

```typescript
interface ApiResponse<T> {
  code: number
  data: T | null
  msg: string
}

async function apiRequest<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  const result: ApiResponse<T> = await response.json()

  // 检查业务状态码
  if (result.code === 0) {
    return result.data as T
  } else {
    throw new Error(result.msg || '请求失败')
  }
}

// 使用示例
try {
  const files = await apiRequest<File[]>('http://localhost:3000/files', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  console.log('文件列表:', files)
} catch (error) {
  console.error('请求失败:', error.message)
}
```

### 2. Token 过期处理

当收到 401 错误时,清除本地 Token 并跳转到登录页:

```typescript
async function apiRequest<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  const result: ApiResponse<T> = await response.json()

  // 处理 401 未授权
  if (result.code === 401) {
    localStorage.removeItem('access_token')
    window.location.href = '/login'
    throw new Error('请重新登录')
  }

  if (result.code === 0) {
    return result.data as T
  } else {
    throw new Error(result.msg || '请求失败')
  }
}
```

### 3. 使用 axios 的完整示例

```typescript
import axios from 'axios'

// 定义统一响应接口
interface ApiResponse<T> {
  code: number
  data: T | null
  msg: string
}

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// 请求拦截器 - 自动添加 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 处理统一响应格式
api.interceptors.response.use(
  (response) => {
    const result: ApiResponse<any> = response.data

    // 业务成功,返回实际数据
    if (result.code === 0) {
      return result.data
    }

    // 业务失败,抛出错误
    return Promise.reject(new Error(result.msg || '请求失败'))
  },
  (error) => {
    // HTTP 错误
    if (error.response) {
      const result: ApiResponse<any> = error.response.data

      // 401 未授权 - 跳转登录
      if (result.code === 401) {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }

      return Promise.reject(new Error(result.msg || '请求失败'))
    }

    return Promise.reject(error)
  }
)

export default api

// 使用示例
import api from './api'

// 登录
const loginData = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
})
// loginData 已经是解包后的 data 字段内容
localStorage.setItem('access_token', loginData.access_token)

// 获取文件列表
const files = await api.get('/files')
// files 已经是解包后的文件数组
console.log('文件列表:', files)
```

### 4. TypeScript 类型定义

建议定义完整的类型:

```typescript
// 统一响应类型
interface ApiResponse<T> {
  code: number
  data: T | null
  msg: string
}

// 用户类型
interface User {
  id: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

// 文件类型
interface File {
  id: string
  userId: string
  parentId: string
  name: string
  type: 'file' | 'folder' | 'widget' | 'link'
  content?: string
  icon?: string
  url?: string
  widgetType?: 'clock' | 'calendar'
  size?: '1x1' | '2x2'
  createdAt: string
  updatedAt: string
}

// 分页响应类型
interface PaginationResponse<T> {
  total: number
  page: number
  pageSize: number
  data: T[]
}
```

````

---

## 附录

### 常用数据示例

#### 创建时钟组件

```json
{
  "parentId": "root",
  "name": "数字时钟",
  "type": "widget",
  "widgetType": "clock",
  "size": "2x2"
}
````

#### 创建日历组件

```json
{
  "parentId": "root",
  "name": "日历",
  "type": "widget",
  "widgetType": "calendar",
  "size": "2x2"
}
```

#### 创建链接

```json
{
  "parentId": "root",
  "name": "Google",
  "type": "link",
  "url": "https://www.google.com",
  "icon": "🔗"
}
```

#### 创建文本文件

```json
{
  "parentId": "folder-id",
  "name": "笔记.txt",
  "type": "file",
  "content": "这是文本内容"
}
```

---

## 联系与支持

如有问题,请联系后端开发团队。

**文档版本**: 1.0  
**最后更新**: 2025-12-30
