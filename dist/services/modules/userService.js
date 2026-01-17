"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../../models/modules/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
const loginUser = async (email, password) => {
    const user = await User_1.default.findOne({ where: { email } });
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
//# sourceMappingURL=userService.js.map