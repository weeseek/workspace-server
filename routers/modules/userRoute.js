const Router = require('koa-router');
const userController = require("../../controllers/modules/userController");

const router = new Router({prefix: '/users'});

router.get('/', (ctx) => {
    ctx.body = 'User module route';
}).get('/:id', async  ctx => userController.getUserById);

module.exports = router;
