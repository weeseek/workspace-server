// 使用koa-router
const Router = require('koa-router');
import { Context } from 'koa';
import { getUserById, registerUser, loginUser, getCurrentUser, updateUser, deleteUser, getUsers } from '../../controllers/modules/userController';

// 创建路由实例，包含完整的API前缀
const router = new Router({ prefix: '/api/users' });

// 使用类型断言解决TypeScript类型检查问题
const typedRouter = router as any;

// 获取用户列表
typedRouter.get('/', async (ctx: Context) => {
    await getUsers(ctx);
});

// 受保护的路由：获取当前登录用户信息（现在通过全局JWT中间件验证）
typedRouter.get('/me', async (ctx: Context) => {
    await getCurrentUser(ctx);
});

// 根据ID获取用户信息
typedRouter.get('/:id', async (ctx: Context) => {
    await getUserById(ctx);
});

// 用户注册
typedRouter.post('/register', async (ctx: Context) => {
    await registerUser(ctx);
});

// 用户登录
typedRouter.post('/login', async (ctx: Context) => {
    await loginUser(ctx);
});

// 更新当前用户信息
typedRouter.put('/me', async (ctx: Context) => {
    await updateUser(ctx);
});

// 删除当前用户
typedRouter.delete('/me', async (ctx: Context) => {
    await deleteUser(ctx);
});

export default router;