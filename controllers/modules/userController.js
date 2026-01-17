const User = require('../../models/modules/User');
const userService = require('../../services/modules/userService');
const { AppError } = require('../../utils/errorHandler');
const { generateTokens } = require('../../utils/jwt');

async function getUserById(ctx) {
    const id = ctx.params.id;
    const user = await User.findByPk(id);
    if (user) {
        ctx.body = user;
    } else {
        throw new AppError(404, 'User not found');
    }
}

async function registerUser(ctx) {
    let body = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (error) {
            throw new AppError(400, 'Invalid JSON format in request body');
        }
    }
    
    const username = body.username;
    const email = body.email;
    const password = body.password;
    
    if (!username || !email || !password) {
        throw new AppError(400, 'Username, email, and password are required');
    }
    
    // 准备额外的字段
    const additionalFields = {};
    if (body.nickname) additionalFields.nickname = body.nickname;
    if (body.avatar) additionalFields.avatar = body.avatar;
    if (body.gender) additionalFields.gender = body.gender;
    if (body.birthday) additionalFields.birthday = body.birthday;
    if (body.phone) additionalFields.phone = body.phone;
    
    const user = await userService.registerUser(username, email, password, additionalFields);
    
    ctx.status = 201;
    ctx.body = {
        message: 'User registered successfully',
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            gender: user.gender,
            birthday: user.birthday,
            phone: user.phone,
            status: user.status,
            createdAt: user.createdAt
        }
    };
}

async function loginUser(ctx) {
    let body = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (error) {
            throw new AppError(400, 'Invalid JSON format in request body');
        }
    }
    
    const email = body.email;
    const password = body.password;
    
    if (!email || !password) {
        throw new AppError(400, 'Email and password are required');
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
        
        ctx.status = 200;
        ctx.body = {
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                nickname: user.nickname,
                avatar: user.avatar,
                gender: user.gender,
                birthday: user.birthday,
                phone: user.phone,
                status: user.status
            },
            tokens
        };
    } catch (error) {
        throw new AppError(401, error.message);
    }
}

module.exports = {
    getUserById,
    registerUser,
    loginUser
};
