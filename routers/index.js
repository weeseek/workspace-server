const KoaRouter = require('koa-router');
const fs = require('fs');
const path = require('path');

const router = new KoaRouter();

const modulesDir = path.join(__dirname, 'modules');
fs.readdirSync(modulesDir).forEach(file => {
    if (file.endsWith('.js')) {
        const moduleRouter = require(path.join(modulesDir, file));
        router.use(moduleRouter.routes());
    }
});

module.exports = app=>{
    app.use(router.routes())
        .use(router.allowedMethods())
};
