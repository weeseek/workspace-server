import { sequelize, testConnection } from './db';

// 导入所有模型，确保它们被注册到Sequelize实例中
import '../models/modules/User';

/**
 * 初始化数据库
 * - 测试数据库连接
 * - 同步数据库表
 * - 加载所有模型
 * @returns {Promise<boolean>} 初始化是否成功
 */
async function initDatabase(): Promise<boolean> {
    try {
        // 测试数据库连接
        await testConnection();
        
        // 同步数据库
        await sequelize.sync({ force: false });
        console.log('✅ Database synchronized');
        
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize database:', (error as Error).message);
        throw error;
    }
}

export {
    initDatabase
};