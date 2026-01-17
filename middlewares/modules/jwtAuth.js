// JWT认证中间件
const { verifyAccessToken } = require('../../utils/jwt');

// 白名单路由，不需要JWT验证
const whiteList = [
    // 注册和登录接口
    { method: 'POST', path: '/api/users/register' },
    { method: 'POST', path: '/api/users/login' },
    // 基础路由
    { method: 'GET', path: '/api/users' }
];

// 检查请求是否在白名单中
const isInWhiteList = (ctx) => {
    const { method, path } = ctx.request;
    return whiteList.some(item => item.method === method && item.path === path);
};

const jwtAuth = async (ctx, next) => {
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
        console.error('JWT验证失败:', error.message);
        
        // 直接设置响应，不抛出错误
        ctx.status = 401;
        if (error.name === 'TokenExpiredError') {
            ctx.body = {
                status: 'fail',
                message: 'Token has expired'
            };
        } else if (error.name === 'JsonWebTokenError') {
            ctx.body = {
                status: 'fail',
                message: 'Invalid token'
            };
        } else {
            ctx.body = {
                status: 'fail',
                message: error.message || 'Authentication failed'
            };
        }
    }
};

module.exports = jwtAuth;