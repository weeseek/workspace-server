const Koa = require('koa')
const router = require('./routers/index')
const config = require('./config/config')

const app = new Koa();
router(app)

app.listen(config.port,()=> {
    console.log('Server running on http://localhost:' + config.port);
})