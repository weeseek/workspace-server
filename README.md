# workspace-server

一个基于 Koa.js 和 Sequelize 的简单工作站服务端项目，适合新手学习 Node.js 后端开发。

## 📋 项目简介

这是一个使用 Node.js 开发的后端服务项目，主要功能包括：
- 用户注册
- 用户信息查询
- RESTful API 设计
- 数据库操作（SQLite）

## 🛠️ 技术栈

- **Node.js**：JavaScript 运行环境
- **Koa.js**：轻量级 Web 框架
- **Sequelize**：ORM 框架，用于数据库操作
- **SQLite**：轻量级数据库
- **pnpm**：包管理工具

## 📦 环境要求

- Node.js >= 16.x
- pnpm >= 7.x

## 🚀 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/weeseek/workspace-server.git
cd workspace-server
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

项目根目录下有一个 `.env` 文件，你可以根据需要修改其中的配置：

```bash
# 数据库配置
DB_HOST=localhost
DB_STORAGE=db.sqlite
```

## 🔧 运行项目

### 开发模式运行

```bash
# 使用默认端口 3000
node app.js

# 或者指定端口
PORT=3001 node app.js
```

运行成功后，你会看到以下输出：

```
Database synchronized
Server running on http://localhost:3001
```

## 📁 项目结构

```
workspace-server/
├── config/          # 配置文件
│   ├── config.js    # 应用配置
│   ├── db.js        # 数据库配置
│   └── env.js       # 环境变量配置
├── controllers/     # 控制器
│   └── modules/     # 模块控制器
├── middlewares/     # 中间件
├── models/          # 数据模型
│   └── modules/     # 模块模型
├── routers/         # 路由
│   └── modules/     # 模块路由
├── services/        # 服务层
│   └── modules/     # 模块服务
├── tests/           # 测试文件
├── utils/           # 工具函数
├── .env             # 环境变量
├── app.js           # 应用入口
└── package.json     # 项目配置
```

## 📡 API 文档

详细的 API 文档已迁移至 `doc/api.md` 文件，包含：
- 接口前缀和响应格式说明
- 用户相关 API 详细文档
- 请求参数和响应示例
- 使用 curl 测试接口的示例

请查看 [doc/api.md](doc/api.md) 获取完整的 API 文档。

## 💡 开发建议

1. **代码结构**：按照 MVC 模式组织代码，保持清晰的分层结构
2. **数据库操作**：使用 Sequelize ORM 进行数据库操作，避免直接写 SQL
3. **错误处理**：在控制器中添加适当的错误处理，返回友好的错误信息
4. **密码安全**：使用 bcrypt 对密码进行哈希处理，不要明文存储
5. **路由设计**：遵循 RESTful API 设计规范

## ❓ 常见问题

### 1. 端口被占用怎么办？

使用不同的端口运行项目：

```bash
PORT=3002 node app.js
```

### 2. 数据库同步失败？

检查 `.env` 文件中的数据库配置，确保 `DB_STORAGE` 路径正确。

### 3. 依赖安装失败？

尝试使用 npm 代替 pnpm：

```bash
npm install
```

## 📄 许可证

ISC

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，欢迎联系：baosc@outlook.com
