"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.getCurrentUser = getCurrentUser;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const User_1 = __importDefault(require("../../models/modules/User"));
const userService_1 = require("../../services/modules/userService");
const jwt_1 = require("../../utils/jwt");
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
    console.log(id);
    const user = await User_1.default.findByPk(id);
    if (user) {
        sendResponse(ctx, 200, 0, 'User retrieved successfully', { user: user.toJSON() });
    }
    else {
        sendResponse(ctx, 404, 404, 'User not found');
    }
}
async function getCurrentUser(ctx) {
    const userId = ctx.state.user.userId;
    const user = await User_1.default.findByPk(userId);
    if (user) {
        sendResponse(ctx, 200, 0, 'User information retrieved successfully', { user: user.toJSON() });
    }
    else {
        sendResponse(ctx, 404, 404, 'User not found');
    }
}
async function registerUser(ctx) {
    let body = ctx.request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (_) {
            sendResponse(ctx, 400, 400, 'Invalid JSON format in request body');
            return;
        }
    }
    const { username, email, password, nickname, avatar, gender, birthday, phone } = body;
    if (!username || !email || !password) {
        sendResponse(ctx, 400, 400, 'Username, email, and password are required');
        return;
    }
    const additionalFields = {
        nickname,
        avatar,
        gender,
        birthday,
        phone
    };
    const user = await (0, userService_1.registerUser)(username, email, password, additionalFields);
    sendResponse(ctx, 201, 0, 'User registered successfully', { user: user.toJSON() });
}
async function loginUser(ctx) {
    let body = ctx.request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (_) {
            sendResponse(ctx, 400, 400, 'Invalid JSON format in request body');
            return;
        }
    }
    const { email, password } = body;
    if (!email || !password) {
        sendResponse(ctx, 400, 400, 'Email and password are required');
        return;
    }
    try {
        const user = await (0, userService_1.loginUser)(email, password);
        const userData = user.get();
        const tokens = (0, jwt_1.generateTokens)({
            userId: userData.id,
            username: userData.username,
            email: userData.email
        });
        sendResponse(ctx, 200, 0, 'Login successful', {
            user: user.toJSON(),
            tokens
        });
    }
    catch (error) {
        sendResponse(ctx, 401, 401, error.message || 'Authentication failed');
    }
}
//# sourceMappingURL=userController.js.map