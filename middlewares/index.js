const fs = require('fs');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const { handleError, handleSequelizeError } = require('../utils/errorHandler');

// 自动加载modules目录下的所有中间件
const loadMiddlewareModules = () => {
    const middlewares = {};
    const modulesDir = path.join(__dirname, 'modules');
    
    fs.readdirSync(modulesDir).forEach(file => {
        if (file.endsWith('.js')) {
            const middlewareName = file.replace('.js', '');
            middlewares[middlewareName] = require(path.join(modulesDir, file));
            console.log(`✓ Loaded middleware: ${middlewareName}`);
        }
    });
    
    return middlewares;
};

/**
 * 配置所有中间件
 * @param {Object} app - Koa应用实例
 */
const configureMiddlewares = (app) => {
    // 1. 加载中间件模块
    const middlewares = loadMiddlewareModules();
    
    // 2. 请求体解析中间件
    app.use(bodyParser({
        enableTypes: ['json', 'form', 'text'],
        jsonLimit: '10mb',
        formLimit: '10mb',
        textLimit: '10mb'
    }));
    
    // 3. 请求日志中间件
    if (middlewares.requestLogger) {
        app.use(middlewares.requestLogger);
    }
    
    // 4. JWT认证中间件（应用到所有路由，通过白名单控制）
    if (middlewares.jwtAuth) {
        app.use(middlewares.jwtAuth);
    }
    
    // 5. 全局错误处理中间件
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            // 只对Sequelize错误进行特殊处理
            let processedError = error;
            if (error.name && error.name.startsWith('Sequelize')) {
                processedError = handleSequelizeError(error);
            }
            // 统一处理错误
            handleError(processedError, ctx);
        }
    });
    
    console.log('📦 All middlewares configured successfully');
};

module.exports = {
    configureMiddlewares
};
