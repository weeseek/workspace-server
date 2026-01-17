"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.testConnection = testConnection;
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const sqlite3_1 = __importDefault(require("sqlite3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'sqlite',
    dialectModule: sqlite3_1.default.verbose(),
    storage: process.env.DB_DIALECT === 'sqlite'
        ? path_1.default.join(__dirname, process.env.DB_STORAGE || './database.sqlite')
        : undefined,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
        max: parseInt(process.env.DB_POOL_MAX || '5'),
        min: parseInt(process.env.DB_POOL_MIN || '0'),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
        idle: parseInt(process.env.DB_POOL_IDLE || '10000')
    }
};
const sequelize = new sequelize_1.Sequelize(dbConfig);
exports.sequelize = sequelize;
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}
//# sourceMappingURL=db.js.map