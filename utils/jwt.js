const jwt = require('jsonwebtoken');

// JWT配置
const jwtConfig = {
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
 * @param {Object} payload - 令牌负载
 * @returns {string} 访问令牌
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, jwtConfig.accessSecret, {
        expiresIn: jwtConfig.accessExpiresIn
    });
};

/**
 * 生成刷新令牌
 * @param {Object} payload - 令牌负载
 * @returns {string} 刷新令牌
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
        expiresIn: jwtConfig.refreshExpiresIn
    });
};

/**
 * 生成双令牌（访问令牌和刷新令牌）
 * @param {Object} payload - 令牌负载
 * @returns {Object} 包含访问令牌和刷新令牌的对象
 */
const generateTokens = (payload) => {
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
 * @returns {Object} 解码后的令牌负载
 * @throws {Error} 令牌无效或过期时抛出错误
 */
const verifyAccessToken = (token) => {
    return jwt.verify(token, jwtConfig.accessSecret);
};

/**
 * 验证刷新令牌
 * @param {string} token - 刷新令牌
 * @returns {Object} 解码后的令牌负载
 * @throws {Error} 令牌无效或过期时抛出错误
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(token, jwtConfig.refreshSecret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken,
    jwtConfig
};
