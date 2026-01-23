import { Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';
import path from 'path';
import { DbType } from '../types/tenant';

// 主数据库连接（用于存储租户信息）
import { sequelize as mainSequelize } from './db';

// 定义租户数据库配置接口
interface TenantDbConfig {
    type: DbType;
    name: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    storage?: string;
}

/**
 * 多租户数据库管理器
 * 用于管理不同租户的数据库连接
 */
export class MultiTenantDbManager {
    // 存储所有租户的数据库连接
    private static tenantConnections: Map<string, Sequelize> = new Map();
    
    /**
     * 获取主数据库连接（用于存储租户信息）
     * @returns {Sequelize} 主数据库连接
     */
    public static getMainConnection(): Sequelize {
        return mainSequelize;
    }
    
    /**
     * 为租户创建数据库连接
     * @param {string} tenantId - 租户ID
     * @param {TenantDbConfig} dbConfig - 租户数据库配置
     * @returns {Sequelize} 租户数据库连接
     */
    public static createTenantConnection(tenantId: string, dbConfig: TenantDbConfig): Sequelize {
        let sequelize: Sequelize;
        
        switch (dbConfig.type) {
            case DbType.SQLITE:
                // SQLite数据库配置
                sequelize = new Sequelize({
                    dialect: 'sqlite',
                    dialectModule: sqlite3.verbose(),
                    storage: dbConfig.storage || path.join(__dirname, `../databases/${tenantId}.sqlite`),
                    logging: false
                });
                break;
            
            case DbType.MYSQL:
                // MySQL数据库配置
                sequelize = new Sequelize({
                    dialect: 'mysql',
                    host: dbConfig.host,
                    port: dbConfig.port,
                    database: dbConfig.name,
                    username: dbConfig.username,
                    password: dbConfig.password,
                    logging: false
                });
                break;
            
            case DbType.POSTGRESQL:
                // PostgreSQL数据库配置
                sequelize = new Sequelize({
                    dialect: 'postgres',
                    host: dbConfig.host,
                    port: dbConfig.port,
                    database: dbConfig.name,
                    username: dbConfig.username,
                    password: dbConfig.password,
                    logging: false
                });
                break;
            
            default:
                throw new Error(`Unsupported database type: ${dbConfig.type}`);
        }
        
        // 存储租户连接
        this.tenantConnections.set(tenantId, sequelize);
        
        return sequelize;
    }
    
    /**
     * 获取租户数据库连接
     * @param {string} tenantId - 租户ID
     * @returns {Sequelize | undefined} 租户数据库连接，如果不存在则返回undefined
     */
    public static getTenantConnection(tenantId: string): Sequelize | undefined {
        return this.tenantConnections.get(tenantId);
    }
    
    /**
     * 检查租户数据库连接是否存在
     * @param {string} tenantId - 租户ID
     * @returns {boolean} 连接是否存在
     */
    public static hasTenantConnection(tenantId: string): boolean {
        return this.tenantConnections.has(tenantId);
    }
    
    /**
     * 删除租户数据库连接
     * @param {string} tenantId - 租户ID
     * @returns {boolean} 是否删除成功
     */
    public static removeTenantConnection(tenantId: string): boolean {
        return this.tenantConnections.delete(tenantId);
    }
    
    /**
     * 关闭所有租户数据库连接
     * @returns {Promise<void>} 关闭操作的Promise
     */
    public static async closeAllConnections(): Promise<void> {
        const closePromises: Promise<void>[] = [];
        
        for (const [_, connection] of this.tenantConnections) {
            closePromises.push(connection.close());
        }
        
        await Promise.all(closePromises);
        this.tenantConnections.clear();
    }
    
    /**
     * 获取所有租户数据库连接
     * @returns {Map<string, Sequelize>} 所有租户数据库连接的Map
     */
    public static getAllConnections(): Map<string, Sequelize> {
        return new Map(this.tenantConnections);
    }
}
