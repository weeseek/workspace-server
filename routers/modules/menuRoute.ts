// 使用koa-router
const Router = require('koa-router');
import { Context } from 'koa';
import { createMenu, getMenus, getMenuById, updateMenu, deleteMenu, getMenuTree } from '../../controllers/modules/menuController';

// 创建路由实例，包含完整的API前缀
const router = new Router({ prefix: '/api/menus' });

// 使用类型断言解决TypeScript类型检查问题
const typedRouter = router as any;

// 创建菜单
typedRouter.post('/', async (ctx: Context) => {
    await createMenu(ctx);
});

// 获取菜单列表
typedRouter.get('/', async (ctx: Context) => {
    await getMenus(ctx);
});

// 获取菜单树形结构
typedRouter.get('/tree', async (ctx: Context) => {
    await getMenuTree(ctx);
});

// 根据ID获取菜单
typedRouter.get('/:id', async (ctx: Context) => {
    await getMenuById(ctx);
});

// 更新菜单
typedRouter.put('/:id', async (ctx: Context) => {
    await updateMenu(ctx);
});

// 删除菜单
typedRouter.delete('/:id', async (ctx: Context) => {
    await deleteMenu(ctx);
});

export default router;
