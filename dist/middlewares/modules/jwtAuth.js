"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../utils/jwt");
const whiteList = [
    { method: 'POST', path: '/api/users/register' },
    { method: 'POST', path: '/api/users/login' },
    { method: 'GET', path: /^\/api\/users$/ },
    { method: 'GET', path: /^\/api\/users\/\d+$/ },
];
const excludeRoutes = [
    { method: 'GET', path: '/api/users/me' }
];
const isInWhiteList = (ctx) => {
    const { method, path } = ctx.request;
    const isExcluded = excludeRoutes.some(item => {
        const methodMatch = item.method === method;
        if (!methodMatch)
            return false;
        if (typeof item.path === 'string') {
            return item.path === path;
        }
        else if (item.path instanceof RegExp) {
            return item.path.test(path);
        }
        return false;
    });
    if (isExcluded) {
        console.log('请求在排除列表中，需要JWT验证:', method, path);
        return false;
    }
    return whiteList.some(item => {
        const methodMatch = item.method === method;
        if (!methodMatch)
            return false;
        if (typeof item.path === 'string') {
            return item.path === path;
        }
        else if (item.path instanceof RegExp) {
            return item.path.test(path);
        }
        return false;
    });
};
const jwtAuth = async (ctx, next) => {
    try {
        if (isInWhiteList(ctx)) {
            console.log('请求在白名单中，跳过JWT验证:', ctx.request.method, ctx.request.path);
            await next();
            return;
        }
        console.log('需要JWT验证的请求:', ctx.request.method, ctx.request.path);
        const authHeader = ctx.request.headers.authorization;
        if (!authHeader) {
            ctx.status = 401;
            ctx.body = {
                status: 'fail',
                message: 'Authorization header is required'
            };
            return;
        }
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
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        ctx.state.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email
        };
        await next();
    }
    catch (error) {
        console.error('JWT验证失败:', error.message);
        ctx.status = 401;
        if (error.name === 'TokenExpiredError') {
            ctx.body = {
                status: 'fail',
                message: 'Token has expired'
            };
        }
        else if (error.name === 'JsonWebTokenError') {
            ctx.body = {
                status: 'fail',
                message: 'Invalid token'
            };
        }
        else {
            ctx.body = {
                status: 'fail',
                message: error.message || 'Authentication failed'
            };
        }
    }
};
exports.default = jwtAuth;
//# sourceMappingURL=jwtAuth.js.map