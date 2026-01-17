"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
const db_1 = require("./db");
require("../models/modules/User");
async function initDatabase() {
    try {
        await (0, db_1.testConnection)();
        await db_1.sequelize.sync({ force: false });
        console.log('✅ Database synchronized');
        return true;
    }
    catch (error) {
        console.error('❌ Failed to initialize database:', error.message);
        throw error;
    }
}
//# sourceMappingURL=dbInit.js.map