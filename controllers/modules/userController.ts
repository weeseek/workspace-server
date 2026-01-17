import { Context } from 'koa';
import User from '../../models/modules/User';
import { registerUser as registerUserService, loginUser as loginUserService, updateUser as updateUserService, deleteUser as deleteUserService, getUsers as getUsersService } from '../../services/modules/userService';
import { generateTokens, JwtPayload } from '../../utils/jwt';
import { sendSuccess, sendCreated, sendNotFound, sendClientError, sendUnauthorized } from '../../utils/response';
import { RegisterRequestBody, LoginRequestBody, UpdateUserRequestBody, UserQueryParams } from '../../types/user';
import { validateRegisterBody, validateLoginBody, validateUpdateUserBody } from '../../utils/validation';

/**
 * 根据ID获取用户信息
 * @param {Context} ctx - Koa上下文对象
 */
export async function getUserById(ctx: Context): Promise<void> {
    const id = ctx.params.id;
    const user = await User.findByPk(id);
    if (user) {
        sendSuccess(ctx, 'User retrieved successfully', { user: user.toJSON() });
    } else {
        sendNotFound(ctx, 'User not found');
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
        sendSuccess(ctx, 'User information retrieved successfully', { user: user.toJSON() });
    } else {
        sendNotFound(ctx, 'User not found');
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
            sendClientError(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    
    // 验证请求体
    const validationResult = validateRegisterBody(body);
    if (validationResult.error) {
        const errorMessages = validationResult.error.details.map(detail => detail.message);
        sendClientError(ctx, errorMessages.join(', '));
        return;
    }
    
    const validatedBody = validationResult.value;
    const { username, email, password, nickname, avatar, gender, birthday, phone } = validatedBody;
    
    // 准备额外的字段
    const additionalFields = {
        nickname,
        avatar,
        gender,
        birthday,
        phone
    };
    
    try {
        const user = await registerUserService(username, email, password, additionalFields);
        sendCreated(ctx, 'User registered successfully', { user: user.toJSON() });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to register user');
    }
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
            sendClientError(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    
    // 验证请求体
    const validationResult = validateLoginBody(body);
    if (validationResult.error) {
        const errorMessages = validationResult.error.details.map(detail => detail.message);
        sendClientError(ctx, errorMessages.join(', '));
        return;
    }
    
    const validatedBody = validationResult.value;
    const { email, username, password } = validatedBody;
    
    try {
        // 调用服务层进行登录验证
        const user = await loginUserService(email || username || '', password);
        
        // 生成双令牌
        const userData = user.get();
        const tokens = generateTokens({
            userId: userData.id,
            username: userData.username,
            email: userData.email
        } as JwtPayload);
        
        sendSuccess(ctx, 'Login successful', {
            user: user.toJSON(),
            tokens
        });
    } catch (error) {
        sendUnauthorized(ctx, (error as Error).message || 'Authentication failed');
    }
}

/**
 * 更新用户信息
 * @param {Context} ctx - Koa上下文对象
 */
export async function updateUser(ctx: Context): Promise<void> {
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
    
    // 验证请求体
    const validationResult = validateUpdateUserBody(body);
    if (validationResult.error) {
        const errorMessages = validationResult.error.details.map(detail => detail.message);
        sendClientError(ctx, errorMessages.join(', '));
        return;
    }
    
    // 从ctx.state.user获取用户ID
    const userId = ctx.state.user.userId;
    
    const updateData = validationResult.value;
    
    try {
        const updatedUser = await updateUserService(userId, updateData);
        sendSuccess(ctx, 'User updated successfully', { user: updatedUser.toJSON() });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to update user');
    }
}

/**
 * 删除用户
 * @param {Context} ctx - Koa上下文对象
 */
export async function deleteUser(ctx: Context): Promise<void> {
    // 从ctx.state.user获取用户ID
    const userId = ctx.state.user.userId;
    
    try {
        await deleteUserService(userId);
        sendSuccess(ctx, 'User deleted successfully');
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to delete user');
    }
}

/**
 * 获取用户列表
 * @param {Context} ctx - Koa上下文对象
 */
export async function getUsers(ctx: Context): Promise<void> {
    const query = ctx.query as any;
    const params = query as UserQueryParams;
    
    // 解析分页参数
    const page = params.page ? parseInt(params.page as any, 10) : 1;
    const limit = params.limit ? parseInt(params.limit as any, 10) : 10;
    
    // 解析筛选参数
    const keyword = params.keyword || '';
    const status = params.status as 'active' | 'inactive' | 'banned' | undefined;
    
    try {
        const { users, total, totalPages } = await getUsersService(page, limit, keyword, status);
        
        // 转换用户数据，使用toJSON方法排除敏感字段
        const usersData = users.map(user => user.toJSON());
        
        sendSuccess(ctx, 'Users retrieved successfully', {
            users: usersData,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to retrieve users');
    }
}