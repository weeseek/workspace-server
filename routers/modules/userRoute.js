const Router = require('koa-router');
const userController = require("../../controllers/modules/userController");

// 包含完整的API前缀
const router = new Router({prefix: '/api/users'});

router.get('/', (ctx) => {
    ctx.body = 'User module route';
});

router.get('/:id', async ctx => {
    await userController.getUserById(ctx);
});

router.post('/register', async ctx => {
    await userController.registerUser(ctx);
});

router.post('/login', async ctx => {
    await userController.loginUser(ctx);
});

module.exports = router;
