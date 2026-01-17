# API 文档

本项目提供了RESTful API接口，用于工作站服务的各种功能。

## 🔍 基础信息

### 接口前缀
所有API接口都以 `/api` 开头，例如：`http://localhost:3001/api/users/register`

### 响应格式
所有API响应均为JSON格式，包含以下字段：
- `message`：操作结果的描述信息
- `data` 或具体资源字段：返回的数据内容
- 状态码：HTTP状态码表示操作结果

## 📡 用户相关 API

### 1. 注册新用户

**功能**：创建一个新的用户账号

**请求方式**：POST
**URL**：`/api/users/register`
**请求体**：
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "nickname": "测试用户",
  "avatar": "https://example.com/avatar.jpg",
  "gender": "male",
  "birthday": "1990-01-01T00:00:00.000Z",
  "phone": "13800138000"
}
```

**请求参数说明**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名，长度不限，唯一 |
| email | string | 是 | 邮箱地址，必须符合邮箱格式，唯一 |
| password | string | 是 | 密码，长度不限 |
| nickname | string | 否 | 用户昵称 |
| avatar | string | 否 | 用户头像URL，必须符合URL格式 |
| gender | string | 否 | 性别，可选值：male, female, other |
| birthday | string | 否 | 生日，ISO 8601格式，如：1990-01-01T00:00:00.000Z |
| phone | string | 否 | 手机号，必须为数字，唯一 |

**响应示例**：
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "nickname": "测试用户",
    "avatar": "https://example.com/avatar.jpg",
    "gender": "male",
    "birthday": "1990-01-01T00:00:00.000Z",
    "phone": "13800138000",
    "status": "active",
    "createdAt": "2026-01-17T03:50:31.538Z"
  }
}
```

**状态码**：
- 201：用户注册成功
- 400：参数错误或用户名/邮箱已存在
- 500：服务器内部错误

### 2. 获取用户信息

**功能**：根据用户ID获取用户信息

**请求方式**：GET
**URL**：`/api/users/:id`
**URL参数**：
- `id`：用户ID，整数

**响应示例**：
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "password": "$2b$10$...",
  "createdAt": "2026-01-17T03:50:31.538Z",
  "updatedAt": "2026-01-17T03:50:31.538Z"
}
```

**状态码**：
- 200：成功获取用户信息
- 404：用户不存在
- 500：服务器内部错误

### 3. 获取用户列表

**功能**：获取所有用户的列表

**请求方式**：GET
**URL**：`/api/users/`

**响应示例**：
```json
User module route
```

**状态码**：
- 200：成功获取用户列表
- 500：服务器内部错误

## 📝 接口使用示例

### 使用 curl 测试注册接口

```bash
curl -X POST -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"password123"}' http://localhost:3001/api/users/register
```

### 使用 curl 测试获取用户信息接口

```bash
curl http://localhost:3001/api/users/1
```
