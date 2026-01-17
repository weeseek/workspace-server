"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = exports.jwtConfig = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.jwtConfig = {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, exports.jwtConfig.accessSecret, {
        expiresIn: exports.jwtConfig.accessExpiresIn
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, exports.jwtConfig.refreshSecret, {
        expiresIn: exports.jwtConfig.refreshExpiresIn
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateTokens = (payload) => {
    const accessToken = (0, exports.generateAccessToken)(payload);
    const refreshToken = (0, exports.generateRefreshToken)(payload);
    return {
        accessToken,
        refreshToken
    };
};
exports.generateTokens = generateTokens;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, exports.jwtConfig.accessSecret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, exports.jwtConfig.refreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map