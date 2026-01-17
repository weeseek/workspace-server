import jwt from 'jsonwebtoken';

// 定义JWT负载接口
export interface JwtPayload {
    userId: number;
    username: string;
    email: string;
    [key: string]: any;
}

// 定义令牌对象接口
export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

// JWT配置
export const jwtConfig = {
    // 访问令牌密钥
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
    // 刷新令牌密钥
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    // 访问令牌过期时间（秒）
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    // 刷新令牌过期时间（秒）
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

/**
 * 生成访问令牌
 * @param {JwtPayload} payload - 令牌负载
 * @returns {string} 访问令牌
 */
export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, jwtConfig.accessSecret, {
        expiresIn: jwtConfig.accessExpiresIn as any
    });
};

/**
 * 生成刷新令牌
 * @param {JwtPayload} payload - 令牌负载
 * @returns {string} 刷新令牌
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
        expiresIn: jwtConfig.refreshExpiresIn as any
    });
};

/**
 * 生成双令牌（访问令牌和刷新令牌）
 * @param {JwtPayload} payload - 令牌负载
 * @returns {Tokens} 包含访问令牌和刷新令牌的对象
 */
export const generateTokens = (payload: JwtPayload): Tokens => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    return {
        accessToken,
        refreshToken
    };
};

/**
 * 验证访问令牌
 * @param {string} token - 访问令牌
 * @returns {JwtPayload} 解码后的令牌负载
 * @throws {Error} 令牌无效或过期时抛出错误
 */
export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, jwtConfig.accessSecret) as JwtPayload;
};

/**
 * 验证刷新令牌
 * @param {string} token - 刷新令牌
 * @returns {JwtPayload} 解码后的令牌负载
 * @throws {Error} 令牌无效或过期时抛出错误
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
};