const path = require('path');
const { Sequelize } = require('sequelize');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

// 数据库配置
const dbConfig = {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'sqlite',
    dialectModule: sqlite3,
    storage: process.env.DB_DIALECT === 'sqlite' 
        ? path.join(__dirname, process.env.DB_STORAGE) 
        : undefined,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    // 连接池配置（针对非SQLite数据库）
    pool: {
        max: parseInt(process.env.DB_POOL_MAX || '5'),
        min: parseInt(process.env.DB_POOL_MIN || '0'),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
        idle: parseInt(process.env.DB_POOL_IDLE || '10000')
    }
};

// 创建Sequelize实例
const sequelize = new Sequelize(dbConfig);

/**
 * 测试数据库连接
 * @returns {Promise<boolean>} 连接是否成功
 */
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

module.exports = {
    sequelize,
    testConnection
};