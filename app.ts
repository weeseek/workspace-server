import Koa from 'koa';
import config from './config/config';
import { initDatabase } from './config/dbInit';
import { configureMiddlewares } from './middlewares';
import registerRoutes from './routers';
// 导入多租户初始化函数
import { initAllTenantConnections } from './services/modules/tenantService';
import { ModelFactory } from './models/ModelFactory';
// 导入系统初始化函数
import { initSystem } from './utils/initSystem';

// 应用启动函数
async function startApp(): Promise<void> {
    try {
        console.log('Starting application initialization...');
        
        // 分步初始化，便于定位错误
        console.log('Step 1: Initializing database...');
        await initDatabase();
        
        console.log('Step 2: Initializing system tenant and super admin...');
        await initSystem();
        
        console.log('Step 3: Initializing tenant connections...');
        await initAllTenantConnections();
        
        console.log('Step 4: Initializing tenant models...');
        await ModelFactory.initAllTenantModels();
        
        console.log('Step 5: Creating Koa app...');
        const app = new Koa();
        
        console.log('Step 6: Configuring middlewares...');
        configureMiddlewares(app);
        
        console.log('Step 7: Configuring routers...');
        registerRoutes(app);
        
        console.log('Step 8: Starting server...');
        // 监听所有网络接口，允许外网访问
        // 使用对象参数形式避免 TypeScript 类型错误
        app.listen({
            port: config.port,
            host: '0.0.0.0'
        }, () => {
            console.log(`🚀 Server running on http://0.0.0.0:${config.port}`);
            console.log(`📝 Environment: ${config.environment}`);
        });
    } catch (error) {
        console.error('❌ Failed to start application:', error);
        console.error('Error stack:', (error as Error).stack);
        process.exit(1);
    }
}

// 启动应用
startApp();