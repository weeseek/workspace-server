import { sequelize, testConnection } from './db';

// 只导入Tenant模型，因为它是主数据库中的唯一模型
import '../models/modules/Tenant';

/**
 * 初始化数据库
 * - 测试数据库连接
 * - 同步主数据库表（只包含Tenant模型）
 * - 加载主数据库模型
 * @returns {Promise<boolean>} 初始化是否成功
 */
async function initDatabase(): Promise<boolean> {
    try {
        // 测试数据库连接
        await testConnection();
        
        // 只同步主数据库（包含Tenant模型）
        await sequelize.sync({ force: false });
        console.log('✅ Main database synchronized');
        
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize main database:', (error as Error).message);
        throw error;
    }
}

export {
    initDatabase
};