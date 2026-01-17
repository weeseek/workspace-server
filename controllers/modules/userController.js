const User = require('../../models/modules/User');
const userService = require('../../services/modules/userService');
const { AppError } = require('../../utils/errorHandler');
const { generateTokens } = require('../../utils/jwt');

// 直接使用模型的toJSON方法格式化用户信息，不再需要自定义formatUserResponse函数

/**
 * 统一响应格式
 * @param {Object} ctx - Koa上下文对象
 * @param {number} statusCode - HTTP状态码
 * @param {number} code - 业务状态码
 * @param {string} message - 响应消息
 * @param {Object|null} data - 响应数据
 */
const sendResponse = (ctx, statusCode, code, message, data = null) => {
    ctx.status = statusCode;
    ctx.body = {
        code,
        message,
        data
    };
};

async function getUserById(ctx) {
    const id = ctx.params.id;
    const user = await User.findByPk(id);
    if (user) {
        sendResponse(ctx, 200, 0, 'User retrieved successfully', { user: user.toJSON() });
    } else {
        sendResponse(ctx, 404, 404, 'User not found');
    }
}

// 受保护的路由：获取当前登录用户信息
async function getCurrentUser(ctx) {
    // 从ctx.state.user获取用户ID
    const userId = ctx.state.user.userId;
    
    // 查询用户信息
    const user = await User.findByPk(userId);
    if (user) {
        sendResponse(ctx, 200, 0, 'User information retrieved successfully', { user: user.toJSON() });
    } else {
        sendResponse(ctx, 404, 404, 'User not found');
    }
}

async function registerUser(ctx) {
    let body = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (error) {
            sendResponse(ctx, 400, 400, 'Invalid JSON format in request body');
            return;
        }
    }
    
    const username = body.username;
    const email = body.email;
    const password = body.password;
    
    if (!username || !email || !password) {
        sendResponse(ctx, 400, 400, 'Username, email, and password are required');
        return;
    }
    
    // 准备额外的字段
    const additionalFields = {};
    if (body.nickname) additionalFields.nickname = body.nickname;
    if (body.avatar) additionalFields.avatar = body.avatar;
    if (body.gender) additionalFields.gender = body.gender;
    if (body.birthday) additionalFields.birthday = body.birthday;
    if (body.phone) additionalFields.phone = body.phone;
    
    const user = await userService.registerUser(username, email, password, additionalFields);
    
    sendResponse(ctx, 201, 0, 'User registered successfully', { user: user.toJSON() });
}

async function loginUser(ctx) {
    let body = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (error) {
            sendResponse(ctx, 400, 400, 'Invalid JSON format in request body');
            return;
        }
    }
    
    const email = body.email;
    const password = body.password;
    
    if (!email || !password) {
        sendResponse(ctx, 400, 400, 'Email and password are required');
        return;
    }
    
    try {
        // 调用服务层进行登录验证
        const user = await userService.loginUser(email, password);
        
        // 生成双令牌
        const tokens = generateTokens({
            userId: user.id,
            username: user.username,
            email: user.email
        });
        
        sendResponse(ctx, 200, 0, 'Login successful', {
            user: user.toJSON(),
            tokens
        });
    } catch (error) {
        sendResponse(ctx, 401, 401, error.message || 'Authentication failed');
    }
}

module.exports = {
    getUserById,
    registerUser,
    loginUser,
    getCurrentUser
};
