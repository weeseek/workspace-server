import swaggerJSDoc from 'swagger-jsdoc';

// Swagger 配置选项
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workspace Server API',
      version: '1.0.0',
      description: '工作站服务端 API 文档',
      contact: {
        name: 'baosc',
        email: 'baosc@outlook.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer {token}',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '用户ID',
            },
            username: {
              type: 'string',
              description: '用户名',
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱',
            },
            nickname: {
              type: 'string',
              description: '昵称',
            },
            avatar: {
              type: 'string',
              description: '头像URL',
            },
            phone: {
              type: 'string',
              description: '手机号',
            },
            status: {
              type: 'integer',
              description: '状态，1-启用，0-禁用',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
            },
          },
        },
        Menu: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '菜单ID',
            },
            name: {
              type: 'string',
              description: '菜单名称',
            },
            code: {
              type: 'string',
              description: '菜单编码',
            },
            type: {
              type: 'string',
              enum: ['NODE', 'PAGE', 'LINK'],
              description: '菜单类型',
            },
            path: {
              type: 'string',
              description: '菜单路径',
            },
            icon: {
              type: 'string',
              description: '菜单图标',
            },
            parentId: {
              type: 'integer',
              description: '父菜单ID',
            },
            order: {
              type: 'integer',
              description: '排序',
            },
            status: {
              type: 'integer',
              description: '状态，1-启用，0-禁用',
            },
            children: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Menu',
              },
              description: '子菜单',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              description: '状态码',
            },
            message: {
              type: 'string',
              description: '响应消息',
            },
            data: {
              type: 'object',
              description: '响应数据',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: '用户名',
            },
            password: {
              type: 'string',
              description: '密码',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password', 'email'],
          properties: {
            username: {
              type: 'string',
              description: '用户名',
            },
            password: {
              type: 'string',
              description: '密码',
            },
            email: {
              type: 'string',
              format: 'email',
              description: '邮箱',
            },
            nickname: {
              type: 'string',
              description: '昵称',
            },
            phone: {
              type: 'string',
              description: '手机号',
            },
          },
        },
        TokenResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: '访问令牌',
            },
            refreshToken: {
              type: 'string',
              description: '刷新令牌',
            },
            expiresIn: {
              type: 'integer',
              description: '令牌过期时间（秒）',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './controllers/**/*.ts',
    './routers/**/*.ts',
    './models/**/*.ts',
  ],
};

// 创建 swagger 文档
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
