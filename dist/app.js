"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const config_1 = __importDefault(require("./config/config"));
const dbInit_1 = require("./config/dbInit");
const middlewares_1 = require("./middlewares");
const routers_1 = __importDefault(require("./routers"));
async function startApp() {
    try {
        console.log('Starting application initialization...');
        console.log('Step 1: Initializing database...');
        await (0, dbInit_1.initDatabase)();
        console.log('Step 2: Creating Koa app...');
        const app = new koa_1.default();
        console.log('Step 3: Configuring middlewares...');
        (0, middlewares_1.configureMiddlewares)(app);
        console.log('Step 4: Configuring routers...');
        (0, routers_1.default)(app);
        console.log('Step 5: Starting server...');
        app.listen(config_1.default.port, () => {
            console.log(`🚀 Server running on http://localhost:${config_1.default.port}`);
            console.log(`📝 Environment: ${config_1.default.environment}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start application:', error);
        console.error('Error stack:', error.stack);
        process.exit(1);
    }
}
startApp();
//# sourceMappingURL=app.js.map