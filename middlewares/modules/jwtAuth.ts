// JWT认证中间件
import { Context } from 'koa';

// 定义Next类型
type Next = () => Promise<any>;
import { verifyAccessToken } from '../../utils/jwt';

// 定义路由匹配规则接口
interface RouteRule {
    method: string;
    path: string | RegExp;
}

// 白名单路由，不需要JWT验证
// 支持字符串和正则表达式
const whiteList: RouteRule[] = [
    // 注册和登录接口
    { method: 'POST', path: '/api/users/register' },
    { method: 'POST', path: '/api/users/login' },
    // 基础路由 - 使用正则表达式匹配
    { method: 'GET', path: /^\/api\/users$/ },
    // 支持通配符路由 - 使用正则表达式匹配数字ID
    { method: 'GET', path: /^\/api\/users\/\d+$/ }, // 匹配 /api/users/1, /api/users/2 等
    // Swagger 相关路由 - 新地址 /api/docs
    { method: 'GET', path: '/api/docs' },
    { method: 'GET', path: '/api/docs.json' },
    { method: 'GET', path: '/health' },
    // 注意：/api/users/me 不在白名单中，需要JWT验证
];

// 明确排除 /api/users/me 路由
const excludeRoutes: RouteRule[] = [
    { method: 'GET', path: '/api/users/me' }
];

// 检查请求是否在白名单中
const isInWhiteList = (ctx: Context): boolean => {
    let { method, path } = ctx.request;
    
    console.log('检查请求是否在白名单中:', method, path);
    
    // 对 HEAD 请求特殊处理，转换为 GET 方法进行白名单检查
    // 因为 HEAD 请求通常是用来检查资源是否存在，和 GET 请求的权限要求一致
    const originalMethod = method;
    if (method === 'HEAD') {
        method = 'GET';
        console.log('将 HEAD 请求转换为 GET 请求进行白名单检查');
    }
    
    // 首先检查是否在排除列表中
    const isExcluded = excludeRoutes.some(item => {
        const methodMatch = item.method === originalMethod;
        if (!methodMatch) return false;
        
        if (typeof item.path === 'string') {
            return item.path === path;
        } else if (item.path instanceof RegExp) {
            return item.path.test(path);
        }
        
        return false;
    });
    
    if (isExcluded) {
        console.log('请求在排除列表中，需要JWT验证:', originalMethod, path);
        return false;
    }
    
    // 然后检查是否在白名单中
    const isInList = whiteList.some(item => {
        // 检查方法是否匹配
        const methodMatch = item.method === method;
        
        if (!methodMatch) return false;
        
        // 根据path类型进行不同的匹配逻辑
        if (typeof item.path === 'string') {
            // 字符串匹配
            return item.path === path;
        } else if (item.path instanceof RegExp) {
            // 正则表达式匹配
            return item.path.test(path);
        }
        
        return false;
    });
    
    if (isInList) {
        console.log('请求在白名单中，跳过JWT验证:', originalMethod, path);
    } else {
        console.log('请求不在白名单中，需要JWT验证:', originalMethod, path);
    }
    
    return isInList;
};

const jwtAuth = async (ctx: Context, next: Next): Promise<void> => {
    try {
        // 检查是否在白名单中
        if (isInWhiteList(ctx)) {
            console.log('请求在白名单中，跳过JWT验证:', ctx.request.method, ctx.request.path);
            await next();
            return;
        }
        
        console.log('需要JWT验证的请求:', ctx.request.method, ctx.request.path);
        
        // 从请求头获取Authorization
        const authHeader = ctx.request.headers.authorization;
        
        if (!authHeader) {
            ctx.status = 401;
            ctx.body = {
                status: 'fail',
                message: 'Authorization header is required'
            };
            return;
        }
        
        // 检查Bearer前缀
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            ctx.status = 401;
            ctx.body = {
                status: 'fail',
                message: 'Invalid authorization format. Expected: Bearer <token>'
            };
            return;
        }
        
        const token = parts[1];
        
        // 验证token
        const decoded = verifyAccessToken(token);
        
        // 将用户信息存储到ctx中，供后续使用
        ctx.state.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email
        };
        
        await next();
    } catch (error) {
        console.error('JWT验证失败:', (error as Error).message);
        
        // 直接设置响应，不抛出错误
        ctx.status = 401;
        if ((error as Error).name === 'TokenExpiredError') {
            ctx.body = {
                status: 'fail',
                message: 'Token has expired'
            };
        } else if ((error as Error).name === 'JsonWebTokenError') {
            ctx.body = {
                status: 'fail',
                message: 'Invalid token'
            };
        } else {
            ctx.body = {
                status: 'fail',
                message: (error as Error).message || 'Authentication failed'
            };
        }
    }
};

export default jwtAuth;