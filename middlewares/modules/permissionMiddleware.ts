import { Context, Next } from 'koa';
import { sendClientError, sendForbidden } from '../../utils/response';

/**
 * 角色枚举
 */
export enum Role {
    // 系统超级管理员
    SUPER_ADMIN = 'super_admin',
    // 创建管理员（可以创建租户）
    CREATE_ADMIN = 'create_admin',
    // 普通管理员
    ADMIN = 'admin',
    // 普通用户
    USER = 'user'
}

/**
 * 权限控制中间件
 * 用于检查用户是否具有相应的权限
 * @param {string[]} allowedRoles - 允许访问的角色列表
 * @returns {Function} Koa中间件函数
 */
export function permissionMiddleware(allowedRoles: string[]): (ctx: Context, next: Next) => Promise<void> {
    return async (ctx: Context, next: Next): Promise<void> => {
        try {
            // 检查用户是否已登录
            if (!ctx.state.user) {
                sendClientError(ctx, 'User not authenticated');
                return;
            }
            
            // 获取用户角色
            const userRole = ctx.state.user.role || Role.USER;
            
            console.log('检查用户权限:', userRole, allowedRoles);
            
            // 检查用户角色是否在允许的角色列表中
            if (!allowedRoles.includes(userRole)) {
                sendForbidden(ctx, 'Insufficient permissions');
                return;
            }
            
            await next();
        } catch (error) {
            sendClientError(ctx, (error as Error).message || 'Permission check failed');
        }
    };
}

/**
 * 检查用户是否为创建管理员或超级管理员
 * @param {Context} ctx - Koa上下文对象
 * @returns {boolean} 是否为创建管理员或超级管理员
 */
export function isCreateAdminOrSuperAdmin(ctx: Context): boolean {
    const userRole = ctx.state.user?.role || Role.USER;
    return [Role.CREATE_ADMIN, Role.SUPER_ADMIN].includes(userRole);
}
