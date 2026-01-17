const { sequelize, testConnection } = require('./db');
const User = require('../models/modules/User');

/**
 * 初始化数据库
 * - 测试数据库连接
 * - 同步数据库表
 * - 加载所有模型
 */
async function initDatabase() {
    try {
        // 测试数据库连接
        await testConnection();
        
        // 同步数据库
        await sequelize.sync({ force: false });
        console.log('✅ Database synchronized');
        
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize database:', error.message);
        throw error;
    }
}

module.exports = {
    initDatabase
};