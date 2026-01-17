import User from '../../models/modules/User';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { RegisterRequestBody } from '../../types/user';

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
 * @param {string} identifier - 邮箱或用户名
 * @param {string} password - 密码
 * @returns {Promise<User>} 登录成功的用户对象
 * @throws {Error} 登录失败时抛出错误
 */
export const loginUser = async (
    identifier: string,
    password: string
): Promise<User> => {
    // 查找用户，支持通过email或username登录
    const user = await User.findOne({
        where: {
            [Op.or]: [
                { email: identifier },
                { username: identifier }
            ]
        }
    });
    
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

/**
 * 更新用户信息
 * @param {number} userId - 用户ID
 * @param {Partial<RegisterRequestBody>} updateData - 更新的数据
 * @returns {Promise<User>} 更新后的用户对象
 * @throws {Error} 更新失败时抛出错误
 */
export const updateUser = async (
    userId: number,
    updateData: Partial<RegisterRequestBody>
): Promise<User> => {
    // 查找用户
    const user = await User.findByPk(userId);
    
    if (!user) {
        throw new Error('User not found');
    }
    
    // 更新用户信息
    await user.update(updateData);
    
    return user;
};

/**
 * 删除用户
 * @param {number} userId - 用户ID
 * @returns {Promise<boolean>} 删除成功返回true
 * @throws {Error} 删除失败时抛出错误
 */
export const deleteUser = async (
    userId: number
): Promise<boolean> => {
    // 查找用户
    const user = await User.findByPk(userId);
    
    if (!user) {
        throw new Error('User not found');
    }
    
    // 删除用户
    await user.destroy();
    
    return true;
};

/**
 * 获取用户列表
 * @param {number} page - 页码，默认1
 * @param {number} limit - 每页条数，默认10
 * @param {string} keyword - 搜索关键字
 * @param {string} status - 用户状态
 * @returns {Promise<{ users: User[]; total: number; page: number; limit: number; totalPages: number }>} 用户列表和分页信息
 */
export const getUsers = async (
    page: number = 1,
    limit: number = 10,
    keyword: string = '',
    status?: 'active' | 'inactive' | 'banned'
): Promise<{ users: User[]; total: number; page: number; limit: number; totalPages: number }> => {
    // 计算偏移量
    const offset = (page - 1) * limit;
    
    // 构建查询条件
    const where: any = {};
    
    if (keyword) {
        where[Op.or] = [
            { username: { [Op.like]: `%${keyword}%` } },
            { email: { [Op.like]: `%${keyword}%` } },
            { nickname: { [Op.like]: `%${keyword}%` } }
        ];
    }
    
    if (status) {
        where.status = status;
    }
    
    // 查询用户列表和总数
    const { rows: users, count: total } = await User.findAndCountAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    });
    
    // 计算总页数
    const totalPages = Math.ceil(total / limit);
    
    return {
        users,
        total,
        page,
        limit,
        totalPages
    };
};