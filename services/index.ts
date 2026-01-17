import fs from 'fs';
import path from 'path';

// 定义服务模块类型
interface ServiceModules {
    [key: string]: any;
}

const services: ServiceModules = {};
const modulesDir = path.join(__dirname, 'modules');

// 读取modules目录下的所有文件
fs.readdirSync(modulesDir).forEach(file => {
    // 支持.ts和.js文件
    if (file.endsWith('.ts') || file.endsWith('.js')) {
        const serviceName = file.replace(/\.(ts|js)$/, '');
        // 动态导入服务模块
        const modulePath = path.join(modulesDir, file);
        services[serviceName] = require(modulePath);
    }
});

export default services;