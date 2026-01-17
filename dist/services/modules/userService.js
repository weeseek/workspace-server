"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.deleteUser = exports.updateUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../../models/modules/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const registerUser = async (username, email, password, additionalFields = {}) => {
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    return await User_1.default.create({
        username,
        email,
        password: hashedPassword,
        ...additionalFields
    });
};
exports.registerUser = registerUser;
const loginUser = async (identifier, password) => {
    const user = await User_1.default.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { email: identifier },
                { username: identifier }
            ]
        }
    });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const userData = user.get();
    const isPasswordValid = await bcrypt_1.default.compare(password, userData.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    await user.update({ lastLoginAt: new Date() });
    return user;
};
exports.loginUser = loginUser;
const updateUser = async (userId, updateData) => {
    const user = await User_1.default.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    await user.update(updateData);
    return user;
};
exports.updateUser = updateUser;
const deleteUser = async (userId) => {
    const user = await User_1.default.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    await user.destroy();
    return true;
};
exports.deleteUser = deleteUser;
const getUsers = async (page = 1, limit = 10, keyword = '', status) => {
    const offset = (page - 1) * limit;
    const where = {};
    if (keyword) {
        where[sequelize_1.Op.or] = [
            { username: { [sequelize_1.Op.like]: `%${keyword}%` } },
            { email: { [sequelize_1.Op.like]: `%${keyword}%` } },
            { nickname: { [sequelize_1.Op.like]: `%${keyword}%` } }
        ];
    }
    if (status) {
        where.status = status;
    }
    const { rows: users, count: total } = await User_1.default.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    });
    const totalPages = Math.ceil(total / limit);
    return {
        users,
        total,
        page,
        limit,
        totalPages
    };
};
exports.getUsers = getUsers;
//# sourceMappingURL=userService.js.map