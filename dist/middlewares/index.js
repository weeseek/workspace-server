"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureMiddlewares = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const errorHandler_1 = require("../utils/errorHandler");
const loadMiddlewareModules = () => {
    const middlewares = {};
    const modulesDir = path_1.default.join(__dirname, 'modules');
    fs_1.default.readdirSync(modulesDir).forEach(file => {
        if (file.endsWith('.js')) {
            const middlewareName = file.replace('.js', '');
            const middlewarePath = path_1.default.join(modulesDir, file);
            const middlewareModule = require(middlewarePath);
            const middleware = middlewareModule.default || middlewareModule;
            middlewares[middlewareName] = middleware;
            console.log(`✓ Loaded middleware: ${middlewareName}`);
        }
    });
    return middlewares;
};
const configureMiddlewares = (app) => {
    const middlewares = loadMiddlewareModules();
    app.use((0, koa_bodyparser_1.default)({
        enableTypes: ['json', 'form', 'text'],
        jsonLimit: '10mb',
        formLimit: '10mb',
        textLimit: '10mb'
    }));
    if (middlewares.requestLogger) {
        app.use(middlewares.requestLogger);
    }
    if (middlewares.jwtAuth) {
        app.use(middlewares.jwtAuth);
    }
    app.use((async (ctx, next) => {
        try {
            await next();
        }
        catch (error) {
            let processedError = error;
            if (error instanceof Error && error.name && error.name.startsWith('Sequelize')) {
                processedError = (0, errorHandler_1.handleSequelizeError)(error);
            }
            (0, errorHandler_1.handleError)(processedError, ctx);
        }
    }));
    console.log('📦 All middlewares configured successfully');
};
exports.configureMiddlewares = configureMiddlewares;
//# sourceMappingURL=index.js.map