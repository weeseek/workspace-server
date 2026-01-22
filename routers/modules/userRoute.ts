// 使用koa-router
const Router = require('koa-router');
import { Context } from 'koa';
import { getUserById, registerUser, loginUser, getCurrentUser, updateUser, deleteUser, getUsers } from '../../controllers/modules/userController';

// 创建路由实例，包含完整的API前缀
const router = new Router({ prefix: '/api/users' });

// 使用类型断言解决TypeScript类型检查问题
const typedRouter = router as any;

/**
 * @swagger
 * /api/users: 
 *   get:
 *     summary: 获取用户列表
 *     tags: [Users]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: 页码
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: 每页数量
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: keyword
 *         in: query
 *         description: 搜索关键词
 *         required: false
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: 用户状态
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive, banned]
 *     responses:
 *       200:
 *         description: 用户列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
typedRouter.get('/', async (ctx: Context) => {
    await getUsers(ctx);
});

/**
 * @swagger
 * /api/users/me: 
 *   get:
 *     summary: 获取当前登录用户信息
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 当前用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 */
typedRouter.get('/me', async (ctx: Context) => {
    await getCurrentUser(ctx);
});

/**
 * @swagger
 * /api/users/{id}: 
 *   get:
 *     summary: 根据ID获取用户信息
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 用户ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 用户不存在
 */
typedRouter.get('/:id', async (ctx: Context) => {
    await getUserById(ctx);
});

/**
 * @swagger
 * /api/users/register: 
 *   post:
 *     summary: 用户注册
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 参数错误
 */
typedRouter.post('/register', async (ctx: Context) => {
    await registerUser(ctx);
});

/**
 * @swagger
 * /api/users/login: 
 *   post:
 *     summary: 用户登录
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 认证失败
 */
typedRouter.post('/login', async (ctx: Context) => {
    await loginUser(ctx);
});

/**
 * @swagger
 * /api/users/me: 
 *   put:
 *     summary: 更新当前用户信息
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname: { type: string, description: '昵称' }
 *               email: { type: string, format: 'email', description: '邮箱' }
 *               phone: { type: string, description: '手机号' }
 *               avatar: { type: string, description: '头像URL' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 */
typedRouter.put('/me', async (ctx: Context) => {
    await updateUser(ctx);
});

/**
 * @swagger
 * /api/users/me: 
 *   delete:
 *     summary: 删除当前用户
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 */
typedRouter.delete('/me', async (ctx: Context) => {
    await deleteUser(ctx);
});

export default router;