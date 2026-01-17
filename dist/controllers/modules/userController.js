"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.getCurrentUser = getCurrentUser;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUsers = getUsers;
const User_1 = __importDefault(require("../../models/modules/User"));
const userService_1 = require("../../services/modules/userService");
const jwt_1 = require("../../utils/jwt");
const response_1 = require("../../utils/response");
const validation_1 = require("../../utils/validation");
async function getUserById(ctx) {
    const id = ctx.params.id;
    const user = await User_1.default.findByPk(id);
    if (user) {
        (0, response_1.sendSuccess)(ctx, 'User retrieved successfully', { user: user.toJSON() });
    }
    else {
        (0, response_1.sendNotFound)(ctx, 'User not found');
    }
}
async function getCurrentUser(ctx) {
    const userId = ctx.state.user.userId;
    const user = await User_1.default.findByPk(userId);
    if (user) {
        (0, response_1.sendSuccess)(ctx, 'User information retrieved successfully', { user: user.toJSON() });
    }
    else {
        (0, response_1.sendNotFound)(ctx, 'User not found');
    }
}
async function registerUser(ctx) {
    let body = ctx.request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (_) {
            (0, response_1.sendClientError)(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    const validationResult = (0, validation_1.validateRegisterBody)(body);
    if (validationResult.error) {
        const errorMessages = validationResult.error.details.map(detail => detail.message);
        (0, response_1.sendClientError)(ctx, errorMessages.join(', '));
        return;
    }
    const validatedBody = validationResult.value;
    const { username, email, password, nickname, avatar, gender, birthday, phone } = validatedBody;
    const additionalFields = {
        nickname,
        avatar,
        gender,
        birthday,
        phone
    };
    try {
        const user = await (0, userService_1.registerUser)(username, email, password, additionalFields);
        (0, response_1.sendCreated)(ctx, 'User registered successfully', { user: user.toJSON() });
    }
    catch (error) {
        (0, response_1.sendClientError)(ctx, error.message || 'Failed to register user');
    }
}
async function loginUser(ctx) {
    let body = ctx.request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (_) {
            (0, response_1.sendClientError)(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    const validationResult = (0, validation_1.validateLoginBody)(body);
    if (validationResult.error) {
        const errorMessages = validationResult.error.details.map(detail => detail.message);
        (0, response_1.sendClientError)(ctx, errorMessages.join(', '));
        return;
    }
    const validatedBody = validationResult.value;
    const { email, username, password } = validatedBody;
    try {
        const user = await (0, userService_1.loginUser)(email || username || '', password);
        const userData = user.get();
        const tokens = (0, jwt_1.generateTokens)({
            userId: userData.id,
            username: userData.username,
            email: userData.email
        });
        (0, response_1.sendSuccess)(ctx, 'Login successful', {
            user: user.toJSON(),
            tokens
        });
    }
    catch (error) {
        (0, response_1.sendUnauthorized)(ctx, error.message || 'Authentication failed');
    }
}
async function updateUser(ctx) {
    let body = ctx.request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        }
        catch (_) {
            (0, response_1.sendClientError)(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    const validationResult = (0, validation_1.validateUpdateUserBody)(body);
    if (validationResult.error) {
        const errorMessages = validationResult.error.details.map(detail => detail.message);
        (0, response_1.sendClientError)(ctx, errorMessages.join(', '));
        return;
    }
    const userId = ctx.state.user.userId;
    const updateData = validationResult.value;
    try {
        const updatedUser = await (0, userService_1.updateUser)(userId, updateData);
        (0, response_1.sendSuccess)(ctx, 'User updated successfully', { user: updatedUser.toJSON() });
    }
    catch (error) {
        (0, response_1.sendClientError)(ctx, error.message || 'Failed to update user');
    }
}
async function deleteUser(ctx) {
    const userId = ctx.state.user.userId;
    try {
        await (0, userService_1.deleteUser)(userId);
        (0, response_1.sendSuccess)(ctx, 'User deleted successfully');
    }
    catch (error) {
        (0, response_1.sendClientError)(ctx, error.message || 'Failed to delete user');
    }
}
async function getUsers(ctx) {
    const query = ctx.query;
    const params = query;
    const page = params.page ? parseInt(params.page, 10) : 1;
    const limit = params.limit ? parseInt(params.limit, 10) : 10;
    const keyword = params.keyword || '';
    const status = params.status;
    try {
        const { users, total, totalPages } = await (0, userService_1.getUsers)(page, limit, keyword, status);
        const usersData = users.map(user => user.toJSON());
        (0, response_1.sendSuccess)(ctx, 'Users retrieved successfully', {
            users: usersData,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        });
    }
    catch (error) {
        (0, response_1.sendClientError)(ctx, error.message || 'Failed to retrieve users');
    }
}
//# sourceMappingURL=userController.js.map