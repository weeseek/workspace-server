/**
 * 租户相关类型定义
 */

// 定义数据库类型枚举
export enum DbType {
    // SQLite数据库
    SQLITE = 'sqlite',
    // MySQL数据库
    MYSQL = 'mysql',
    // PostgreSQL数据库
    POSTGRESQL = 'postgres'
}

// 定义租户状态枚举
export enum TenantStatus {
    // 激活状态
    ACTIVE = 'active',
    // 禁用状态
    INACTIVE = 'inactive'
}

// 定义租户数据库配置接口
export interface TenantDbConfig {
    // 数据库类型
    type: DbType;
    // 数据库名称
    name: string;
    // 数据库主机（非SQLite需要）
    host?: string;
    // 数据库端口（非SQLite需要）
    port?: number;
    // 数据库用户名（非SQLite需要）
    username?: string;
    // 数据库密码（非SQLite需要）
    password?: string;
    // SQLite数据库存储路径
    storage?: string;
}

// 定义租户请求体接口
export interface CreateTenantRequestBody {
    // 租户ID
    tenantId: string;
    // 租户名称
    name: string;
    // 租户状态
    status?: TenantStatus;
    // 租户数据库配置
    dbConfig: TenantDbConfig;
    // 租户描述
    description?: string;
}

// 定义租户更新请求体接口
export interface UpdateTenantRequestBody extends Partial<CreateTenantRequestBody> {
    // 租户ID，更新时不可修改
    tenantId?: string;
}

// 定义租户响应接口
export interface TenantResponse {
    // 租户ID
    tenantId: string;
    // 租户名称
    name: string;
    // 租户状态
    status: TenantStatus;
    // 租户数据库配置
    dbConfig: TenantDbConfig;
    // 租户描述
    description?: string;
    // 创建时间
    createdAt: Date;
    // 更新时间
    updatedAt: Date;
}
