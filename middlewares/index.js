const fs = require('fs');
const path = require('path');

const middlewares = {};
const modulesDir = path.join(__dirname, 'modules');

// 自动加载modules目录下的所有中间件
fs.readdirSync(modulesDir).forEach(file => {
    if (file.endsWith('.js')) {
        const middlewareName = file.replace('.js', '');
        middlewares[middlewareName] = require(path.join(modulesDir, file));
        console.log(`✓ Loaded middleware: ${middlewareName}`);
    }
});

module.exports = middlewares;
