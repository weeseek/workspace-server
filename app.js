const Koa = require('koa')
const config = require('./config/config')
const bodyParser = require('koa-bodyparser')
const { initDatabase } = require('./config/dbInit')

// 应用启动函数
async function startApp() {
    try {
        // 初始化数据库
        await initDatabase();
        
        // 创建Koa应用实例
        const app = new Koa();
        const { handleError, handleSequelizeError } = require('./utils/errorHandler');
        
        // 加载中间件
        const middlewares = require('./middlewares');
        
        // 中间件 - 顺序很重要
        
        // 1. 请求体解析中间件
        app.use(bodyParser({
            enableTypes: ['json', 'form', 'text'],
            jsonLimit: '10mb',
            formLimit: '10mb',
            textLimit: '10mb'
        }))
        
        // 2. 请求日志中间件
        if (middlewares.requestLogger) {
            app.use(middlewares.requestLogger);
        }
        
        // 3. 全局错误处理中间件
        app.use(async (ctx, next) => {
            try {
                await next();
            } catch (error) {
                // 处理Sequelize错误
                const processedError = handleSequelizeError(error);
                // 统一处理错误
                handleError(processedError, ctx);
            }
        });
        
        // 4. 路由注册
        const registerRoutes = require('./routers');
        registerRoutes(app);
        
        // 启动服务器
        app.listen(config.port, () => {
            console.log(`🚀 Server running on http://localhost:${config.port}`);
            console.log(`📝 Environment: ${config.environment}`);
        });
    } catch (error) {
        console.error('❌ Failed to start application:', error.message);
        process.exit(1);
    }
}

// 启动应用
startApp();
