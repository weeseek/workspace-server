const env = require('./env');
const config = require('./config');

module.exports = {
    connect: () => {
        const dbConfig = env[config.environment];
        // 假设使用 mongoose 连接数据库
        const mongoose = require('mongoose');
        mongoose.connect(`mongodb://${dbConfig.dbHost}:${dbConfig.dbPort}/${dbConfig.dbName}`)
            .then(() => console.log('Connected to database'))
            .catch(err => console.error('Database connection error:', err));
    }
};