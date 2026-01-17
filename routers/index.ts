import fs from 'fs';
import path from 'path';
import Koa from 'koa';

// 定义Koa应用类型
type Application = Koa;

/**
 * 注册所有路由模块
 * @param {Application} app - Koa 应用实例
 */
export default (app: Application): void => {
    // 获取路由模块目录
    const modulesPath = path.join(__dirname, 'modules');
    
    // 读取所有路由模块文件
    // 在开发模式下（ts-node）读取.ts文件，在生产模式下读取.js文件
    // 过滤掉.d.ts声明文件，只读取实际的源代码文件
    const moduleFiles = fs.readdirSync(modulesPath).filter(file => {
        return ((file.endsWith('.ts') && !file.endsWith('.d.ts')) || file.endsWith('.js')) && !file.startsWith('.');
    });
    
    // 注册每个路由模块
    moduleFiles.forEach(file => {
        const modulePath = path.join(modulesPath, file);
        const routerModule = require(modulePath);
        
        // 处理ES模块的默认导出：如果是默认导出，使用.default属性获取实际路由对象
        const router = routerModule.default || routerModule;
        
        // 应用路由模块到app
        app.use(router.routes());
        app.use(router.allowedMethods());
        
        console.log(`📦 Loaded route module: ${file}`);
    });
    
    console.log('📦 All routes registered successfully');
};