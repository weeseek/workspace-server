const Koa = require('koa')
const config = require('./config/config')
const { initDatabase } = require('./config/dbInit')
const { configureMiddlewares } = require('./middlewares')

// 应用启动函数
async function startApp() {
    try {
        // 初始化数据库
        await initDatabase();
        
        // 创建Koa应用实例
        const app = new Koa();
        
        // 配置中间件
        configureMiddlewares(app);
        
        // 路由注册
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
