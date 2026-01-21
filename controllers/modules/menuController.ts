import { Context } from 'koa';
import { MenuType } from '../../types/menu';
import { sendSuccess, sendCreated, sendNotFound, sendClientError } from '../../utils/response';
import { createMenu as createMenuService, getMenus as getMenusService, getMenuById as getMenuByIdService, updateMenu as updateMenuService, deleteMenu as deleteMenuService, getMenuTree as getMenuTreeService } from '../../services/modules/menuService';

/**
 * 创建菜单
 * @param {Context} ctx - Koa上下文对象
 */
export async function createMenu(ctx: Context): Promise<void> {
    let body: any = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (_) {
            sendClientError(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    
    // 验证菜单类型
    if (body.type && !Object.values(MenuType).includes(body.type)) {
        sendClientError(ctx, 'Invalid menu type. Must be one of: node, page, link');
        return;
    }
    
    try {
        const menu = await createMenuService(body);
        sendCreated(ctx, 'Menu created successfully', { menu: menu.toJSON() });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to create menu');
    }
}

/**
 * 获取菜单列表
 * @param {Context} ctx - Koa上下文对象
 */
export async function getMenus(ctx: Context): Promise<void> {
    const query = ctx.query as any;
    
    // 解析查询参数
    const name = query.name || '';
    const type = query.type as MenuType | undefined;
    const status = query.status as 'active' | 'inactive' | undefined;
    const withChildren = query.withChildren !== 'false';
    
    try {
        const menus = await getMenusService(name, type, status, withChildren);
        
        // 转换为JSON格式
        const menusData = menus.map(menu => menu.toJSON());
        
        sendSuccess(ctx, 'Menus retrieved successfully', { menus: menusData });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to retrieve menus');
    }
}

/**
 * 获取菜单树形结构
 * @param {Context} ctx - Koa上下文对象
 */
export async function getMenuTree(ctx: Context): Promise<void> {
    const query = ctx.query as any;
    
    // 解析查询参数
    const status = query.status as 'active' | 'inactive' || 'active';
    
    try {
        const menuTree = await getMenuTreeService(status);
        
        // 转换为JSON格式
        const menuTreeData = menuTree.map(menu => menu.toJSON());
        
        sendSuccess(ctx, 'Menu tree retrieved successfully', { menuTree: menuTreeData });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to retrieve menu tree');
    }
}

/**
 * 根据ID获取菜单
 * @param {Context} ctx - Koa上下文对象
 */
export async function getMenuById(ctx: Context): Promise<void> {
    const id = parseInt(ctx.params.id as string, 10);
    
    if (isNaN(id)) {
        sendClientError(ctx, 'Invalid menu ID');
        return;
    }
    
    const query = ctx.query as any;
    const withChildren = query.withChildren !== 'false';
    
    try {
        const menu = await getMenuByIdService(id, withChildren);
        
        if (menu) {
            sendSuccess(ctx, 'Menu retrieved successfully', { menu: menu.toJSON() });
        } else {
            sendNotFound(ctx, 'Menu not found');
        }
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to retrieve menu');
    }
}

/**
 * 更新菜单
 * @param {Context} ctx - Koa上下文对象
 */
export async function updateMenu(ctx: Context): Promise<void> {
    const id = parseInt(ctx.params.id as string, 10);
    
    if (isNaN(id)) {
        sendClientError(ctx, 'Invalid menu ID');
        return;
    }
    
    let body: any = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (_) {
            sendClientError(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    
    // 验证菜单类型
    if (body.type && !Object.values(MenuType).includes(body.type)) {
        sendClientError(ctx, 'Invalid menu type. Must be one of: node, page, link');
        return;
    }
    
    try {
        const menu = await updateMenuService(id, body);
        sendSuccess(ctx, 'Menu updated successfully', { menu: menu.toJSON() });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to update menu');
    }
}

/**
 * 删除菜单
 * @param {Context} ctx - Koa上下文对象
 */
export async function deleteMenu(ctx: Context): Promise<void> {
    const id = parseInt(ctx.params.id as string, 10);
    
    if (isNaN(id)) {
        sendClientError(ctx, 'Invalid menu ID');
        return;
    }
    
    try {
        await deleteMenuService(id);
        sendSuccess(ctx, 'Menu deleted successfully');
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to delete menu');
    }
}
