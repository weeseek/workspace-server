import User from '../../models/modules/User';
import bcrypt from 'bcrypt';

// 定义额外字段接口
interface AdditionalUserFields {
    nickname?: string | null;
    avatar?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    birthday?: Date | null;
    phone?: string | null;
}

/**
 * 注册新用户
 * @param {string} username - 用户名
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 * @param {AdditionalUserFields} additionalFields - 额外字段
 * @returns {Promise<User>} 创建的用户对象
 */
export const registerUser = async (
    username: string,
    email: string,
    password: string,
    additionalFields: AdditionalUserFields = {}
): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({
        username,
        email,
        password: hashedPassword,
        ...additionalFields
    });
};

/**
 * 用户登录
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 * @returns {Promise<User>} 登录成功的用户对象
 * @throws {Error} 登录失败时抛出错误
 */
export const loginUser = async (
    email: string,
    password: string
): Promise<User> => {
    // 查找用户
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
        throw new Error('Invalid email or password');
    }
    
    // 获取原始用户数据，包括密码
    const userData = user.get();
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    
    // 更新最后登录时间
    await user.update({ lastLoginAt: new Date() });
    
    return user;
};