// 使用koa-router
const Router = require('koa-router');
import { Context } from 'koa';
import { createMenu, getMenus, getMenuById, updateMenu, deleteMenu, getMenuTree } from '../../controllers/modules/menuController';

// 创建路由实例，包含完整的API前缀
const router = new Router({ prefix: '/api/menus' });

// 使用类型断言解决TypeScript类型检查问题
const typedRouter = router as any;

/**
 * @swagger
 * /api/menus: 
 *   post:
 *     summary: 创建菜单
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - type
 *             properties:
 *               name: { type: string, description: '菜单名称' }
 *               code: { type: string, description: '菜单编码' }
 *               type: { type: string, enum: ['NODE', 'PAGE', 'LINK'], description: '菜单类型' }
 *               path: { type: string, description: '菜单路径' }
 *               icon: { type: string, description: '菜单图标' }
 *               parentId: { type: integer, description: '父菜单ID' }
 *               order: { type: integer, description: '排序' }
 *               status: { type: integer, enum: [0, 1], description: '状态，1-启用，0-禁用' }
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 参数错误
 *       401:
 *         description: 未授权
 */
typedRouter.post('/', async (ctx: Context) => {
    await createMenu(ctx);
});

/**
 * @swagger
 * /api/menus: 
 *   get:
 *     summary: 获取菜单列表
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         description: 菜单状态
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *     responses:
 *       200:
 *         description: 菜单列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 */
typedRouter.get('/', async (ctx: Context) => {
    await getMenus(ctx);
});

/**
 * @swagger
 * /api/menus/tree: 
 *   get:
 *     summary: 获取菜单树形结构
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         description: 菜单状态
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *     responses:
 *       200:
 *         description: 菜单树形结构
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 */
typedRouter.get('/tree', async (ctx: Context) => {
    await getMenuTree(ctx);
});

/**
 * @swagger
 * /api/menus/{id}: 
 *   get:
 *     summary: 根据ID获取菜单
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 菜单ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 菜单信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 菜单不存在
 *       401:
 *         description: 未授权
 */
typedRouter.get('/:id', async (ctx: Context) => {
    await getMenuById(ctx);
});

/**
 * @swagger
 * /api/menus/{id}: 
 *   put:
 *     summary: 更新菜单
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 菜单ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, description: '菜单名称' }
 *               code: { type: string, description: '菜单编码' }
 *               type: { type: string, enum: ['NODE', 'PAGE', 'LINK'], description: '菜单类型' }
 *               path: { type: string, description: '菜单路径' }
 *               icon: { type: string, description: '菜单图标' }
 *               parentId: { type: integer, description: '父菜单ID' }
 *               order: { type: integer, description: '排序' }
 *               status: { type: integer, enum: [0, 1], description: '状态，1-启用，0-禁用' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 参数错误
 *       404:
 *         description: 菜单不存在
 *       401:
 *         description: 未授权
 */
typedRouter.put('/:id', async (ctx: Context) => {
    await updateMenu(ctx);
});

/**
 * @swagger
 * /api/menus/{id}: 
 *   delete:
 *     summary: 删除菜单
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 菜单ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 菜单不存在
 *       401:
 *         description: 未授权
 */
typedRouter.delete('/:id', async (ctx: Context) => {
    await deleteMenu(ctx);
});

export default router;
