const Koa = require('koa')

const config = require('./config/config')

const app = new Koa();

app.listen(config.port,()=> {
    console.log('Server running on http://localhost:' + config.port);
})