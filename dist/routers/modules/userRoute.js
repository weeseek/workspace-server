"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require('koa-router');
const userController_1 = require("../../controllers/modules/userController");
const router = new Router({ prefix: '/api/users' });
const typedRouter = router;
typedRouter.get('/', async (ctx) => {
    await (0, userController_1.getUsers)(ctx);
});
typedRouter.get('/me', async (ctx) => {
    await (0, userController_1.getCurrentUser)(ctx);
});
typedRouter.get('/:id', async (ctx) => {
    await (0, userController_1.getUserById)(ctx);
});
typedRouter.post('/register', async (ctx) => {
    await (0, userController_1.registerUser)(ctx);
});
typedRouter.post('/login', async (ctx) => {
    await (0, userController_1.loginUser)(ctx);
});
typedRouter.put('/me', async (ctx) => {
    await (0, userController_1.updateUser)(ctx);
});
typedRouter.delete('/me', async (ctx) => {
    await (0, userController_1.deleteUser)(ctx);
});
exports.default = router;
//# sourceMappingURL=userRoute.js.map