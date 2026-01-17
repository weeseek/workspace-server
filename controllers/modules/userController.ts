import { Context } from 'koa';
import User from '../../models/modules/User';
import { registerUser as registerUserService, loginUser as loginUserService } from '../../services/modules/userService';
import { generateTokens, JwtPayload } from '../../utils/jwt';

// 定义统一响应格式接口
interface ApiResponse {
    code: number;
    message: string;
    data: any;
}

// 定义注册请求体接口
interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
    nickname?: string | null;
    avatar?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    birthday?: Date | null;
    phone?: string | null;
}

// 定义登录请求体接口
interface LoginRequestBody {
    email: string;
    password: string;
}

/**
 * 统一响应格式
 * @param {Context} ctx - Koa上下文对象
 * @param {number} statusCode - HTTP状态码
 * @param {number} code - 业务状态码
 * @param {string} message - 响应消息
 * @param {any} data - 响应数据
 */
const sendResponse = (ctx: Context, statusCode: number, code: number, message: string, data: any = null): void => {
    ctx.status = statusCode;
    ctx.body = {
        code,
        message,
        data
    } as ApiResponse;
};

/**
 * 根据ID获取用户信息
 * @param {Context} ctx - Koa上下文对象
 */
export async function getUserById(ctx: Context): Promise<void> {
    const id = ctx.params.id;
    const user = await User.findByPk(id);
    if (user) {
        sendResponse(ctx, 200, 0, 'User retrieved successfully', { user: user.toJSON() });
    } else {
        sendResponse(ctx, 404, 404, 'User not found');
    }
}

/**
 * 获取当前登录用户信息
 * @param {Context} ctx - Koa上下文对象
 */
export async function getCurrentUser(ctx: Context): Promise<void> {
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

/**
 * 注册新用户
 * @param {Context} ctx - Koa上下文对象
 */
export async function registerUser(ctx: Context): Promise<void> {
    let body: any = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (_) {
            sendResponse(ctx, 400, 400, 'Invalid JSON format in request body');
            return;
        }
    }
    
    const { username, email, password, nickname, avatar, gender, birthday, phone } = body as RegisterRequestBody;
    
    if (!username || !email || !password) {
        sendResponse(ctx, 400, 400, 'Username, email, and password are required');
        return;
    }
    
    // 准备额外的字段
    const additionalFields = {
        nickname,
        avatar,
        gender,
        birthday,
        phone
    };
    
    const user = await registerUserService(username, email, password, additionalFields);
    
    sendResponse(ctx, 201, 0, 'User registered successfully', { user: user.toJSON() });
}

/**
 * 用户登录
 * @param {Context} ctx - Koa上下文对象
 */
export async function loginUser(ctx: Context): Promise<void> {
    let body: any = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (_) {
            sendResponse(ctx, 400, 400, 'Invalid JSON format in request body');
            return;
        }
    }
    
    const { email, password } = body as LoginRequestBody;
    
    if (!email || !password) {
        sendResponse(ctx, 400, 400, 'Email and password are required');
        return;
    }
    
    try {
        // 调用服务层进行登录验证
        const user = await loginUserService(email, password);
        
        // 生成双令牌
        const userData = user.get();
        const tokens = generateTokens({
            userId: userData.id,
            username: userData.username,
            email: userData.email
        } as JwtPayload);
        
        sendResponse(ctx, 200, 0, 'Login successful', {
            user: user.toJSON(),
            tokens
        });
    } catch (error) {
        sendResponse(ctx, 401, 401, (error as Error).message || 'Authentication failed');
    }
}