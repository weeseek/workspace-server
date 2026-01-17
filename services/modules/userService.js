const User = require('../../models/modules/User');
const bcrypt = require('bcrypt');

async function registerUser(username, email, password, additionalFields = {}) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({
        username,
        email,
        password: hashedPassword,
        ...additionalFields
    });
}

async function loginUser(email, password) {
    // 查找用户
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
        throw new Error('Invalid email or password');
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    
    // 更新最后登录时间
    await user.update({ lastLoginAt: new Date() });
    
    return user;
}

module.exports = {
    registerUser,
    loginUser
};
