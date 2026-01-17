import fs from 'fs';
import path from 'path';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';

// 定义Koa应用类型
type Application = Koa;

// 使用any类型来简化，避免Koa v3的类型定义问题
type Context = any;
type Next = () => Promise<any>;

import { handleError, handleSequelizeError } from '../utils/errorHandler';

// 定义中间件模块类型
interface MiddlewareModules {
    [key: string]: any;
}

/**
 * 自动加载modules目录下的所有中间件
 * @returns {MiddlewareModules} 加载的中间件对象
 */
const loadMiddlewareModules = (): MiddlewareModules => {
    const middlewares: MiddlewareModules = {};
    const modulesDir = path.join(__dirname, 'modules');
    
    // 读取modules目录下的所有文件
    fs.readdirSync(modulesDir).forEach(file => {
        // 只加载编译后的.js文件
        if (file.endsWith('.js')) {
            const middlewareName = file.replace('.js', '');
            // 动态导入中间件模块
            const middlewarePath = path.join(modulesDir, file);
            const middlewareModule = require(middlewarePath);
            
            // 处理ES模块的默认导出：如果是默认导出，使用.default属性获取实际函数
            const middleware = middlewareModule.default || middlewareModule;
            middlewares[middlewareName] = middleware;
            console.log(`✓ Loaded middleware: ${middlewareName}`);
        }
    });
    
    return middlewares;
};

/**
 * 配置所有中间件
 * @param {Application} app - Koa应用实例
 */
export const configureMiddlewares = (app: Application): void => {
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
    // 注意：Koa v3支持传统的(ctx, next)中间件签名
    // 使用类型断言来适配TypeScript类型定义
    app.use(((async (ctx: Context, next: Next) => {
        try {
            await next();
        } catch (error) {
            // 只对Sequelize错误进行特殊处理
            let processedError = error;
            if (error instanceof Error && error.name && error.name.startsWith('Sequelize')) {
                processedError = handleSequelizeError(error);
            }
            // 统一处理错误
            handleError(processedError as Error, ctx);
        }
    }) as any));

    
    console.log('📦 All middlewares configured successfully');
};