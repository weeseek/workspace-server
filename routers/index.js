const fs = require('fs');
const path = require('path');

/**
 * 注册所有路由模块
 * @param {Object} app - Koa 应用实例
 */
module.exports = (app) => {
    // 获取路由模块目录
    const modulesPath = path.join(__dirname, 'modules');
    
    // 读取所有路由模块文件
    const moduleFiles = fs.readdirSync(modulesPath).filter(file => {
        return file.endsWith('.js') && !file.startsWith('.');
    });
    
    // 注册每个路由模块
    moduleFiles.forEach(file => {
        const modulePath = path.join(modulesPath, file);
        const routerModule = require(modulePath);
        
        // 应用路由模块到app
        app.use(routerModule.routes());
        app.use(routerModule.allowedMethods());
        
        console.log(`📦 Loaded route module: ${file}`);
    });
    
    console.log('📦 All routes registered successfully');
};

