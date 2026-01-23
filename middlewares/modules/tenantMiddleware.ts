import { Context, Next } from 'koa';
import { sendClientError } from '../../utils/response';
import { MultiTenantDbManager } from '../../config/multiTenantDbManager';

/**
 * 定义路由匹配规则接口
 */
interface RouteRule {
    method: string;
    path: string | RegExp;
}

/**
 * 白名单路由，不需要租户ID
 * 支持字符串和正则表达式
 */
const whiteList: RouteRule[] = [
    // Swagger 相关路由
    { method: 'GET', path: '/api/docs' },
    { method: 'GET', path: '/api/docs.json' },
    { method: 'GET', path: '/health' },
    // 登录和注册接口
    { method: 'POST', path: '/api/users/register' },
    { method: 'POST', path: '/api/users/login' }
];

/**
 * 检查请求是否在白名单中
 * @param {Context} ctx - Koa上下文对象
 * @returns {boolean} 是否在白名单中
 */
const isInWhiteList = (ctx: Context): boolean => {
    const { method, path } = ctx.request;
    
    return whiteList.some(item => {
        const methodMatch = item.method === method;
        if (!methodMatch) return false;
        
        if (typeof item.path === 'string') {
            return item.path === path;
        } else if (item.path instanceof RegExp) {
            return item.path.test(path);
        }
        
        return false;
    });
};

/**
 * 租户中间件
 * 用于从请求中获取租户ID，并将其添加到请求上下文中
 * @param {Context} ctx - Koa上下文对象
 * @param {Next} next - 下一个中间件函数
 */
export async function tenantMiddleware(ctx: Context, next: Next): Promise<void> {
    // 检查请求是否在白名单中，如果是则跳过租户ID验证
    if (isInWhiteList(ctx)) {
        await next();
        return;
    }
    
    // 从请求头中获取租户ID
    let tenantId = ctx.headers['x-tenant-id'] as string;
    
    // 如果请求头中没有租户ID，从查询参数中获取
    if (!tenantId) {
        tenantId = ctx.query['tenantId'] as string;
    }
    
    // 如果请求头和查询参数中都没有租户ID，从JWT token中获取（如果有）
    if (!tenantId && ctx.state.user) {
        tenantId = ctx.state.user.tenantId;
    }
    
    // 如果仍然没有租户ID，返回错误
    if (!tenantId) {
        sendClientError(ctx, 'Tenant ID is required');
        return;
    }
    
    // 检查租户数据库连接是否存在
    if (!MultiTenantDbManager.hasTenantConnection(tenantId)) {
        sendClientError(ctx, 'Invalid tenant ID or tenant not active');
        return;
    }
    
    // 将租户ID添加到上下文
    ctx.state.tenantId = tenantId;
    
    await next();
}
